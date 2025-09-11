import BaseController from "./BaseController.js";
import {DashboardView} from "../view/DashboardView.js";

export class DashboardController extends BaseController {
    constructor(redirectManager, apiService) {
        super(redirectManager, apiService)
        this.dom = new DOMElementManager();
        this.toggleState = false;
    }

    loadPage() {
        this.setupDynamicContent();
        this.setupEventListeners();
    }

    setupDynamicContent(){
        this.handleWeeklyChart();
    }

    setupEventListeners() {
        this.setupToggleListener();
        this.setupFormListener();
    }

    setupToggleListener() {
        const toggleButton = this.dom.getToggleButton();
        const toggleLabel = this.dom.getToggleLabel();

        if (toggleButton && toggleLabel) {
            toggleButton.addEventListener('click', () => {
                this.toggleState = !this.toggleState;

                if (this.toggleState) {
                    toggleButton.classList.add('active');
                    toggleLabel.textContent = 'Ativado (1)';
                } else {
                    toggleButton.classList.remove('active');
                    toggleLabel.textContent = 'Desativado (0)';
                }
            });
        }
    }

    setupFormListener() {
        const form = this.dom.getDataForm();

        if (form) {
            form.addEventListener('submit', async (event) => {
                event.preventDefault();
                await this.handleFormSubmit();
            });
        }
    }

    async handleWeeklyChart(){
        try {
            const request = await this.apiService.get('/api/statistics/weekly/last-months/2');
            const tag = this.dom.getTrainingPerWeeklyChartTag();

            DashboardView.renderTrainingPerWeeklyChart(tag, request.data);

        } catch (error) {
            console.error('Erro ao carregar dados semanais:', error);
        }
    }

    async handleFormSubmit() {
        const numero = this.toggleState ? 1 : 0;
        const data = this.dom.getDataField()?.value;
        const endpoint = `/api/statistics/date/${data}`;

        const formData = {
            count: numero
        };

        console.log('Enviando dados:', formData);

        this.showLoading(true);
        this.showStatus('', '');

        try {
            const result = await this.apiService.request(endpoint, {
                method: 'PUT',
                body: JSON.stringify(formData)
            });

            if (result.success) {
                this.showStatus('Dados enviados com sucesso!', 'success');
                this.resetForm();
                console.log('Resposta da API:', result.data);
            } else {
                this.showStatus(`Erro no envio: ${result.error}`, 'error');
                console.error('Erro da API:', result.error);
            }

        } catch (error) {
            this.showStatus(`Erro de conexão: ${error.message}`, 'error');
            console.error('Erro inesperado:', error);
        } finally {
            this.showLoading(false);
        }
    }

    resetForm() {
        const dataField = this.dom.getDataField();
        const toggleButton = this.dom.getToggleButton();
        const toggleLabel = this.dom.getToggleLabel();

        if (dataField) {
            dataField.value = '';
        }

        this.toggleState = false;
        if (toggleButton) {
            toggleButton.classList.remove('active');
        }
        if (toggleLabel) {
            toggleLabel.textContent = 'Desativado (0)';
        }
    }

    showStatus(message, type) {
        const statusDiv = this.dom.getStatusDiv();

        if (statusDiv) {
            if (message) {
                statusDiv.textContent = message;
                statusDiv.className = `status ${type}`;
                statusDiv.style.display = 'block';

                setTimeout(() => {
                    statusDiv.style.display = 'none';
                }, 5000);
            } else {
                statusDiv.style.display = 'none';
            }
        }
    }

    showLoading(show) {
        const submitButton = this.dom.getSubmitButton();

        if (submitButton) {
            submitButton.disabled = show;
            submitButton.textContent = show ? 'Enviando...' : 'Enviar Dados';
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