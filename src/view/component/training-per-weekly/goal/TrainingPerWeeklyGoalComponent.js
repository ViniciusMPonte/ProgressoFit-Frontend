import { TrainingPerWeeklyGoalService } from './service/TrainingPerWeeklyGoalService.js'
import { TrainingGoalCalculatorService } from './service/TrainingGoalCalculatorService.js'
import { PeriodDataService } from './service/PeriodDataService.js'
import { GoalStatusService } from './service/GoalStatusService.js'
import { MathHelper } from './helper/MathHelper.js'
import { ProgressStorageService } from '../../../../service/ProgressStorageService.js'
import { AIService } from '../../../../service/AIService.js'
import { PromptService } from '../../../../service/PromptService.js'

export class TrainingPerWeeklyGoalComponent {
    constructor(targetTag) {
        this.targetTag = targetTag
        this.dom = new DOMElementManager()

        this.componentService = new TrainingPerWeeklyGoalService()
        this.calculatorService = new TrainingGoalCalculatorService()
        this.goalStatusService = new GoalStatusService()
        this.periodDataService = new PeriodDataService()
        this.progressStorageService = new ProgressStorageService('training-progress')
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
        this.renderCurrentStreakDashboardCard()
        this.callbackProgress()
    }

    _initializeData(data) {
        this.trainingGoal = data.trainingGoal
        this.trainingData = data.trainingData
        this.currentPeriod = data.currentPeriod
        this.totalWeeks = data.trainingData.length
    }

    _calculateMetrics(data) {
        const trainingStatus = this.calculatorService.calculateConsecutiveWeeks(this.trainingData, data.trainingGoal.targetValue)

        this.consecutiveWeeksWithGoal = trainingStatus.consecutiveWeeks
        this.percentageGoal = MathHelper.calculatePercentage(this.consecutiveWeeksWithGoal, this.totalWeeks)
        this.goalFailed = this.goalStatusService.checkIfGoalFailed(trainingStatus.nextPeriodStartDate, this.trainingGoal.endDate, this.percentageGoal)
        this.periodDaysArray = this.periodDataService.transformWeeklyData(this.currentPeriod)
        this.needAIMessage = this.progressStorageService.storeProgressIfBetter(this.percentageGoal, this.goalFailed)
    }

    _createAIRequest() {
        if (this.needAIMessage) {
            this.aiService.createRequest(this.promptService.createCongratulationPrompt(this.percentageGoal, this.consecutiveWeeksWithGoal))
        }
    }

    renderGoalStatus(goalFailed) {
        const iconClass = goalFailed ? 'fa-face-sad-cry' : 'fa-face-laugh-beam'
        return `<i class="fa-solid ${iconClass} fa-2xl"></i>`
    }

    renderMessageTitle(goalFailed) {
        if (goalFailed) {
            return `Objetivo não foi atingido...`
        } else {
            return `Treinar ${this.trainingGoal.targetValue} vez(es) por semana`
        }
    }

    renderMessageSubtitle(goalFailed, percentageGoal) {
        if (goalFailed) {
            return `Crie uma nova meta para continuar.`
        } else if(percentageGoal < 100){
            return `Você está entro da meta!`
        } else{
            return `Parabéns! Você concluiu a meta!`
        }
    }

    renderMessageStatus(goalFailed, percentageGoal) {
        if (goalFailed) {
            return `Foi registrada uma semana com menos de ${this.trainingGoal.targetValue} treino(s)`
        } else if (this.consecutiveWeeksWithGoal == 0) {
            return `Faltam ${this.totalWeeks - this.consecutiveWeeksWithGoal} semana(s) pra concluir!`
        } else if(percentageGoal < 100){
            return `Você já treinou ${this.consecutiveWeeksWithGoal} semana(s) sem falhar — faltam ${
                this.totalWeeks - this.consecutiveWeeksWithGoal
            } semana(s) pra concluir!`
        } else {
            return `Você já treinou ${this.consecutiveWeeksWithGoal} semana(s) sem falhar. Crie uma nova meta para recomeçar!`
        }
    }

    renderPeriodDays(periodDaysArray) {
        return periodDaysArray
            .map(({ day, count }) => {
                const checkedClass = count !== 0 ? 'checked' : ''
                return `<span class="${checkedClass}">${day}</span>`
            })
            .join('')
    }

    get() {
        return /*html*/ `
            <div id="training-per-weekly-goal-view" class="card h-100">
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
                    <div class="period mb-3">
                        ${this.renderPeriodDays(this.periodDaysArray)}
                    </div>
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
    renderCurrentStreakDashboardCard() {
        const tag = document.querySelector('#currentStreak')
        if (!tag) return
        tag.innerHTML = `${this.consecutiveWeeksWithGoal * 7} dias`
    }
}

class DOMElementManager {
    constructor() {
        this.elements = {}
    }

    getTrainingPerWeeklyGoalView() {
        return this._getCachedElement('trainingPerWeeklyGoalView', '#training-per-weekly-goal-view')
    }

    getPeriod() {
        return this._getCachedElement('period', '#training-per-weekly-goal-view .period')
    }

    _getCachedElement(key, selector) {
        if (!this.elements[key]) {
            this.elements[key] = document.querySelector(selector)
        }
        return this.elements[key]
    }

    destroy() {
        this.elements = {}
    }
}
