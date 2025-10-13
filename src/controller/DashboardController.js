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

        this.handleTrainingWeeklyInterface()
        this.handleTrainingWeeklyGoal()
        this.handleTrainingWeeklyChart()

        this.view.renderWeightPerWeeklyInterfaceComponent()
        this.setWeightDataFieldValueToday()
        this.handleWeightDailyChart()
    }

    setupEventListeners() {
        this.setupWeightFormSubmitBtnListener()
    }

    //Geral
    async setUserNameProfile() {
        const userNameTag = this.dom.getUserName()
        const avatarContainerTag = this.dom.getAvatarContainer()
        if (!userNameTag || !avatarContainerTag) return

        let response = await this.apiService.get('/api/user')
        userNameTag.innerHTML = this.view.renderWelcomeText(response.data)
        avatarContainerTag.innerHTML = this.view.renderAvatarImg(response.data)
    }

    //Training
    handleTrainingWeeklyInterface() {
        this.view.renderTrainingPerWeeklyInterfaceComponent(() => {
            this.view.alert('Dados enviados com sucesso!', 'success')
            this.handleTrainingWeeklyChart()
            this.handleTrainingWeeklyGoal()
        })
    }

    handleTrainingWeeklyGoal() {
        this.view.renderTrainingPerWeeklyGoalComponent()
    }

    handleTrainingWeeklyChart() {
        this.view.renderTrainingPerWeeklyChart()
    }

    //Weight
    //Weight - Interface
    setupWeightFormSubmitBtnListener() {
        const weightFormSubmitBtn = this.view.weightPerWeeklyInterfaceComponent.dom.getWeightFormSubmitBtn()

        if (weightFormSubmitBtn) {
            weightFormSubmitBtn.addEventListener('click', async () => {
                await this.handleWeightFormSubmit()
            })
        }
    }

    setWeightDataFieldValueToday() {
        const weightDateField = document.getElementById('weight-date-field')
        weightDateField.value = this.view.getTodayString()
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
                this.handleWeightDailyChart()
            } else {
                this.view.alert(`Erro no envio: ${result.error}`, 'danger')
                console.error('Erro da API:', result.error)
            }
        } catch (error) {
            this.view.alert(`Erro de conexão: ${error.message}`, 'danger')
            console.error('Erro inesperado:', error)
        }
    }

    //Weight - chart
    handleWeightDailyChart() {
        this.view.renderWeightDailyStatisticChart()
    }
}

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

    getTrainingPerWeeklyChart() {
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
