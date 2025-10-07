export class TrainingPerWeeklyGoalComponent {
    constructor(targetTag, data) {
        this.targetTag = targetTag
        this.dom = new DOMElementManager()

        this.trainingGoal = data.trainingGoal
        this.trainingData = data.trainingData
        this.currentPeriod = data.currentPeriod

        this.totalWeeks = data.trainingData.length

        const trainingStatus = this.calculateConsecutiveWeeksWithGoal(this.trainingData, data.trainingGoal.targetValue)
        this.consecutiveWeeksWithGoal = trainingStatus.consecutiveWeeks
        this.percentageGoal = this.calculatePercentage(this.consecutiveWeeksWithGoal, this.totalWeeks)

        this.goalFailed = this.checkIfGoalFailed(trainingStatus.nextPeriodStartDate, this.trainingGoal.endDate)

        this.periodDaysArray = this.transformArrayToPeriodDays(this.currentPeriod, this.trainingGoal.periodDays)
    }

    calculateConsecutiveWeeksWithGoal(weeklyData, minTrainings = 3) {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const completedWeeks = weeklyData.filter((week) => {
            const weekEndDate = new Date(week.weekEndDate)
            return weekEndDate < today
        })

        if (completedWeeks.length === 0) {
            return {
                consecutiveWeeks: 0,
                nextPeriodStartDate: null,
            }
        }

        let consecutiveCount = 0
        let lastWeekEndDate = null

        for (const week of completedWeeks) {
            if (week.totalTrainings >= minTrainings) {
                consecutiveCount++
                lastWeekEndDate = week.weekEndDate
            } else {
                break
            }
        }

        let nextPeriodStartDate = null
        if (lastWeekEndDate) {
            const endDate = new Date(lastWeekEndDate)
            endDate.setDate(endDate.getDate() + 7)
            nextPeriodStartDate = endDate.toISOString().split('T')[0]
        }

        return {
            consecutiveWeeks: consecutiveCount,
            nextPeriodStartDate: nextPeriodStartDate,
        }
    }

    calculatePercentage(value, total, decimals = 0) {
        if (total === 0) {
            return 0
        }

        const percentage = (value / total) * 100
        return Number(percentage.toFixed(decimals))
    }

    checkIfGoalFailed(nextPeriodStartDate, lastDay) {
        // Função helper para fazer parse correto da data YYYY-MM-DD
        const parseDate = (dateString) => {
            const [year, month, day] = dateString.split('-').map(Number)
            return new Date(year, month - 1, day) // month é 0-indexed
        }

        // Se não houver nextPeriodStartDate (nenhuma semana consecutiva desde o início), objetivo falhou
        if (!nextPeriodStartDate) {
            return true
        }

        const nextPeriod = parseDate(nextPeriodStartDate)
        nextPeriod.setHours(0, 0, 0, 0)

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        // Se a próxima data esperada já passou (está no passado), quebrou a sequência
        if (nextPeriod < today) {
            return true
        }

        // Se há lastDay e já passou dele, verifica se completou até o fim
        if (lastDay) {
            const last = parseDate(lastDay)
            last.setHours(0, 0, 0, 0)

            // Se hoje já passou do lastDay e nextPeriod ainda não chegou no lastDay,
            // significa que quebrou antes de completar
            if (today > last && nextPeriod <= last) {
                return true
            }
        }

        // Objetivo ainda está ativo
        return false
    }

    renderGoalStatus() {

        if (this.goalFailed) {
            return '<i class="fa-solid fa-square-xmark fa-xl"></i>'
        } else {
            return '<i class="fa-solid fa-square-check fa-xl"></i>'
        }
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
                <p>Status: ${this.renderGoalStatus()}</p>
                <div class="period">
                    ${this.renderPeriod()}
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
