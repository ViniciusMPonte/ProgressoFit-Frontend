export default class BaseChartComponent {

    extractData(data, dataKey) {
        return data.map(item => item[dataKey]);
    }

    extractLabelsFromPeriods(periods) {
        return periods.map(item => {
            const [year, month, day] = item.weekStartDate.split('-');
            const startDate = new Date(year, month - 1, day);

            const [endYear, endMonth, endDay] = item.weekEndDate.split('-');
            const endDate = new Date(endYear, endMonth - 1, endDay);

            const startFormatted = startDate.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit'
            });
            const endFormatted = endDate.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit'
            });

            return `${startFormatted} - ${endFormatted}`;
        });
    }
}