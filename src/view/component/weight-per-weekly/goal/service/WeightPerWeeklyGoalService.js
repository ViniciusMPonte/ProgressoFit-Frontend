import { ApiService } from '../../../../../service/ApiService.js'

export class WeightPerWeeklyGoalService {
    constructor() {
        this.apiService = new ApiService()
    }

    async getDataCurrentGoal() {
        try {
            let response

            response = await this.apiService.get('/api/goals/label/weight')
            const weightGoal = response.data

            response = await this.apiService.get(`/api/weight/date/${weightGoal.startDate}`)
            const weightStartDate = response.data

            response = await this.apiService.get(`/api/weight/latest`)
            const weightEndDate = response.data

            return {
                weightGoal,
                weightStartDate,
                weightEndDate,
            }
        } catch (error) {
            console.error('Erro ao carregar dados de peso semanal:', error)
        }
    }
}
