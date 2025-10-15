import { DateHelper } from '../../../training-per-weekly/goal/helper/DateHelper.js'

export class GoalStatusService {
    checkIfGoalFailed(weightGoal, weightCurrent, direction, lastDay) {
        const lastDayGoal = DateHelper.parseDate(lastDay)
        const today = DateHelper.getTodayAtMidnight()

        if (!this._isGoalDeadlineReached(lastDayGoal, today)) return false

        return this._isGoalFailed(weightGoal, weightCurrent, direction)
    }

    _isGoalDeadlineReached(lastDayGoal, today) {
        return today >= lastDayGoal
    }

    _isGoalFailed(weightGoal, weightCurrent, direction) {
        if (direction > 0) {
            return weightCurrent < weightGoal
        } else if (direction < 0) {
            return weightCurrent > weightGoal
        }
        return true
    }
}