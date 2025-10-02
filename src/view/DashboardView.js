import BaseView from "./BaseView.js";
import { HeroComponent } from "./component/HeroComponent.js";
import { CopyrightComponent } from "./component/CopyrightComponent.js";
import { TrainingPerWeeklyChartComponent } from "./component/TrainingPerWeeklyChartComponent.js";
import { WeightDailyStatisticChartComponent } from "./component/WeightDailyStatisticChartComponent.js";

export class DashboardView extends BaseView {

    constructor(dom) {
        super()
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
            toggleLabel.innerHTML = '<i class="fa-solid fa-square-check fa-xl"></i>&nbsp Sim';
        } else {
            toggleButton.classList.remove('btn-primary');
            toggleButton.classList.add('btn-danger');
            toggleLabel.innerHTML = '<i class="fa-solid fa-square-xmark fa-xl"></i>&nbsp Não';
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

    renderWelcomeText(data){
        return new HeroComponent(data).getWelcomeText()
    }

    renderAvatarImg(data) {
        return new HeroComponent(data).getAvatarImg()
    }

    renderTrainingPerWeeklyChart(ctx, data) {

        const existingChart = Chart.getChart(ctx);
        if (existingChart) {
            existingChart.destroy();
        }

        new TrainingPerWeeklyChartComponent(ctx, data).autoRender()
    }

    WeightDailyStatisticChart(ctx, data) {

        const existingChart = Chart.getChart(ctx);
        if (existingChart) {
            existingChart.destroy();
        }

        new WeightDailyStatisticChartComponent(ctx, data).autoRender()
    }

    renderFooter() {
        return CopyrightComponent.get();
    }
}