import { DateHelper } from "../helper/DateHelper.js"

export class TrainingGoalCalculatorService {
    calculateConsecutiveWeeks(weeklyData, minTrainings = 3) {
        const today = DateHelper.getTodayAtMidnight()
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
        return DateHelper.addDays(new Date(lastWeekEndDate), 7)
    }
}
