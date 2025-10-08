import BaseView from "./BaseView.js";
import { HeroComponent } from "./component/HeroComponent.js";
import { CopyrightComponent } from "./component/CopyrightComponent.js";
import { TrainingPerWeeklyChartComponent } from "./component/TrainingPerWeeklyChartComponent.js";
import { WeightDailyStatisticChartComponent } from "./component/WeightDailyStatisticChartComponent.js";
import { TrainingPerWeeklyInterfaceComponent } from "./component/TrainingPerWeeklyInterfaceComponent.js";
import { TrainingPerWeeklyGoalComponent } from "./component/TrainingPerWeeklyGoalComponent.js";

export class DashboardView extends BaseView {

    constructor(dom) {
        super()
        this.dom = dom
        this.toggleState = false;
        this.trainingPerWeeklyInterfaceComponent = new TrainingPerWeeklyInterfaceComponent()
    }

    renderTrainingPerWeeklyInterfaceComponent(targetTag){
        new TrainingPerWeeklyInterfaceComponent(targetTag).autoRender()
    }

    renderTrainingPerWeeklyGoalComponent(targetTag, data){
        new TrainingPerWeeklyGoalComponent(targetTag, data).autoRender()
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

    renderWeightDailyStatisticChart(ctx, data) {

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