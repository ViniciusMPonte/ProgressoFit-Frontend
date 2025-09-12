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

    updateToogleButton() {
        const toggleButton = this.dom.getToggleButton();
        const toggleLabel = this.dom.getToggleLabel();

        if (this.toggleState) {
            toggleButton.classList.remove('btn-danger');
            toggleButton.classList.add('btn-primary');
            toggleLabel.innerHTML = '☑ Sim';
        } else {
            toggleButton.classList.remove('btn-primary');
            toggleButton.classList.add('btn-danger');
            toggleLabel.innerHTML = '☐ Não';
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
        const toggleButton = this.dom.getToggleButton();
        const toggleLabel = this.dom.getToggleLabel();

        if (toggleButton) {
            toggleButton.disabled = show;

            if (show) {
                toggleButton.classList.add('disabled');
                toggleLabel.innerHTML = `
                <span class="spinner-border spinner-border-sm me-2"></span>
                Enviando...
            `;
            } else {
                toggleButton.classList.remove('disabled');
                this.updateToogleButton()
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