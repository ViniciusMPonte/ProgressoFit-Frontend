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
        this.handleWeeklyChart();
        this.setDataFieldValueToday();
    }

    setupEventListeners() {
        this.setupDynamicButtonListener();
        this.setupFormListener();
        this.setupSubmitWithToggleButtonListener();
    }

    setupFormListener() {
        const form = this.dom.getDataForm();

        if (form) {
            form.addEventListener('submit', async (event) => {
                event.preventDefault();
                await this.handleTrainingCountFormSubmit();
            });
        }
    }

    setupDynamicButtonListener() {

        const dataField = this.dom.getDataField();
        if (!dataField) return

        dataField.addEventListener('change', () => this.handleSetupDynamicButton());
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

    async handleSetupDynamicButton() {
        const selectedDate = this.dom.getDataField()?.value;
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

    async setDataFieldValueToday() {
        this.dom.getDataField().value = new Date().toISOString().split('T')[0];
        this.handleSetupDynamicButton()
    }

    async handleTrainingCountFormSubmit() {
        const trainingCount = this.view.getToggleState() ? 0 : 1;
        const data = this.dom.getDataField()?.value;
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
}

class DOMElementManager {
    constructor() {
        this.elements = {};
    }

    getTrainingPerWeeklyChartTag() {
        if (!this.elements.TrainingPerWeeklyChart) {
            this.elements.TrainingPerWeeklyChart = document.querySelector('#training-per-weekly-chart');
        }
        return this.elements.TrainingPerWeeklyChart;
    }

    getDataForm() {
        if (!this.elements.dataForm) {
            this.elements.dataForm = document.querySelector('#dataForm');
        }
        return this.elements.dataForm;
    }

    getDataField() {
        if (!this.elements.dataField) {
            this.elements.dataField = document.querySelector('#dataField');
        }
        return this.elements.dataField;
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

    destroy() {
        this.elements = {};
    }
}