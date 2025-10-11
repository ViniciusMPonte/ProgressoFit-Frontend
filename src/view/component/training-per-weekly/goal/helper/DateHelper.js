export class DateHelper {
    static getTodayAtMidnight() {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return today
    }

    static parseDate(dateString) {
        const [year, month, day] = dateString.split('-').map(Number)
        const date = new Date(year, month - 1, day)
        date.setHours(0, 0, 0, 0)
        return date
    }

    static getDateDaysAgo(referenceDate, daysAgo) {
        const date = new Date(referenceDate)
        date.setDate(referenceDate.getDate() - daysAgo)
        return date
    }

    static formatDay(date) {
        return date.toLocaleDateString('pt-BR', { day: '2-digit' })
    }

    static addDays(date, days) {
        const newDate = new Date(date)
        newDate.setDate(newDate.getDate() + days)
        return newDate.toISOString().split('T')[0]
    }
}
