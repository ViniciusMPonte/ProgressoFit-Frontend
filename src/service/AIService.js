import { LocalStorageCRUDService } from './LocalStorageCRUDService.js'
import { AITextRequestDTO } from '../model/dto/AITextRequestDTO.js'

export class AIService {
    constructor() {
        this.storage = new LocalStorageCRUDService('ai_requests')
        this.ONE_HOUR_MS = 60 * 60 * 1000 // 1 hora em milissegundos
    }

    // Cria uma nova solicitação de geração
    createRequest(prompt) {
        const dto = AITextRequestDTO.create(prompt)
        const saved = this.storage.create(dto.toJSON())
        return AITextRequestDTO.fromJSON(saved)
    }

    // Busca uma solicitação por ID
    getRequest(id) {
        const data = this.storage.getById(id)
        return data ? AITextRequestDTO.fromJSON(data) : null
    }

    // Lista todas as solicitações
    getAllRequests() {
        return this.storage.getAll().map(item => AITextRequestDTO.fromJSON(item))
    }

    // Lista solicitações pendentes
    getPendingRequests() {
        return this.getAllRequests().filter(req => req.isPending())
    }

    // Lista solicitações não lidas
    getUnreadRequests() {
        return this.getAllRequests().filter(req => !req.isRead && req.isGenerated())
    }

    // Verifica se uma tentativa ainda é válida (menos de 1 hora)
    isAttemptValid(lastAttemptAt) {
        if (!lastAttemptAt) return true
        const now = new Date()
        const timeDiff = now - new Date(lastAttemptAt)
        return timeDiff < this.ONE_HOUR_MS
    }

    // Limpa solicitações pendentes expiradas (mais de 1 hora sem resposta)
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

    // Encontra o ID no storage a partir de um DTO
    findIdByRequest(dto) {
        const all = this.storage.getAll()
        const found = all.find(
            item =>
                item.prompt === dto.prompt &&
                item.createdAt === dto.createdAt.toISOString()
        )
        return found ? found.id : null
    }

    // Aguarda um tempo em milissegundos
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    // Gera resposta da IA para uma solicitação (sem retry)
    async generateResponse(id) {
        const data = this.storage.getById(id)
        if (!data) {
            throw new Error(`Solicitação ${id} não encontrada`)
        }

        const dto = AITextRequestDTO.fromJSON(data)

        // Verifica se precisa gerar
        if (!dto.needsGeneration) {
            return dto
        }

        // Verifica se a última tentativa ainda é válida
        if (dto.lastAttemptAt && !this.isAttemptValid(dto.lastAttemptAt)) {
            dto.needsGeneration = false
            this.storage.update(id, dto.toJSON())
            throw new Error('Última tentativa expirou (mais de 1 hora). Solicitação cancelada.')
        }

        try {
            // Registra a tentativa
            dto.recordAttempt()
            this.storage.update(id, dto.toJSON())

            // Chama a API
            const response = await apifree.chat(dto.prompt)

            // Salva a resposta
            dto.setAiResponse(response)
            this.storage.update(id, dto.toJSON())

            return dto
        } catch (error) {
            console.error('Erro ao gerar resposta:', error)
            throw error
        }
    }

    // Gera resposta com retry automático a cada 10 segundos até conseguir
    async generateResponseWithRetry(id, onRetry = null) {
        let attemptCount = 0

        while (true) {
            attemptCount++

            try {
                const result = await this.generateResponse(id)
                console.log(`✓ Resposta gerada com sucesso na tentativa ${attemptCount}`)
                return result
            } catch (error) {
                // Se for erro de expiração, não tenta novamente
                if (error.message.includes('expirou')) {
                    throw error
                }

                console.warn(`✗ Tentativa ${attemptCount} falhou: ${error.message}`)
                
                // Callback opcional para notificar sobre retry
                if (onRetry) {
                    onRetry(attemptCount, error)
                }

                // Aguarda 10 segundos antes de tentar novamente
                console.log('⏳ Aguardando 10 segundos para próxima tentativa...')
                await this.sleep(10000)
            }
        }
    }

    // Processa TODOS os pendentes com retry automático, um de cada vez
    async processAllPendingWithRetry(onProgress = null) {
        // Limpa expiradas antes de processar
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
                    // Callback interno de retry
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

    // Processa todas as solicitações pendentes
    async processAllPending() {
        // Limpa expiradas antes de processar
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

    // Marca solicitação como lida
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

    // Marca solicitação como não lida
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

    // Solicita regeração de uma resposta
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

    // Deleta uma solicitação
    deleteRequest(id) {
        return this.storage.delete(id)
    }

    // Deleta todas as solicitações
    deleteAllRequests() {
        return this.storage.deleteAll()
    }

    // Estatísticas
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

