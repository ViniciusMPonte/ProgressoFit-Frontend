export class TrainingPerWeeklyGoalComponent {
    constructor(targetTag, data) {
        this.targetTag = targetTag
        this.dom = new DOMElementManager()

        this.data = data
        this.periodDaysArray = this.transformArrayToPeriodDays(this.data, 7)
    }

    transformArrayToPeriodDays(dataArray, totalDays = null) {
        const periodDaysArray = {}
        const today = new Date()
        const lastDay = totalDays !== null ? totalDays : today.getDate()

        for (let day = 1; day <= lastDay; day++) {
            const dayStr = String(day).padStart(2, '0')
            periodDaysArray[dayStr] = '0'
        }

        dataArray.forEach((item) => {
            const day = item.date.split('-')[2]
            periodDaysArray[day] = String(item.count)
        })

        return periodDaysArray
    }

    renderPeriod() {
        const periodDays = 7
        const result = []

        const today = new Date()

        for (let i = periodDays; i > 0; i--) {
            const date = new Date(today)
            date.setDate(today.getDate() - (i - 1))

            const day = date.toLocaleDateString('pt-BR', {
                day: '2-digit',
            })

            const checked = this.periodDaysArray[day] !== '0' ? 'checked' : ''
            result.push(`<span class="${checked}">${day}</span>`)
        }

        return result.join('')
    }

    get() {
        return /*html*/ `
            <div id="training-per-weekly-goal-view" class="card">
                <div class="period">
                    ${this.renderPeriod()}
                </div>
                <div class="progress mb-3">
                    <div class="progress-bar bg-success w-25" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                        25%
                    </div>
                </div>
            </div>
        `
    }

    autoRender() {
        this.targetTag.innerHTML = this.get()
    }
}

class DOMElementManager {
    constructor() {
        this.elements = {}
    }

    getTrainingPerWeeklyGoalView() {
        if (!this.elements.trainingPerWeeklyGoalView) {
            this.elements.trainingPerWeeklyGoalView = document.querySelector('#training-per-weekly-goal-view')
        }
        return this.elements.trainingPerWeeklyGoalView
    }

    getPeriod() {
        if (!this.elements.period) {
            this.elements.period = document.querySelector('#training-per-weekly-goal-view .period')
        }
        return this.elements.period
    }

    destroy() {
        this.elements = {}
    }
}
