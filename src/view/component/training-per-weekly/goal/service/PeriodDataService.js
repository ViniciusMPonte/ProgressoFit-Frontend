export class PeriodDataService {
    transformWeeklyData(weekData) {
        return weekData.map((item) => ({
            day: item.date.split('-')[2],
            count: item.count,
        }))
    }
}
