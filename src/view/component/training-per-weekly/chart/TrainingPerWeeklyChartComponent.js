import ChartService from '../../../../service/ChartService.js'
import { TrainingPerWeeklyChartService } from './service/TrainingPerWeeklyChartService.js'

export class TrainingPerWeeklyChartComponent {
    constructor(ctx) {
        this.chartService = new ChartService(ctx)
        this.componentService = new TrainingPerWeeklyChartService()
    }

    async autoRender() {
        await this.updateTrainingData()
        this.render()
    }

    async updateTrainingData() {
        try {
            const data = await this.componentService.getDataLastMonths()
            this.trainingData = data
        } catch (error) {
            console.error('Erro ao atualizar dados de treino:', error?.message || error)
        }
    }

    render() {
        this.chartService.create(
            this.trainingData.labels,
            [
                {
                    data: this.trainingData.data,
                    backgroundColor: ['rgba(92, 250, 30, 0.4)'],
                    fill: true,
                    borderColor: 'rgba(97, 243, 57, 1)',
                    tension: 0.4,
                },
            ],
            'bar',
            {
                scales: {
                    y: {
                        min: 0,
                        max: 7,
                        ticks: {
                            stepSize: 1,
                        },
                        grid: {
                            display: true,
                        },
                    },
                    x: {
                        grid: {
                            display: false,
                        },
                    },
                },
            }
        )
    }
}
