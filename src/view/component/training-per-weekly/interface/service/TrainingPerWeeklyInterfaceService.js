import { ApiService } from '../../../../../service/ApiService.js'

export class TrainingPerWeeklyInterfaceService {
    constructor(dom) {
        this.apiService = new ApiService()
        this.dom = dom

        this.toggleState = false
    }

    getToggleState() {
        return this.toggleState
    }

    setToggleState(boolean) {
        this.toggleState = boolean
    }

    setCallbackForm(cbFuction) {
        this.callbackForm = cbFuction
    }

    async updateToggleState() {
        const selectedDate = this.dom.getTrainingDataField()?.value
        if (!selectedDate) return

        const trainingCount = await this.getDataTraining(selectedDate)
        if (typeof trainingCount === 'number' && trainingCount > 0) {
            this.setToggleState(true)
        } else {
            this.setToggleState(false)
        }
    }

    async getDataTraining(date) {
        try {
            const response = await this.apiService.get(`/api/statistics/date/${date}`)
            return parseInt(response.data.count)
        } catch (error) {
            return 0
        }
    }

    async countFormSubmit() {
        const trainingCount = this.getToggleState() ? 0 : 1
        const date = this.dom.getTrainingDataField()?.value
        const endpoint = `/api/statistics/date/${date}`

        const formData = {
            count: trainingCount,
        }

        let returnResult
        try {
            const result = await this.apiService.put(endpoint, formData)

            if (result.success) {
                returnResult = true
            } else {
                console.error('Erro da API:', result.error)
                returnResult = false
            }
        } catch (error) {
            console.error('Erro inesperado:', error)
            returnResult = false
        } finally {
            const newToggleState = !this.getToggleState()
            this.setToggleState(newToggleState)

            if (returnResult) {
                this.callbackForm()
            }
            return returnResult
        }
    }
}
