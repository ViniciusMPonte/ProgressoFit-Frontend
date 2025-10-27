import { ApiService } from '../../../../../service/ApiService.js'
import BaseChartComponent from '../../../BaseChartComponent.js'

export class TrainingPerWeeklyChartService extends BaseChartComponent {
    constructor() {
        super()
        this.apiService = new ApiService()
    }

    convertTrainingDataShort(trainingData) {
        if (!Array.isArray(trainingData) || trainingData.length === 0) {
            throw new Error('Os dados devem ser um array não vazio.')
        }

        const labels = this.extractLabelsFromPeriods(trainingData)
        const data = this.extractData(trainingData, 'totalTrainings')

        return { labels, data }
    }

    async getDataLastMonths() {
        try {
            const response = await this.apiService.get('/api/statistics/weekly/last-months/1')
            return this.convertTrainingDataShort(response.data)
        } catch (error) {
            console.error('Erro ao carregar dados semanais:', error)
        }
    }
}
