import {CopyrightComponent} from "./component/CopyrightComponent.js";
import {TrainingPerWeeklyChartComponent} from "./component/TrainingPerWeeklyChartComponent.js";

export class DashboardView {

    static renderTrainingPerWeeklyChart(ctx, data) {
        new TrainingPerWeeklyChartComponent(ctx, data).autoRender()
    }

    static renderFooter() {
        return CopyrightComponent.get();
    }
}