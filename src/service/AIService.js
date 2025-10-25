import { LocalStorageCRUDService } from './LocalStorageCRUDService.js'
import { AITextRequestDTO } from '../model/dto/AITextRequestDTO.js'

export class AIService {
    constructor() {
        this.storage = new LocalStorageCRUDService('ai_requests')
        this.storage.keepLast(10)
        this.ONE_HOUR_MS = 60 * 60 * 1000
    }

    createRequest(prompt) {
        const dto = AITextRequestDTO.create(prompt)
        const saved = this.storage.create(dto.toJSON())
        return AITextRequestDTO.fromJSON(saved)
    }

    getRequest(id) {
        const data = this.storage.getById(id)
        return data ? AITextRequestDTO.fromJSON(data) : null
    }

    getAllRequests() {
        return this.storage.getAll().map(item => AITextRequestDTO.fromJSON(item))
    }

    getPendingRequests() {
        return this.getAllRequests().filter(req => req.isPending())
    }

    getUnreadRequests() {
        return this.getAllRequests().filter(req => !req.isRead && req.isGenerated())
    }

    isAttemptValid(lastAttemptAt) {
        if (!lastAttemptAt) return true
        const now = new Date()
        const timeDiff = now - new Date(lastAttemptAt)
        return timeDiff < this.ONE_HOUR_MS
    }

    cleanExpiredPendingRequests() {
        const requests = this.getPendingRequests()
        let cleanedCount = 0

        requests.forEach(req => {
            if (req.lastAttemptAt && !this.isAttemptValid(req.lastAttemptAt)) {
                req.needsGeneration = false
                this.storage.update(this.findIdByRequest(req), req.toJSON())
                cleanedCount++
            }
        })

        return cleanedCount
    }

    findIdByRequest(dto) {
        const all = this.storage.getAll()
        const found = all.find(
            item =>
                item.prompt === dto.prompt &&
                item.createdAt === dto.createdAt.toISOString()
        )
        return found ? found.id : null
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    async generateResponse(id) {
        const data = this.storage.getById(id)
        if (!data) {
            throw new Error(`Solicitação ${id} não encontrada`)
        }

        const dto = AITextRequestDTO.fromJSON(data)

        if (!dto.needsGeneration) {
            return dto
        }

        if (dto.lastAttemptAt && !this.isAttemptValid(dto.lastAttemptAt)) {
            dto.needsGeneration = false
            this.storage.update(id, dto.toJSON())
            throw new Error('Última tentativa expirou (mais de 1 hora). Solicitação cancelada.')
        }

        try {
            dto.recordAttempt()
            this.storage.update(id, dto.toJSON())

            const response = await apifree.chat(dto.prompt)

            dto.setAiResponse(response)
            this.storage.update(id, dto.toJSON())

            return dto
        } catch (error) {
            console.error('Erro ao gerar resposta:', error)
            throw error
        }
    }

    async generateResponseWithRetry(id, onRetry = null) {
        let attemptCount = 0

        while (true) {
            attemptCount++

            try {
                const result = await this.generateResponse(id)
                console.log(`✓ Resposta gerada com sucesso na tentativa ${attemptCount}`)
                return result
            } catch (error) {
                if (error.message.includes('expirou')) {
                    throw error
                }

                console.warn(`✗ Tentativa ${attemptCount} falhou: ${error.message}`)
                
                if (onRetry) {
                    onRetry(attemptCount, error)
                }

                console.log('⏳ Aguardando 10 segundos para próxima tentativa...')
                await this.sleep(10000)
            }
        }
    }

    async processAllPendingWithRetry(onProgress = null) {
        this.cleanExpiredPendingRequests()

        const pending = this.getPendingRequests()
        const results = []

        console.log(`📋 Iniciando processamento de ${pending.length} solicitações pendentes...`)

        for (let i = 0; i < pending.length; i++) {
            const req = pending[i]
            const id = this.findIdByRequest(req)

            if (!id) {
                results.push({ success: false, error: 'ID não encontrado', request: req })
                continue
            }

            console.log(`\n🔄 Processando ${i + 1}/${pending.length}: "${req.prompt}"`)

            try {
                const result = await this.generateResponseWithRetry(id, (attempt, error) => {
                    if (onProgress) {
                        onProgress({
                            current: i + 1,
                            total: pending.length,
                            attempt,
                            prompt: req.prompt,
                            error: error.message,
                        })
                    }
                })

                results.push({ success: true, data: result })
                console.log(`✓ Concluído ${i + 1}/${pending.length}`)
            } catch (error) {
                results.push({ success: false, error: error.message, request: req })
                console.error(`✗ Falha permanente em ${i + 1}/${pending.length}: ${error.message}`)
            }
        }

        console.log(`\n✅ Processamento concluído: ${results.filter(r => r.success).length}/${pending.length} com sucesso`)
        return results
    }

    async processAllPending() {
        this.cleanExpiredPendingRequests()

        const pending = this.getPendingRequests()
        const results = []

        for (const req of pending) {
            try {
                const id = this.findIdByRequest(req)
                if (id) {
                    const result = await this.generateResponse(id)
                    results.push({ success: true, data: result })
                }
            } catch (error) {
                results.push({ success: false, error: error.message, request: req })
            }
        }

        return results
    }

    markAsRead(id) {
        const data = this.storage.getById(id)
        if (!data) {
            throw new Error(`Solicitação ${id} não encontrada`)
        }

        const dto = AITextRequestDTO.fromJSON(data)
        dto.markAsRead()
        this.storage.update(id, dto.toJSON())
        return dto
    }

    markAsUnread(id) {
        const data = this.storage.getById(id)
        if (!data) {
            throw new Error(`Solicitação ${id} não encontrada`)
        }

        const dto = AITextRequestDTO.fromJSON(data)
        dto.markAsUnread()
        this.storage.update(id, dto.toJSON())
        return dto
    }

    requestRegeneration(id) {
        const data = this.storage.getById(id)
        if (!data) {
            throw new Error(`Solicitação ${id} não encontrada`)
        }

        const dto = AITextRequestDTO.fromJSON(data)
        dto.markForRegeneration()
        this.storage.update(id, dto.toJSON())
        return dto
    }

    deleteRequest(id) {
        return this.storage.delete(id)
    }

    deleteAllRequests() {
        return this.storage.deleteAll()
    }

    getStats() {
        const all = this.getAllRequests()
        return {
            total: all.length,
            pending: all.filter(r => r.isPending()).length,
            generated: all.filter(r => r.isGenerated()).length,
            unread: all.filter(r => !r.isRead && r.isGenerated()).length,
        }
    }
}

