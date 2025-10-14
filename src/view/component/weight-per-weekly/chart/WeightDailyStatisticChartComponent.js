import ChartService from '../../../../service/ChartService.js'
import { WeightDailyStatisticChartService } from './service/WeightDailyStatisticChartService.js'

export class WeightDailyStatisticChartComponent {
    constructor(ctx) {
        this.chartService = new ChartService(ctx)
        this.componentService = new WeightDailyStatisticChartService()

        this.minY = null
        this.maxY = null
    }

    async autoRender() {
        this.weightData = await this.componentService.getDataLastMonths()

        const data = await this.componentService.getDataCurrentGoal()
        this._initializeData(data)
        this._calculateMetrics(data)

        this.render()
    }

    _initializeData(data) {
        this.defaultWeightMin = data.weightMin.weightKg
        this.defaultWeightMax = data.weightMax.weightKg
    }

    _calculateMetrics(data) {
        const diff = data.weightGoal.targetValue - data.weightStartDate.weightKg
        const direction = Math.sign(diff)

        if (direction > 0) {
            this.maxY = data.weightGoal.targetValue
        } else if (direction < 0) {
            this.minY = data.weightGoal.targetValue
        }
    }

    render() {
        const minY = this.minY ?? this.defaultWeightMin - 1
        const maxY = this.maxY ?? this.defaultWeightMax + 1

        this.chartService.create(
            this.weightData.labels,
            [
                {
                    data: this.weightData.data,
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
                        min: minY,
                        max: maxY,
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
