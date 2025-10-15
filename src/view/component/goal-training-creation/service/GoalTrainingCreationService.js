import { ApiService } from '../../../../service/ApiService.js'

export class GoalTrainingCreationService {
    constructor(dom) {
        this.apiService = new ApiService()
        this.dom = dom
        this.callbackForm = null
    }

    setCallbackForm(cbFunction) {
        this.callbackForm = cbFunction
    }

    async handleGoalFormSubmit() {
        const targetValue = this.dom.getGoalTargetValue()?.value
        const startDate = this.dom.getGoalStartDate()?.value
        const endDate = this.dom.getGoalEndDate()?.value

        if (!targetValue || !startDate || !endDate) {
            console.error('Todos os campos são obrigatórios')
            if (this.callbackForm) {
                this.callbackForm('Preencha todos os campos obrigatórios', 'error')
            }
            return false
        }

        if (new Date(startDate) > new Date(endDate)) {
            console.error('Data de início não pode ser maior que data de término')
            if (this.callbackForm) {
                this.callbackForm('Data de início não pode ser maior que data de término', 'error')
            }
            return false
        }

        const formData = {
            targetValue: parseFloat(targetValue),
            startDate: startDate,
            endDate: endDate,
            valueUnit: 'day',
            periodDays: 7,
        }

        try {
            const result = await this.createGoal(formData)

            if (result) {
                if (this.callbackForm) {
                    this.callbackForm('Objetivo criado com sucesso!', 'success')
                }
                return true
            } else {
                if (this.callbackForm) {
                    this.callbackForm('Erro ao criar objetivo', 'error')
                }
                return false
            }
        } catch (error) {
            console.error('Erro inesperado:', error)
            if (this.callbackForm) {
                this.callbackForm('Erro inesperado ao criar objetivo', 'error')
            }
            return false
        }
    }

    async getCurrentGoal() {
        const endpoint = '/api/goals/label/training'

        try {
            const result = await this.apiService.get(endpoint)

            if (result.success) {
                return result.data
            }
        } catch (error) {
            console.error('Erro ao criar objetivo:', error)
            return false
        }
    }

    async createGoal(formData) {
        const endpoint = '/api/goals/label/training'

        try {
            const result = await this.apiService.put(endpoint, formData)

            if (result.success) {
                return true
            } else {
                console.error('Erro da API:', result.error)
                return false
            }
        } catch (error) {
            console.error('Erro ao criar objetivo:', error)
            return false
        }
    }

    validateDates(startDate, endDate) {
        const start = new Date(startDate)
        const end = new Date(endDate)

        if (start > end) {
            return {
                valid: false,
                message: 'Data de início não pode ser maior que data de término',
            }
        }

        const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24))

        if (daysDiff < 7) {
            return {
                valid: false,
                message: 'O período do objetivo deve ser de pelo menos 7 dias',
            }
        }

        return { valid: true }
    }
}
