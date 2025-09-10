import ChartService from "../../service/ChartService.js";

export class TrainingPerWeeklyChartComponent {

    constructor(ctx, trainingData) {
        this.chartService = new ChartService(ctx);
        this.setTrainingData(trainingData)
    }

    setTrainingData(trainingData) {
        this.trainingData = this.convertTrainingDataShort(trainingData)
    }

    convertTrainingDataShort(trainingData) {
        if (!Array.isArray(trainingData) || trainingData.length === 0) {
            throw new Error("Os dados devem ser um array não vazio.");
        }

        const labels = trainingData.map(item => {
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

        const data = trainingData.map(item => item.totalTrainings);

        return {labels, data};
    }

    autoRender() {
        this.chartService.createLine(this.trainingData.labels, this.trainingData.data, {
            plugins: {
                legend: {display: false}
            }
        })
    }
}