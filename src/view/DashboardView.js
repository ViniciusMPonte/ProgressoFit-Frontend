import { CopyrightComponent } from "./component/CopyrightComponent.js";
import { TrainingPerWeeklyChartComponent } from "./component/TrainingPerWeeklyChartComponent.js";

export class DashboardView {

    constructor(dom) {
        this.dom = dom
        this.toggleState = false;
    }

    getToggleState(){
        return this.toggleState
    }

    setupToggleListener() {
        const toggleButton = this.dom.getToggleButton();
        const toggleLabel = this.dom.getToggleLabel();

        if (toggleButton && toggleLabel) {
            toggleButton.addEventListener('click', () => {
                this.toggleState = !this.toggleState;

                if (this.toggleState) {
                    toggleButton.classList.add('active');
                    toggleLabel.textContent = '✅';
                } else {
                    toggleButton.classList.remove('active');
                    toggleLabel.textContent = '';
                }
            });
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
            toggleLabel.textContent = '';
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

    renderTrainingPerWeeklyChart(ctx, data) {
        new TrainingPerWeeklyChartComponent(ctx, data).autoRender()
    }

    renderFooter() {
        return CopyrightComponent.get();
    }
}