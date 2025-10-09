import BaseController from './BaseController.js'
import { DashboardView } from '../view/DashboardView.js'

export class DashboardController extends BaseController {
    constructor(redirectManager, apiService) {
        super(redirectManager, apiService)
        this.dom = new DOMElementManager()
        this.view = new DashboardView(this.dom)
    }

    loadPage() {
        this.setupDynamicContent()
        this.setupEventListeners()
    }

    setupDynamicContent() {
        this.setUserNameProfile()

        this.view.renderTrainingPerWeeklyInterfaceComponent(this.dom.getTrainingPerWeeklyInterface())
        this.handleCurrentGoal()
        this.setTrainingDataFieldValueToday()
        this.handleTrainingWeeklyChart()

        this.view.renderWeightPerWeeklyInterfaceComponent(this.dom.getWeightPerWeeklyInterface())

        this.handleWeightDailyChart()
    }

    setupEventListeners() {
        this.setupDynamicButtonListener()
        this.setupFormListener()
        this.setupTrainingFormSubmitBtnListener()
        this.setupWeightFormSubmitBtnListener()
    }

    setupFormListener() {
        const form = this.view.trainingPerWeeklyInterfaceComponent.dom.getTrainingPerWeeklyForm()

        if (form) {
            form.addEventListener('submit', async (event) => {
                event.preventDefault()
                await this.handleTrainingCountFormSubmit()
            })
        }
    }

    setupDynamicButtonListener() {
        const trainingDataField = this.view.trainingPerWeeklyInterfaceComponent.dom.getTrainingDataField()
        if (!trainingDataField) return

        trainingDataField.addEventListener('change', () => this.handleSetupDynamicButton())
    }

    setupDynamicButtonListener() {
        const trainingDataField = this.view.trainingPerWeeklyInterfaceComponent.dom.getTrainingDataField()
        if (!trainingDataField) return

        trainingDataField.addEventListener('change', () => this.handleSetupDynamicButton())
    }

    setupTrainingFormSubmitBtnListener() {
        const trainingFormSubmitBtn = this.view.trainingPerWeeklyInterfaceComponent.dom.getTrainingFormSubmitBtn()

        if (trainingFormSubmitBtn) {
            trainingFormSubmitBtn.addEventListener('click', async () => {
                await this.handleTrainingCountFormSubmit()
            })
        }
    }

    setupWeightFormSubmitBtnListener() {
        const weightFormSubmitBtn = this.view.weightPerWeeklyInterfaceComponent.dom.getWeightFormSubmitBtn()

        if (weightFormSubmitBtn) {
            weightFormSubmitBtn.addEventListener('click', async () => {
                await this.handleWeightFormSubmit()
            })
        }
    }

    async setUserNameProfile() {
        const userNameTag = this.dom.getUserName()
        const avatarContainerTag = this.dom.getAvatarContainer()
        if (!userNameTag || !avatarContainerTag) return

        let response = await this.apiService.get('/api/user')
        userNameTag.innerHTML = this.view.renderWelcomeText(response.data)
        avatarContainerTag.innerHTML = this.view.renderAvatarImg(response.data)
    }

    async handleSetupDynamicButton() {
        const selectedDate = this.view.trainingPerWeeklyInterfaceComponent.dom.getTrainingDataField()?.value
        if (!selectedDate) return

        const trainingCount = await this.getDataTraining(selectedDate)
        if (typeof trainingCount === 'number' && trainingCount > 0) {
            this.view.trainingPerWeeklyInterfaceComponent.setToggleState(true)
        } else {
            this.view.trainingPerWeeklyInterfaceComponent.setToggleState(false)
        }

        this.view.trainingPerWeeklyInterfaceComponent.updateToogleButton()
    }

    async getDataTraining(date) {
        try {
            const response = await this.apiService.get(`/api/statistics/date/${date}`)
            return parseInt(response.data.count)
        } catch (error) {
            return 0
        }
    }

    async handleTrainingWeeklyChart() {
        try {
            const response = await this.apiService.get('/api/statistics/weekly/last-months/1')
            const tag = this.dom.getTrainingPerWeeklyChartTag()
            if (!tag) return

            this.view.renderTrainingPerWeeklyChart(tag, response.data)
        } catch (error) {
            console.error('Erro ao carregar dados semanais:', error)
        }
    }

    async handleWeightDailyChart() {
        try {
            const response = await this.apiService.get('/api/weight/weekly/last-months/1')
            const data = response.data

            const tag = this.dom.getWeightDailyWeeklyChartTag()
            if (!tag) return

            this.view.renderWeightDailyStatisticChart(tag, data)
        } catch (error) {
            console.error('Erro ao carregar dados de peso semanal:', error)
        }
    }

    async setTrainingDataFieldValueToday() {
        this.view.trainingPerWeeklyInterfaceComponent.dom.getTrainingDataField().value = this.view.getTodayString()
        this.handleSetupDynamicButton()
    }

    async handleTrainingCountFormSubmit() {
        const trainingCount = this.view.trainingPerWeeklyInterfaceComponent.getToggleState() ? 0 : 1
        const data = this.view.trainingPerWeeklyInterfaceComponent.dom.getTrainingDataField()?.value
        const endpoint = `/api/statistics/date/${data}`

        const formData = {
            count: trainingCount,
        }

        this.view.trainingPerWeeklyInterfaceComponent.showLoading(true)

        try {
            const result = await this.apiService.request(endpoint, {
                method: 'PUT',
                body: JSON.stringify(formData),
            })

            if (result.success) {
                this.view.alert('Dados enviados com sucesso!', 'success')
                await this.handleTrainingWeeklyChart()
                await this.handleCurrentGoal()
            } else {
                this.view.alert(`Erro no envio: ${result.error}`, 'danger')
                console.error('Erro da API:', result.error)
            }
        } catch (error) {
            this.view.alert(`Erro de conexão: ${error.message}`, 'danger')
            console.error('Erro inesperado:', error)
        } finally {
            const newToggleState = !this.view.trainingPerWeeklyInterfaceComponent.getToggleState()
            this.view.trainingPerWeeklyInterfaceComponent.setToggleState(newToggleState)
            this.view.trainingPerWeeklyInterfaceComponent.showLoading(false)
        }
    }

    async handleWeightFormSubmit() {
        const weight = this.view.weightPerWeeklyInterfaceComponent.dom.getWeightInput()?.value
        const data = this.view.weightPerWeeklyInterfaceComponent.dom.getWeightDateField()?.value
        const endpoint = `/api/weight/date/${data}`

        const formData = {
            weightKg: parseFloat(weight),
        }

        try {
            const result = await this.apiService.request(endpoint, {
                method: 'PUT',
                body: JSON.stringify(formData),
            })

            if (result.success) {
                this.view.alert('Peso registrado com sucesso!', 'success')
                await this.handleWeightDailyChart()
            } else {
                this.view.alert(`Erro no envio: ${result.error}`, 'danger')
                console.error('Erro da API:', result.error)
            }
        } catch (error) {
            this.view.alert(`Erro de conexão: ${error.message}`, 'danger')
            console.error('Erro inesperado:', error)
        }
    }

    async handleCurrentGoal() {
        try {
            let response

            response = await this.apiService.get('/api/goals/label/training')
            const trainingGoal = response.data

            response = await this.apiService.get(`/api/statistics/weekly/period?startDate=${trainingGoal.startDate}&endDate=${trainingGoal.endDate}`)
            const trainingData = response.data

            response = await this.apiService.get(`/api/statistics/last/${trainingGoal.periodDays}`)
            const currentPeriod = response.data

            const data = {
                trainingGoal: trainingGoal,
                trainingData: trainingData,
                currentPeriod: currentPeriod,
            }

            this.view.renderTrainingPerWeeklyGoalComponent(this.dom.getTrainingPerWeeklyGoal(), data)
        } catch (error) {
            console.error('Erro ao carregar dados de peso semanal:', error)
        }
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const weightDateField = document.getElementById('weight-date-field')

    const today = new Date()
    const yyyy = today.getFullYear()
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const dd = String(today.getDate()).padStart(2, '0')
    weightDateField.value = `${yyyy}-${mm}-${dd}`
})

class DOMElementManager {
    constructor() {
        this.elements = {}
    }

    getUserName() {
        if (!this.elements.userName) {
            this.elements.userName = document.querySelector('#userName')
        }
        return this.elements.userName
    }

    getAvatarContainer() {
        if (!this.elements.avatarContainer) {
            this.elements.avatarContainer = document.querySelector('#avatar-container')
        }
        return this.elements.avatarContainer
    }

    getTrainingPerWeeklyInterface() {
        if (!this.elements.trainingPerWeeklyInterface) {
            this.elements.trainingPerWeeklyInterface = document.querySelector('#training-per-weekly-interface')
        }
        return this.elements.trainingPerWeeklyInterface
    }

    getTrainingPerWeeklyGoal() {
        if (!this.elements.trainingPerWeeklyGoal) {
            this.elements.trainingPerWeeklyGoal = document.querySelector('#training-per-weekly-goal')
        }
        return this.elements.trainingPerWeeklyGoal
    }

    getTrainingPerWeeklyChartTag() {
        if (!this.elements.TrainingPerWeeklyChart) {
            this.elements.TrainingPerWeeklyChart = document.querySelector('#training-per-weekly-chart')
        }
        return this.elements.TrainingPerWeeklyChart
    }

    getWeightDailyWeeklyChartTag() {
        if (!this.elements.WeightDailyWeeklyChartTag) {
            this.elements.WeightDailyWeeklyChartTag = document.querySelector('#weight-daily-weekly-chart')
        }
        return this.elements.WeightDailyWeeklyChartTag
    }

    getWeightPerWeeklyInterface() {
        if (!this.elements.weightPerWeeklyInterface) {
            this.elements.weightPerWeeklyInterface = document.querySelector('#weight-per-weekly-interface')
        }
        return this.elements.weightPerWeeklyInterface
    }

    getWeightForm() {
        if (!this.elements.weightForm) {
            this.elements.weightForm = document.querySelector('#weightForm')
        }
        return this.elements.weightForm
    }

    getWeightInput() {
        if (!this.elements.weightInput) {
            this.elements.weightInput = document.querySelector('#weightInput')
        }
        return this.elements.weightInput
    }

    getWeightDateField() {
        if (!this.elements.weightDateField) {
            this.elements.weightDateField = document.querySelector('#weightDateField')
        }
        return this.elements.weightDateField
    }

    destroy() {
        this.elements = {}
    }
}
