export class AITextRequestDTO {
    constructor(data = {}) {
        this.aiResponse = data.aiResponse || null
        this.isRead = data.isRead ?? false
        this.needsGeneration = data.needsGeneration ?? true
        this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date()
        this.lastAttemptAt = data.lastAttemptAt ? new Date(data.lastAttemptAt) : null
        this.prompt = data.prompt || ''
    }

    // Cria uma nova solicitação
    static create(prompt) {
        return new AITextRequestDTO({
            prompt,
            needsGeneration: true,
            isRead: false,
        })
    }

    // Marca como lido
    markAsRead() {
        this.isRead = true
        return this
    }

    // Marca como não lido
    markAsUnread() {
        this.isRead = false
        return this
    }

    // Define a resposta gerada pela IA
    setAiResponse(response) {
        this.aiResponse = response
        this.needsGeneration = false
        this.lastAttemptAt = new Date()
        return this
    }

    // Registra uma tentativa de geração
    recordAttempt() {
        this.lastAttemptAt = new Date()
        return this
    }

    // Marca que precisa gerar novamente
    markForRegeneration() {
        this.needsGeneration = true
        this.aiResponse = null
        return this
    }

    // Verifica se está pendente de geração
    isPending() {
        return this.needsGeneration && !this.aiResponse
    }

    // Verifica se foi gerado com sucesso
    isGenerated() {
        return !this.needsGeneration && this.aiResponse !== null
    }

    // Converte para objeto simples (útil para localStorage)
    toJSON() {
        return {
            aiResponse: this.aiResponse,
            isRead: this.isRead,
            needsGeneration: this.needsGeneration,
            createdAt: this.createdAt.toISOString(),
            lastAttemptAt: this.lastAttemptAt ? this.lastAttemptAt.toISOString() : null,
            prompt: this.prompt,
        }
    }

    // Cria instância a partir de objeto (útil ao ler do localStorage)
    static fromJSON(json) {
        return new AITextRequestDTO(json)
    }
}
