export class AITextRequestDTO {
    constructor(data = {}) {
        this.aiResponse = data.aiResponse || null
        this.isRead = data.isRead ?? false
        this.needsGeneration = data.needsGeneration ?? true
        this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date()
        this.lastAttemptAt = data.lastAttemptAt ? new Date(data.lastAttemptAt) : null
        this.prompt = data.prompt || ''
    }

    static create(prompt) {
        return new AITextRequestDTO({
            prompt,
            needsGeneration: true,
            isRead: false,
        })
    }

    markAsRead() {
        this.isRead = true
        return this
    }

    markAsUnread() {
        this.isRead = false
        return this
    }

    setAiResponse(response) {
        this.aiResponse = response
        this.needsGeneration = false
        this.lastAttemptAt = new Date()
        return this
    }

    recordAttempt() {
        this.lastAttemptAt = new Date()
        return this
    }

    markForRegeneration() {
        this.needsGeneration = true
        this.aiResponse = null
        return this
    }

    isPending() {
        return this.needsGeneration && !this.aiResponse
    }

    isGenerated() {
        return !this.needsGeneration && this.aiResponse !== null
    }

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

    static fromJSON(json) {
        return new AITextRequestDTO(json)
    }
}
