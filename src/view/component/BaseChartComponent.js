export default class BaseChartComponent {

    extractData(data, dataKey) {
        return data.map(item => item[dataKey]);
    }

    extractLabelsFromPeriods(periods) {
        return periods.map(item => {
            const startDate = new Date(item.weekStartDate);
            const endDate = new Date(item.weekEndDate);

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