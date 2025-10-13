import { ApiService } from '../../../../../service/ApiService.js'
import BaseChartComponent from '../../../BaseChartComponent.js'

export class WeightDailyStatisticChartService extends BaseChartComponent {
    constructor() {
        super()
        this.apiService = new ApiService()
    }

    convertTrainingDataShort(trainingData) {
        if (!Array.isArray(trainingData) || trainingData.length === 0) {
            throw new Error('Os dados devem ser um array não vazio.')
        }

        const labels = this.extractLabelsFromPeriods(trainingData)
        const data = this.extractData(trainingData, 'averageWeight')

        return { labels, data }
    }

    async getDataLastMonths() {
        try {
            const response = await this.apiService.get('/api/weight/weekly/last-months/1')
            return this.convertTrainingDataShort(response.data)
        } catch (error) {
            console.error('Erro ao carregar dados de peso semanal:', error)
        }
    }
}
