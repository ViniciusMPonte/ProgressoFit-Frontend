import BaseController from './BaseController.js'
import { DashboardView } from '../view/DashboardView.js'
import { AIService } from '../service/AIService.js'

export class DashboardController extends BaseController {
    constructor(redirectManager, apiService) {
        super(redirectManager, apiService)
        this.dom = new DOMElementManager()
        this.view = new DashboardView(this.dom)
        this.aiService = new AIService()
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

        this.handleWeightWeeklyInterface()
        this.handleWeightWeeklyGoal()
        this.handleWeightDailyChart()
    }

    setupEventListeners() {}

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
        this.view.renderTrainingPerWeeklyGoalComponent(this.getCallbackGenerateTextAI())
    }

    handleTrainingWeeklyChart() {
        this.view.renderTrainingPerWeeklyChart()
    }

    //Weight
    handleWeightWeeklyInterface() {
        this.view.renderWeightPerWeeklyInterfaceComponent(() => {
            this.view.alert('Peso registrado com sucesso!', 'success')
            this.handleWeightDailyChart()
            this.handleWeightWeeklyGoal()
        })
    }

    handleWeightWeeklyGoal() {
        this.view.renderWeightPerWeeklyGoalComponent(this.getCallbackGenerateTextAI())
    }

    handleWeightDailyChart() {
        this.view.renderWeightDailyStatisticChart()
    }

    //AI
    getCallbackGenerateTextAI() {
        return () => {
            this.aiService.processAllPendingWithRetry().then(results => {
                if (results.length > 0) {
                    this.view.alert(results[0].data.aiResponse, 'success', null, 60000)
                }
            })
        }
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

    getWeightPerWeeklyGoal() {
        if (!this.elements.weightPerWeeklyGoal) {
            this.elements.weightPerWeeklyGoal = document.querySelector('#weight-per-weekly-goal')
        }
        return this.elements.weightPerWeeklyGoal
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
