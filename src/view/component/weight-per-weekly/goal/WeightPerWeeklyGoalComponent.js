import { WeightPerWeeklyGoalService } from './service/WeightPerWeeklyGoalService.js'
import { MathHelper } from '../../training-per-weekly/goal/helper/MathHelper.js'
import { GoalStatusService } from './service/GoalStatusService.js'
import { ProgressStorageService } from '../../../../service/ProgressStorageService.js'

export class WeightPerWeeklyGoalComponent {
    constructor(targetTag) {
        this.targetTag = targetTag

        this.dom = new DOMElementManager()
        this.componentService = new WeightPerWeeklyGoalService()
        this.goalStatusService = new GoalStatusService()
        this.progressStorageService = new ProgressStorageService('weight-progress')
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
        this.weightGoal = data.weightGoal
        this.weightStartDate = data.weightStartDate
        this.weightEndDate = data.weightEndDate
    }

    _calculateMetrics(data) {
        const diff = data.weightGoal.targetValue - data.weightStartDate.weightKg
        const direction = Math.sign(diff)

        const targetGoal = Math.abs(data.weightGoal.targetValue - data.weightStartDate.weightKg)
        const currentResult = (data.weightEndDate.weightKg - data.weightStartDate.weightKg) * direction

        this.percentageGoal = MathHelper.calculatePercentage(currentResult, targetGoal)
        this.goalFailed = this.goalStatusService.checkIfGoalFailed(
            data.weightGoal.targetValue,
            this.weightEndDate.weightKg,
            direction,
            data.weightGoal.endDate
        )
        this.progressStorageService.storeProgressIfBetter(this.percentageGoal, this.goalFailed)
    }

    renderGoalStatus(goalFailed) {
        const iconClass = goalFailed ? 'fa-square-xmark' : 'fa-square-check'
        return `<i class="fa-solid ${iconClass} fa-xl"></i>`
    }

    get() {
        return /*html*/ `
            <div id="weight-per-weekly-goal-view" class="card">
                <p>Status: ${this.renderGoalStatus(this.goalFailed)}</p>
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

    destroy() {
        this.elements = {}
    }
}
