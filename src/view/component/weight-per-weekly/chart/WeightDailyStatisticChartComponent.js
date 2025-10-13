import ChartService from '../../../../service/ChartService.js'
import { WeightDailyStatisticChartService } from './service/WeightDailyStatisticChartService.js'

export class WeightDailyStatisticChartComponent {
    constructor(ctx) {
        this.chartService = new ChartService(ctx)
        this.componentService = new WeightDailyStatisticChartService()
    }

    async autoRender() {
        await this.updateWeightData()
        this.render()
    }

    async updateWeightData() {
        try {
            const data = await this.componentService.getDataLastMonths()
            this.weightData = data
        } catch (error) {
            console.error('Erro ao atualizar dados de treino:', error?.message || error)
        }
    }

    render() {
        this.chartService.create(
            this.weightData.labels,
            [
                {
                    data: this.weightData.data,
                    backgroundColor: ['rgba(92, 250, 30, 0.6)'],
                    fill: true,
                    borderColor: 'rgba(97, 243, 57, 1)',
                    tension: 0.4,
                },
            ],
            'bar',
            {
                scales: {
                    y: {
                        min: 50,
                        max: 130,
                        ticks: {
                            stepSize: 10,
                        },
                        grid: {
                            display: false,
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
