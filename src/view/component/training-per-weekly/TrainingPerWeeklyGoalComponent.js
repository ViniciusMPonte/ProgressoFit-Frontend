export class TrainingPerWeeklyGoalComponent {
    constructor(targetTag, data) {
        this.targetTag = targetTag
        this.dom = new DOMElementManager()

        this._initializeData(data)
        this._calculateMetrics(data)
    }

    _initializeData(data) {
        this.trainingGoal = data.trainingGoal
        this.trainingData = data.trainingData
        this.currentPeriod = data.currentPeriod
        this.totalWeeks = data.trainingData.length
    }

    _calculateMetrics(data) {
        const trainingStatus = this._calculateConsecutiveWeeksWithGoal(this.trainingData, data.trainingGoal.targetValue)

        this.consecutiveWeeksWithGoal = trainingStatus.consecutiveWeeks
        this.percentageGoal = this._calculatePercentage(this.consecutiveWeeksWithGoal, this.totalWeeks)
        this.goalFailed = this._checkIfGoalFailed(trainingStatus.nextPeriodStartDate, this.trainingGoal.endDate)
        this.periodDaysArray = this._transformArrayToPeriodDays(this.currentPeriod, this.trainingGoal.periodDays)
    }

    _calculateConsecutiveWeeksWithGoal(weeklyData, minTrainings = 3) {
        const today = this._getTodayAtMidnight()
        const completedWeeks = this._getCompletedWeeks(weeklyData, today)

        if (completedWeeks.length === 0) {
            return {
                consecutiveWeeks: 0,
                nextPeriodStartDate: null,
            }
        }

        const { consecutiveCount, lastWeekEndDate } = this._countConsecutiveWeeks(completedWeeks, minTrainings)
        const nextPeriodStartDate = this._calculateNextPeriodStartDate(lastWeekEndDate)

        return {
            consecutiveWeeks: consecutiveCount,
            nextPeriodStartDate,
        }
    }

    _getTodayAtMidnight() {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return today
    }

    _getCompletedWeeks(weeklyData, today) {
        return weeklyData.filter((week) => {
            const weekEndDate = new Date(week.weekEndDate)
            return weekEndDate < today
        })
    }

    _countConsecutiveWeeks(completedWeeks, minTrainings) {
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

        return { consecutiveCount, lastWeekEndDate }
    }

    _calculateNextPeriodStartDate(lastWeekEndDate) {
        if (!lastWeekEndDate) return null

        const endDate = new Date(lastWeekEndDate)
        endDate.setDate(endDate.getDate() + 7)
        return endDate.toISOString().split('T')[0]
    }

    _calculatePercentage(value, total, decimals = 0) {
        if (total === 0) return 0

        const percentage = (value / total) * 100
        return Number(percentage.toFixed(decimals))
    }

    _checkIfGoalFailed(nextPeriodStartDate, lastDay) {
        if (!nextPeriodStartDate) return true

        const nextPeriod = this._parseDate(nextPeriodStartDate)
        const today = this._getTodayAtMidnight()

        if (this._hasSequenceBroken(nextPeriod, today)) return true
        if (this._hasFailedBeforeEndDate(lastDay, today, nextPeriod)) return true

        return false
    }

    _hasSequenceBroken(nextPeriod, today) {
        return nextPeriod < today
    }

    _hasFailedBeforeEndDate(lastDay, today, nextPeriod) {
        if (!lastDay) return false

        const last = this._parseDate(lastDay)
        return today > last && nextPeriod <= last
    }

    _parseDate(dateString) {
        const [year, month, day] = dateString.split('-').map(Number)
        const date = new Date(year, month - 1, day)
        date.setHours(0, 0, 0, 0)
        return date
    }

    _transformArrayToPeriodDays(dataArray, totalDays = null) {
        const periodDaysArray = this._initializePeriodDays(totalDays)
        this._fillPeriodDaysWithData(periodDaysArray, dataArray)
        return periodDaysArray
    }

    _initializePeriodDays(totalDays) {
        const periodDaysArray = {}
        const today = new Date()
        const lastDay = totalDays ?? today.getDate()

        for (let day = 1; day <= lastDay; day++) {
            const dayStr = String(day).padStart(2, '0')
            periodDaysArray[dayStr] = '0'
        }

        return periodDaysArray
    }

    _fillPeriodDaysWithData(periodDaysArray, dataArray) {
        dataArray.forEach((item) => {
            const day = item.date.split('-')[2]
            periodDaysArray[day] = String(item.count)
        })
    }

    _renderGoalStatus() {
        const iconClass = this.goalFailed ? 'fa-square-xmark' : 'fa-square-check'

        return `<i class="fa-solid ${iconClass} fa-xl"></i>`
    }

    _renderPeriod() {
        const PERIOD_DAYS = 7
        const today = new Date()
        const periodElements = []

        for (let i = PERIOD_DAYS; i > 0; i--) {
            const date = this._getDateDaysAgo(today, i - 1)
            const day = this._formatDay(date)
            const checkedClass = this._getCheckedClass(day)

            periodElements.push(`<span class="${checkedClass}">${day}</span>`)
        }

        return periodElements.join('')
    }

    _getDateDaysAgo(today, daysAgo) {
        const date = new Date(today)
        date.setDate(today.getDate() - daysAgo)
        return date
    }

    _formatDay(date) {
        return date.toLocaleDateString('pt-BR', { day: '2-digit' })
    }

    _getCheckedClass(day) {
        return this.periodDaysArray[day] !== '0' ? 'checked' : ''
    }

    get() {
        return /*html*/ `
            <div id="training-per-weekly-goal-view" class="card">
                <p>Status: ${this._renderGoalStatus()}</p>
                <div class="period">
                    ${this._renderPeriod()}
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
