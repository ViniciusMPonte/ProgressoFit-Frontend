import { LocalStorageCRUDService } from './LocalStorageCRUDService.js'

export class ProgressStorageService extends LocalStorageCRUDService {
    constructor(label) {
        super(label)
    }

    storeProgressIfBetter(percentageGoal, goalFailed) {
        if (goalFailed) return false
        
        const items = this.getAll()
        if (items.length === 0) {
            const newProgress = this.create({
                percentage: percentageGoal,
                goalFailed: false,
            })
            return false
        }

        const currentProgress = items[0]

        if (percentageGoal > currentProgress.percentage) {
            const updated = this.update(currentProgress.id, {
                percentage: percentageGoal,
                goalFailed: false,
            })
            return true
        }

        return false
    }

    resetProgress() {
        const items = this.getAll()

        if (items.length === 0) {
            const newProgress = this.create({
                percentage: 0,
                goalFailed: false,
            })
            return newProgress
        }

        const currentProgress = items[0]
        const reset = this.update(currentProgress.id, {
            percentage: 0,
            goalFailed: false,
        })
        return reset
    }

    getCurrentProgress() {
        const items = this.getAll()
        return items.length > 0 ? items[0] : null
    }
}
