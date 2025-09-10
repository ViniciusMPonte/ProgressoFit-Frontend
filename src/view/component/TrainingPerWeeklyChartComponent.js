import ChartService from "../../service/ChartService.js";
import BaseChartComponent from "./BaseChartComponent.js";

export class TrainingPerWeeklyChartComponent extends BaseChartComponent {

    constructor(ctx, trainingData) {
        super();
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

        const labels = this.extractLabelsFromPeriods(trainingData);
        const data = this.extractData(trainingData, 'totalTrainings');

        return { labels, data };
    }

    autoRender() {
        this.chartService.create(this.trainingData.labels, [{
                data: this.trainingData.data,
                backgroundColor: ["rgba(92, 250, 30, 0.4)"],
                fill: true,
                borderColor: "rgba(97, 243, 57, 1)",
                tension: 0.4
            }]
        )
    }
}