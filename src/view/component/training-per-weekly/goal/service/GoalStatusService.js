import { DateHelper } from "../helper/DateHelper.js"

export class GoalStatusService {
    checkIfGoalFailed(nextPeriodStartDate, lastDay, percent) {
        if (percent >= 100) return false
        if (!nextPeriodStartDate) return true

        const nextPeriod = DateHelper.parseDate(nextPeriodStartDate)
        const today = DateHelper.getTodayAtMidnight()

        if (this._hasSequenceBroken(nextPeriod, today)) return true
        if (this._hasFailedBeforeEndDate(lastDay, today, nextPeriod)) return true

        return false
    }

    _hasSequenceBroken(nextPeriod, today) {
        return nextPeriod < today
    }

    _hasFailedBeforeEndDate(lastDay, today, nextPeriod) {
        if (!lastDay) return false

        const last = DateHelper.parseDate(lastDay)
        return today > last && nextPeriod <= last
    }
}
