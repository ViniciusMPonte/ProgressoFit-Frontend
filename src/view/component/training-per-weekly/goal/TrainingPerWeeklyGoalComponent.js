import { TrainingPerWeeklyGoalService } from './service/TrainingPerWeeklyGoalService.js'
import { TrainingGoalCalculatorService } from './service/TrainingGoalCalculatorService.js'
import { PeriodDataService } from './service/PeriodDataService.js'
import { GoalStatusService } from './service/GoalStatusService.js'
import { MathHelper } from './helper/MathHelper.js'
import { ProgressStorageService } from '../../../../service/ProgressStorageService.js'

export class TrainingPerWeeklyGoalComponent {
    constructor(targetTag) {
        this.targetTag = targetTag
        this.dom = new DOMElementManager()

        this.componentService = new TrainingPerWeeklyGoalService()
        this.calculatorService = new TrainingGoalCalculatorService()
        this.goalStatusService = new GoalStatusService()
        this.periodDataService = new PeriodDataService()
        this.progressStorageService = new ProgressStorageService('training-progress')
    }

    setCallbackProgress(cbFuction) {
        this.callbackProgress = cbFuction
    }

    async autoRender() {
        const data = await this.componentService.getDataCurrentGoal()

        this._initializeData(data)
        this._calculateMetrics(data)

        this.targetTag.innerHTML = this.get()
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
        this.goalFailed = this.goalStatusService.checkIfGoalFailed(trainingStatus.nextPeriodStartDate, this.trainingGoal.endDate)
        this.periodDaysArray = this.periodDataService.transformWeeklyData(this.currentPeriod)
        this.progressStorageService.storeProgressIfBetter(this.percentageGoal, this.goalFailed)
    }

    renderGoalStatus(goalFailed) {
        const iconClass = goalFailed ? 'fa-square-xmark' : 'fa-square-check'
        return `<i class="fa-solid ${iconClass} fa-xl"></i>`
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
            <div id="training-per-weekly-goal-view" class="card">
                <p>Status: ${this.renderGoalStatus(this.goalFailed)}</p>
                <div class="period">
                    ${this.renderPeriodDays(this.periodDaysArray)}
                </div>
                <div class="progress mb-3">
                    <div 
                        class="progress-bar bg-success" 
                        role="progressbar" 
                        style="width: ${this.percentageGoal}%" 
                        aria-valuenow="${this.percentageGoal}" 
                        aria-valuemin="0" 
                        aria-valuemax="100"
                    >
                        ${this.percentageGoal}%
                    </div>
                </div>
            </div>
        `
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
