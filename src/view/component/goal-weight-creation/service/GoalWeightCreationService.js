import { ApiService } from '../../../../service/ApiService.js'

export class GoalWeightCreationService {
    constructor(dom) {
        this.apiService = new ApiService()
        this.dom = dom
        this.callbackForm = null
    }

    setCallbackForm(cbFunction) {
        this.callbackForm = cbFunction
    }

    async handleGoalFormSubmit() {
        const inicialValue = parseFloat(this.dom.getGoalInicialValue()?.value)
        const targetValue = parseFloat(this.dom.getGoalTargetValue()?.value)
        const startDate = this.dom.getGoalStartDate()?.value
        const endDate = this.dom.getGoalEndDate()?.value

        if (!inicialValue || !targetValue || !startDate || !endDate) {
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
            targetValue: targetValue,
            startDate: startDate,
            endDate: endDate,
            valueUnit: 'kg',
            periodDays: 7,
        }

        try {
            const result = await this.createGoal(formData, inicialValue)

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
        try {
            const goalResult = await this.apiService.get('/api/goals/label/weight')
            if (!goalResult.success) throw new Error()

            const goalData = goalResult.data
            const weightResult = await this.apiService.get(`/api/weight/date/${goalData.startDate}`)

            if (weightResult.success) {
                goalData.initialValue = weightResult.data.weightKg
            }

            return goalData
        } catch (error) {
            console.error('Erro ao buscar objetivo:', error)
            return {
                targetValue: '',
                initialValue: '',
                startDate: '',
                endDate: '',
            }
        }
    }
    async createGoal(formData, inicialValue) {
        let result
        try {
            result = await this.apiService.put(`/api/weight/date/${formData.startDate}`, { weightKg: inicialValue })
            if (!result.success) throw new Error()

            result = await this.apiService.put('/api/goals/label/weight', formData)

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
