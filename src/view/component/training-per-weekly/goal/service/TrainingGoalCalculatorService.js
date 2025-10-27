import { DateHelper } from '../helper/DateHelper.js'

export class TrainingGoalCalculatorService {
    calculateConsecutiveWeeks(weeklyData, minTrainings) {
        const today = DateHelper.getTodayAtMidnight()
        const completedWeeks = this._getCompletedWeeks(weeklyData, today)

        let { consecutiveCount, lastWeekEndDate } = this._countConsecutiveWeeks(completedWeeks, minTrainings)

        if (!lastWeekEndDate) {
            lastWeekEndDate = this._getPreviousDay(weeklyData[0].weekStartDate)
        }

        const nextPeriodStartDate = this._calculateNextPeriodStartDate(lastWeekEndDate)

        return {
            consecutiveWeeks: consecutiveCount,
            nextPeriodStartDate,
        }
    }

    _getCompletedWeeks(weeklyData, today) {
        return weeklyData.filter(week => {
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

    _getPreviousDay(dateString) {
        const [year, month, day] = dateString.split('-')
        const date = new Date(year, month - 1, day)
        date.setDate(date.getDate() - 1)

        const newYear = date.getFullYear()
        const newMonth = String(date.getMonth() + 1).padStart(2, '0')
        const newDay = String(date.getDate()).padStart(2, '0')

        return `${newYear}-${newMonth}-${newDay}`
    }

    _calculateNextPeriodStartDate(lastWeekEndDate) {
        if (!lastWeekEndDate) return null
        return DateHelper.addDays(new Date(lastWeekEndDate), 7)
    }
}
