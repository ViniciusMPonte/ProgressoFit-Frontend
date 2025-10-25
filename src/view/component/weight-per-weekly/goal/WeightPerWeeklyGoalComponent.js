import { WeightPerWeeklyGoalService } from './service/WeightPerWeeklyGoalService.js'
import { MathHelper } from '../../training-per-weekly/goal/helper/MathHelper.js'
import { GoalStatusService } from './service/GoalStatusService.js'
import { ProgressStorageService } from '../../../../service/ProgressStorageService.js'
import { AIService } from '../../../../service/AIService.js'
import { PromptService } from '../../../../service/PromptService.js'

export class WeightPerWeeklyGoalComponent {
    constructor(targetTag) {
        this.targetTag = targetTag

        this.dom = new DOMElementManager()
        this.componentService = new WeightPerWeeklyGoalService()
        this.goalStatusService = new GoalStatusService()
        this.progressStorageService = new ProgressStorageService('weight-progress')
        this.aiService = new AIService()
        this.promptService = new PromptService()
    }

    setCallbackProgress(cbFuction) {
        this.callbackProgress = cbFuction
    }

    async autoRender() {
        const data = await this.componentService.getDataCurrentGoal()

        this._initializeData(data)
        this._calculateMetrics(data)
        this._createAIRequest()

        this.targetTag.innerHTML = this.get()
        this.renderCurrentWeightDashboardCard()
        this.callbackProgress()
    }

    _initializeData(data) {
        this.weightGoal = data.weightGoal
        this.weightStartDate = data.weightStartDate
        this.weightEndDate = data.weightEndDate
        this.currentWeight = data.weightEndDate.weightKg
        this.targetWeight = data.weightGoal.targetValue
    }

    _calculateMetrics(data) {
        const diff = data.weightGoal.targetValue - data.weightStartDate.weightKg
        this.direction = Math.sign(diff)

        const targetGoal = Math.abs(data.weightGoal.targetValue - data.weightStartDate.weightKg)
        const currentResult = (data.weightEndDate.weightKg - data.weightStartDate.weightKg) * this.direction

        this.percentageGoal = MathHelper.calculatePercentage(currentResult, targetGoal)
        this.goalFailed = this.goalStatusService.checkIfGoalFailed(
            data.weightGoal.targetValue,
            this.weightEndDate.weightKg,
            this.direction,
            data.weightGoal.endDate
        )
        this.needAIMessage = this.progressStorageService.storeProgressIfBetter(this.percentageGoal, this.goalFailed)
    }

    _createAIRequest() {
        if (this.needAIMessage) {
            this.aiService.createRequest(
                this.promptService.createWeightCongratulationPrompt(this.percentageGoal, this.currentWeight, this.targetWeight, this.direction)
            )
        }
    }

    renderMessageTitle(goalFailed) {
        if (goalFailed) {
            return `Objetivo não foi atingido...`
        } else {
            return `Chegar a ${this.targetWeight} kg`
        }
    }

    renderMessageSubtitle(goalFailed, percentageGoal) {
        if (goalFailed) {
            return `Crie uma nova meta para continuar.`
        } else if (percentageGoal < 100) {
            return `Você está entro da meta!`
        } else {
            return `Parabéns! Você concluiu a meta!`
        }
    }

    renderGoalStatus(goalFailed) {
        const iconClass = goalFailed ? 'fa-face-sad-cry' : 'fa-face-laugh-beam'
        return `<i class="fa-solid ${iconClass} fa-2xl"></i>`
    }

    renderMessageStatus(goalFailed, percentageGoal) {
        if (goalFailed) {
            return `Objetivo não foi atingido... Não desista, crie uma nova meta para continuar.`
        } else {
            const totalGoal = Math.abs(this.targetWeight - this.weightStartDate.weightKg)
            const achieved = Math.abs(this.currentWeight - this.weightStartDate.weightKg)
            const remaining = Math.abs(this.targetWeight - this.currentWeight)
            const directionText = this.direction > 0 ? 'ganhar' : 'perder'

            if (achieved === 0) {
                return `Faltam ${totalGoal.toFixed(1)} kg para ${directionText}!`
            } else if (percentageGoal < 100) {
                return `Você já conseguiu ${directionText} ${achieved.toFixed(1)} kg — faltam ${remaining.toFixed(1)} kg para atingir a meta!`
            } else {
                return `Você já conseguiu ${directionText} ${achieved.toFixed(1)} kg. Crie uma nova meta para recomeçar!`
            }
        }
    }

    get() {
        return /*html*/ `
<div id="weight-per-weekly-goal-view" class="card h-100">
    <div class="card-header d-flex column-gap-2">
        <div class="d-flex align-items-center">${this.renderGoalStatus(this.goalFailed)}</div>
        <div>
            <label class="g-bold">${this.renderMessageTitle(this.goalFailed)}</label>
            <div>${this.renderMessageSubtitle(this.goalFailed, this.percentageGoal)}</div>
        </div>
    </div>
    <div class="form-group h-100">
        <div>${this.renderMessageStatus(this.goalFailed, this.percentageGoal)}</div>
    </div>
    <div class="card-footer text-muted">
        <div class="progress">
            <div class="progress-bar bg-success" role="progressbar" style="width: ${this.percentageGoal}%"
                aria-valuenow="${this.percentageGoal}" aria-valuemin="0" aria-valuemax="100">
                ${this.percentageGoal}%
            </div>
        </div>
    </div>
</div>
        `
    }

    //refatorar
    renderCurrentWeightDashboardCard() {
        const tag = document.querySelector('#currentWeight')
        if (!tag) return
        tag.innerHTML = `${this.currentWeight} Kg`
    }
}

class DOMElementManager {
    constructor() {
        this.elements = {}
    }

    destroy() {
        this.elements = {}
    }
}
