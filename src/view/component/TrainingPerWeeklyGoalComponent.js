export class TrainingPerWeeklyGoalComponent {
    constructor(targetTag) {
        this.targetTag = targetTag
        this.dom = new DOMElementManager()

        // MOCK

        this.periodDaysArray = {
            '31': '1',
            '01': '0',
            '02': '0',
            '03': '1',
            '04': '0',
            '05': '1',
            '06': '0',
        }
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
