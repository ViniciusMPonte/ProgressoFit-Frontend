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
        this.view.setupToggleListener();
        this.setupDynamicButtonListener();
        this.setupFormListener();
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
            const response = await this.apiService.get('/api/statistics/weekly/last-months/2');
            const tag = this.dom.getTrainingPerWeeklyChartTag();

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
        const trainingCount = this.view.getToggleState() ? 1 : 0;
        const data = this.dom.getDataField()?.value;
        const endpoint = `/api/statistics/date/${data}`;

        const formData = {
            count: trainingCount
        };

        this.view.showLoading(true);
        this.view.showStatus('', '');

        try {
            const result = await this.apiService.request(endpoint, {
                method: 'PUT',
                body: JSON.stringify(formData)
            });

            if (result.success) {
                this.view.showStatus('Dados enviados com sucesso!', 'success');
                this.view.resetForm();
                this.redirect.reload()
            } else {
                this.view.showStatus(`Erro no envio: ${result.error}`, 'error');
                console.error('Erro da API:', result.error);
            }

        } catch (error) {
            this.view.showStatus(`Erro de conexão: ${error.message}`, 'error');
            console.error('Erro inesperado:', error);
        } finally {
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

    getSubmitButton() {
        if (!this.elements.submitButton) {
            this.elements.submitButton = document.querySelector('#dataForm button[type="submit"]');
        }
        return this.elements.submitButton;
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

    getStatusDiv() {
        if (!this.elements.statusDiv) {
            this.elements.statusDiv = document.querySelector('#status');
        }
        return this.elements.statusDiv;
    }

    destroy() {
        this.elements = {};
    }
}