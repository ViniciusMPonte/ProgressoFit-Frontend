import { LocalStorageCRUDService } from './LocalStorageCRUDService.js'
import { AIService } from './AIService.js'

export class ProgressStorageService extends LocalStorageCRUDService {
    constructor(label) {
        super(label)
        this.aiService = new AIService()

    }

    storeProgressIfBetter(percentageGoal, goalFailed) {
        if (goalFailed) return
        
        const items = this.getAll()
        if (items.length === 0) {
            const newProgress = this.create({
                percentage: percentageGoal,
                goalFailed: false,
            })
            return
        }

        const currentProgress = items[0]

        if (percentageGoal > currentProgress.percentage) {
            const updated = this.update(currentProgress.id, {
                percentage: percentageGoal,
                goalFailed: false,
            })
            this.aiService.createRequest(`Crie uma mensagem de parabenização por eu ter conseguido ${percentageGoal}% da minha meta de treinos semanal. Não me pergunte nada, apenas crie a mensagem.`)
        }
    }

    resetProgress() {
        const items = this.getAll()

        if (items.length === 0) {
            const newProgress = this.create({
                percentage: 0,
                goalFailed: false,
            })
            console.log('🔄 Progresso iniciado em 0%')
            return newProgress
        }

        const currentProgress = items[0]
        const reset = this.update(currentProgress.id, {
            percentage: 0,
            goalFailed: false,
        })
        console.log('🔄 Progresso resetado para 0%')
        return reset
    }

    getCurrentProgress() {
        const items = this.getAll()
        return items.length > 0 ? items[0] : null
    }
}
