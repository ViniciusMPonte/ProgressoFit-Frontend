import { CopyrightComponent } from "./component/CopyrightComponent.js";
import { TrainingPerWeeklyChartComponent } from "./component/TrainingPerWeeklyChartComponent.js";

export class DashboardView {

    constructor(dom) {
        this.dom = dom
        this.toggleState = false;
    }

    getToggleState() {
        return this.toggleState
    }

    setToggleState(boolean) {
        this.toggleState = boolean
    }

    setupToggleListener() {
        const toggleButton = this.dom.getToggleButton();
        const toggleLabel = this.dom.getToggleLabel();

        if (toggleButton && toggleLabel) {
            toggleButton.addEventListener('click', () => {
                this.toggleState = !this.toggleState;
                this.updateToogleButton()
            });
        }
    }

    updateToogleButton() {
        if (this.toggleState) {
            toggleButton.classList.remove('btn-danger');
            toggleButton.classList.add('btn-primary');
            toggleLabel.textContent = '☑ Sim';
        } else {
            toggleButton.classList.remove('btn-primary');
            toggleButton.classList.add('btn-danger');
            toggleLabel.textContent = '☐ Não';
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
            toggleButton.classList.remove('btn-primary');
            toggleButton.classList.add('btn-danger');
        }

        if (toggleLabel) {
            toggleLabel.textContent = '☐ Não';
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

            if (show) {
                submitButton.classList.add('disabled');
                submitButton.innerHTML = `
                <span class="spinner-border spinner-border-sm me-2"></span>
                Enviando...
            `;
            } else {
                submitButton.classList.remove('disabled');
                submitButton.innerHTML = 'Salvar';
            }
        }
    }

    renderTrainingPerWeeklyChart(ctx, data) {

        const existingChart = Chart.getChart(ctx);
        if (existingChart) {
            existingChart.destroy();
        }
        
        new TrainingPerWeeklyChartComponent(ctx, data).autoRender()
    }

    renderFooter() {
        return CopyrightComponent.get();
    }
}