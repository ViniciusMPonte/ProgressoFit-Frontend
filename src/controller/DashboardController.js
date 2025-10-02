import BaseController from "./BaseController.js";
import { DashboardView } from "../view/DashboardView.js";

export class DashboardController extends BaseController {
    constructor(redirectManager, apiService) {
        super(redirectManager, apiService)
        this.dom = new DOMElementManager();
        this.view = new DashboardView(this.dom)
    }

    loadPage() {
        this.setupDynamicContent();
        this.setupEventListeners();
    }

    setupDynamicContent() {
        this.setUserNameProfile();
        this.handleWeeklyChart();
        this.handleWeightDailyChart();
        this.setTrainingDataFieldValueToday();
    }

    setupEventListeners() {
        this.setupDynamicButtonListener();
        this.setupFormListener();
        this.setupSubmitWithToggleButtonListener();
        this.setupWeightFormListener();
    }

    setupFormListener() {
        const form = this.dom.getTrainingPerWeeklyForm();

        if (form) {
            form.addEventListener('submit', async (event) => {
                event.preventDefault();
                await this.handleTrainingCountFormSubmit();
            });
        }
    }

    setupDynamicButtonListener() {
        const trainingDataField = this.dom.getTrainingDataField();
        if (!trainingDataField) return

        trainingDataField.addEventListener('change', () => this.handleSetupDynamicButton());
    }

    setupSubmitWithToggleButtonListener() {
        const toggleButton = this.dom.getToggleButton();
        const toggleLabel = this.dom.getToggleLabel();

        if (toggleButton && toggleLabel) {
            toggleButton.addEventListener('click', async () => {
                await this.handleTrainingCountFormSubmit();
            });
        }
    }

    setupWeightFormListener() {
        const form = this.dom.getWeightForm();
        if (form) {
            form.addEventListener('submit', async (event) => {
                event.preventDefault();
                await this.handleWeightFormSubmit();
            });
        }
    }

    async setUserNameProfile() {
        const userNameTag = this.dom.getUserName();
        const avatarContainerTag = this.dom.getAvatarContainer();
        if (!userNameTag || !avatarContainerTag) return;

        let response = await this.apiService.get('/api/user');
        userNameTag.innerHTML = this.view.renderWelcomeText(response.data);
        avatarContainerTag.innerHTML = this.view.renderAvatarImg(response.data);
    }

    async handleSetupDynamicButton() {
        const selectedDate = this.dom.getTrainingDataField()?.value;
        if (!selectedDate) return

        const trainingCount = await this.getDataTraining(selectedDate);
        if (typeof trainingCount === 'number' && trainingCount > 0) {
            this.view.setToggleState(true)
        } else {
            this.view.setToggleState(false)
        }

        this.view.updateToogleButton()
    }

    async getDataTraining(date) {
        try {
            const response = await this.apiService.get(`/api/statistics/date/${date}`);
            return parseInt(response.data.count);
        } catch (error) {
            return 0
        }
    }

    async handleWeeklyChart() {
        try {
            const response = await this.apiService.get('/api/statistics/weekly/last-months/1');
            const tag = this.dom.getTrainingPerWeeklyChartTag();
            if (!tag) return

            this.view.renderTrainingPerWeeklyChart(tag, response.data);

        } catch (error) {
            console.error('Erro ao carregar dados semanais:', error);
        }
    }

    async handleWeightDailyChart() {
        try {
            const response = await this.apiService.get('/api/weight/weekly/last-months/1');
            const data = response.data;

            const tag = this.dom.getWeightDailyWeeklyChartTag();
            if (!tag) return;

            this.view.WeightDailyStatisticChart(tag, data);

        } catch (error) {
            console.error('Erro ao carregar dados de peso semanal:', error);
        }
    }

    async setTrainingDataFieldValueToday() {
        this.dom.getTrainingDataField().value = new Date().toISOString().split('T')[0];
        this.handleSetupDynamicButton()
    }

    async handleTrainingCountFormSubmit() {
        const trainingCount = this.view.getToggleState() ? 0 : 1;
        const data = this.dom.getTrainingDataField()?.value;
        const endpoint = `/api/statistics/date/${data}`;

        const formData = {
            count: trainingCount
        };

        this.view.showLoading(true);

        try {
            const result = await this.apiService.request(endpoint, {
                method: 'PUT',
                body: JSON.stringify(formData)
            });

            if (result.success) {
                this.view.alert('Dados enviados com sucesso!', 'success');
                await this.handleWeeklyChart();
            } else {
                this.view.alert(`Erro no envio: ${result.error}`, 'danger');
                console.error('Erro da API:', result.error);
            }

        } catch (error) {
            this.view.alert(`Erro de conexão: ${error.message}`, 'danger');
            console.error('Erro inesperado:', error);
        } finally {
            this.view.toggleState = !this.view.toggleState;
            this.view.showLoading(false);
        }
    }

    async handleWeightFormSubmit() {
        const weight = this.dom.getWeightInput()?.value; 
        const data = this.dom.getWeightDateField()?.value; 
        const endpoint = `/api/weight/date/${data}`;

        const formData = {
            weightKg: parseFloat(weight)
        };

        this.view.showLoading(true);

        try {
            const result = await this.apiService.request(endpoint, {
                method: 'PUT',
                body: JSON.stringify(formData)
            });

            if (result.success) {
                this.view.alert('Peso registrado com sucesso!', 'success');
                await this.handleWeightDailyChart();
            } else {
                this.view.alert(`Erro no envio: ${result.error}`, 'danger');
                console.error('Erro da API:', result.error);
            }

        } catch (error) {
            this.view.alert(`Erro de conexão: ${error.message}`, 'danger');
            console.error('Erro inesperado:', error);
        } finally {
            this.view.showLoading(false);
        }
    }

    convertTrainingDataShort(trainingData) {
        if (!Array.isArray(trainingData) || trainingData.length === 0) {
            return { labels: [], data: [] };
        }

        
        const labels = trainingData.map(item => {
            const start = item.weekStartDate?.split('-').reverse().join('/');
            const end = item.weekEndDate?.split('-').reverse().join('/');
            return `${start} - ${end}`;
        });

        const data = trainingData.map(item => item.averageWeight);

        return { labels, data };
    }
}

class DOMElementManager {
    constructor() {
        this.elements = {};
    }

    getUserName() {
        if (!this.elements.userName) {
            this.elements.userName = document.querySelector('#userName');
        }
        return this.elements.userName;
    }

    getAvatarContainer() {
        if (!this.elements.avatarContainer) {
            this.elements.avatarContainer = document.querySelector('#avatar-container');
        }
        return this.elements.avatarContainer;
    }

    getTrainingPerWeeklyChartTag() {
        if (!this.elements.TrainingPerWeeklyChart) {
            this.elements.TrainingPerWeeklyChart = document.querySelector('#training-per-weekly-chart');
        }
        return this.elements.TrainingPerWeeklyChart;
    }

    getWeightDailyWeeklyChartTag() {
        if (!this.elements.WeightDailyWeeklyChartTag) {
            this.elements.WeightDailyWeeklyChartTag = document.querySelector('#weight-daily-weekly-chart');
        }
        return this.elements.WeightDailyWeeklyChartTag;
    }

    getTrainingPerWeeklyForm() {
        if (!this.elements.trainingPerWeeklyForm) {
            this.elements.trainingPerWeeklyForm = document.querySelector('#training-per-weekly-form');
        }
        return this.elements.trainingPerWeeklyForm;
    }

    getTrainingDataField() {
        if (!this.elements.trainingDataField) {
            this.elements.trainingDataField = document.querySelector('#training-data-field');
        }
        return this.elements.trainingDataField;
    }

    getToggleButton() {
        if (!this.elements.toggleButton) {
            this.elements.toggleButton = document.querySelector('#toggleButton');
        }
        return this.elements.toggleButton;
    }

    getToggleLabel() {
        if (!this.elements.toggleLabel) {
            this.elements.toggleLabel = document.querySelector('#toggleLabel');
        }
        return this.elements.toggleLabel;
    }

    getWeightForm() {
        if (!this.elements.weightForm) {
            this.elements.weightForm = document.querySelector('#weightForm');
        }
        return this.elements.weightForm;
    }

    getWeightInput() {
        if (!this.elements.weightInput) {
            this.elements.weightInput = document.querySelector('#weightInput');
        }
        return this.elements.weightInput;
    }

    getWeightDateField() {
        if (!this.elements.weightDateField) {
            this.elements.weightDateField = document.querySelector('#weightDateField');
        }
        return this.elements.weightDateField;
    }

    destroy() {
        this.elements = {};
    }
}