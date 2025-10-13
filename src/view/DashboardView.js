import BaseView from './BaseView.js'
import { HeroComponent } from './component/HeroComponent.js'
import { CopyrightComponent } from './component/CopyrightComponent.js'
import { TrainingPerWeeklyChartComponent } from './component/training-per-weekly/chart/TrainingPerWeeklyChartComponent.js'
import { TrainingPerWeeklyInterfaceComponent } from './component/training-per-weekly/interface/TrainingPerWeeklyInterfaceComponent.js'
import { TrainingPerWeeklyGoalComponent } from './component/training-per-weekly/goal/TrainingPerWeeklyGoalComponent.js'
import { WeightDailyStatisticChartComponent } from './component/weight-per-weekly/WeightDailyStatisticChartComponent.js'
import { WeightPerWeeklyInterfaceComponent } from './component/weight-per-weekly/WeightPerWeeklyInterfaceComponent.js'

export class DashboardView extends BaseView {
    constructor(dom) {
        super()
        this.dom = dom

        this.weightPerWeeklyInterfaceComponent = new WeightPerWeeklyInterfaceComponent()
    }

    renderWelcomeText(data) {
        return new HeroComponent(data).getWelcomeText()
    }

    renderAvatarImg(data) {
        return new HeroComponent(data).getAvatarImg()
    }


    renderFooter() {
        return CopyrightComponent.get()
    }

    renderTrainingPerWeeklyInterfaceComponent(cbFuction) {
        const targetTag = this.dom.getTrainingPerWeeklyInterface()
        const component = new TrainingPerWeeklyInterfaceComponent(targetTag)

        component.componentService.setCallbackForm(cbFuction)
        component.autoRender()
    }

    renderTrainingPerWeeklyGoalComponent() {
        const targetTag = this.dom.getTrainingPerWeeklyGoal()
        new TrainingPerWeeklyGoalComponent(targetTag).autoRender()
    }

    renderTrainingPerWeeklyChart() {
        const ctx = this.dom.getTrainingPerWeeklyChart()

        const existingChart = Chart.getChart(ctx)
        if (existingChart) {
            existingChart.destroy()
        }

        new TrainingPerWeeklyChartComponent(ctx).autoRender()
    }

    renderWeightPerWeeklyInterfaceComponent() {
        const targetTag = this.dom.getWeightPerWeeklyInterface()
        new WeightPerWeeklyInterfaceComponent(targetTag).autoRender()
    }

    renderWeightDailyStatisticChart(ctx, data) {
        const existingChart = Chart.getChart(ctx)
        if (existingChart) {
            existingChart.destroy()
        }

        new WeightDailyStatisticChartComponent(ctx, data).autoRender()
    }
}
