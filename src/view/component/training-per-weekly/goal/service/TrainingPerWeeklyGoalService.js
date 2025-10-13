import { ApiService } from '../../../../../service/ApiService.js'

export class TrainingPerWeeklyGoalService {
    constructor() {
        this.apiService = new ApiService()
    }

    async getDataCurrentGoal() {
        try {
            let response

            response = await this.apiService.get('/api/goals/label/training')
            const trainingGoal = response.data

            response = await this.apiService.get(`/api/statistics/weekly/period?startDate=${trainingGoal.startDate}&endDate=${trainingGoal.endDate}`)
            const trainingData = response.data

            response = await this.apiService.get(`/api/statistics/current-week`)
            const currentPeriod = response.data

            return {
                trainingGoal: trainingGoal,
                trainingData: trainingData,
                currentPeriod: currentPeriod,
            }
        } catch (error) {
            console.error('Erro ao carregar dados de peso semanal:', error)
        }
    }
}
