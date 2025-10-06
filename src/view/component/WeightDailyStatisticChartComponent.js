import ChartService from "../../service/ChartService.js";
import BaseChartComponent from "./BaseChartComponent.js";

export class WeightDailyStatisticChartComponent extends BaseChartComponent {

    constructor(ctx, trainingData, type = 'bar') { 
        super();
        this.elements = {};
        this.chartService = new ChartService(ctx);
        this.type = type; 
        this.setTrainingData(trainingData);
    }

    setTrainingData(trainingData) {
        this.trainingData = this.convertTrainingDataShort(trainingData)
    }

    convertTrainingDataShort(trainingData) {
        if (!Array.isArray(trainingData) || trainingData.length === 0) {
            throw new Error("Os dados devem ser um array não vazio.");
        }

        const labels = this.extractLabelsFromPeriods(trainingData);
        const data = this.extractData(trainingData, 'averageWeight'); 

        return { labels, data };
    }

    autoRender() {
        if (!this.elements.WeightDailyWeeklyChartTag) {
            this.elements.WeightDailyWeeklyChartTag = document.querySelector('#weight-daily-weekly-chart');
        }

        this.chartService.create(
            this.trainingData.labels,
            [{
                data: this.trainingData.data,
                backgroundColor: ["rgba(92, 250, 30, 0.6)"],
                fill: true,
                borderColor: "rgba(97, 243, 57, 1)",
                tension: 0.4
            }],
            this.type,
            {
                scales: {
                    y: {
                        min: 50,
                        max: 130, 
                        ticks: {
                            stepSize: 10
                        },
                        grid: {
                            display: false 
                        }
                    },
                    x: {
                        grid: {
                            display: false 
                        }
                    }
                }
            }
        )
    }
}