import { ApiService } from '../../../../../service/ApiService.js'

export class WeightPerWeeklyInterfaceService {
    constructor(dom) {
        this.apiService = new ApiService()
        this.dom = dom
    }

    setCallbackForm(cbFuction) {
        this.callbackForm = cbFuction
    }

    async getWeightData(date) {
        try {
            const response = await this.apiService.get(`/api/weight/date/${date}`)
            if (!response.success) return ''

            return parseFloat(response.data.weightKg)
        } catch (error) {
            return ''
        }
    }

    async weightFormSubmit() {
        const weight = this.dom.getWeightInput()?.value
        const date = this.dom.getWeightDateField()?.value
        const endpoint = `/api/weight/date/${date}`

        const formData = {
            weightKg: parseFloat(weight),
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
            if (returnResult) {
                this.callbackForm()
            }
            return returnResult
        }
    }
}
