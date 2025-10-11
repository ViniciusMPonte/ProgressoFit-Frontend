import BaseView from './BaseView.js'
import { HeroComponent } from './component/HeroComponent.js'
import { CopyrightComponent } from './component/CopyrightComponent.js'
import { TrainingPerWeeklyChartComponent } from './component/training-per-weekly/chart/TrainingPerWeeklyChartComponent.js'
import { TrainingPerWeeklyInterfaceComponent } from './component/training-per-weekly/TrainingPerWeeklyInterfaceComponent.js'
import { TrainingPerWeeklyGoalComponent } from './component/training-per-weekly/goal/TrainingPerWeeklyGoalComponent.js'
import { WeightDailyStatisticChartComponent } from './component/WeightDailyStatisticChartComponent.js'
import { WeightPerWeeklyInterfaceComponent } from './component/WeightPerWeeklyInterfaceComponent.js'

export class DashboardView extends BaseView {
    constructor(dom) {
        super()
        this.dom = dom
        this.toggleState = false
        this.trainingPerWeeklyInterfaceComponent = new TrainingPerWeeklyInterfaceComponent()
        this.weightPerWeeklyInterfaceComponent = new WeightPerWeeklyInterfaceComponent()
    }

    renderTrainingPerWeeklyInterfaceComponent(targetTag) {
        new TrainingPerWeeklyInterfaceComponent(targetTag).autoRender()
    }

    renderTrainingPerWeeklyGoalComponent(targetTag) {
        new TrainingPerWeeklyGoalComponent(targetTag).autoRender()
    }

    renderWeightPerWeeklyInterfaceComponent(targetTag) {
        new WeightPerWeeklyInterfaceComponent(targetTag).autoRender()
    }

    renderWelcomeText(data) {
        return new HeroComponent(data).getWelcomeText()
    }

    renderAvatarImg(data) {
        return new HeroComponent(data).getAvatarImg()
    }

    renderTrainingPerWeeklyChart(ctx) {
        const existingChart = Chart.getChart(ctx)
        if (existingChart) {
            existingChart.destroy()
        }

        new TrainingPerWeeklyChartComponent(ctx).autoRender()
    }

    renderWeightDailyStatisticChart(ctx, data) {
        const existingChart = Chart.getChart(ctx)
        if (existingChart) {
            existingChart.destroy()
        }

        new WeightDailyStatisticChartComponent(ctx, data).autoRender()
    }

    renderFooter() {
        return CopyrightComponent.get()
    }
}
