import BaseView from './BaseView.js'
import { HeroComponent } from './component/HeroComponent.js'
import { CopyrightComponent } from './component/CopyrightComponent.js'
import { TrainingPerWeeklyChartComponent } from './component/training-per-weekly/chart/TrainingPerWeeklyChartComponent.js'
import { TrainingPerWeeklyInterfaceComponent } from './component/training-per-weekly/interface/TrainingPerWeeklyInterfaceComponent.js'
import { TrainingPerWeeklyGoalComponent } from './component/training-per-weekly/goal/TrainingPerWeeklyGoalComponent.js'
import { WeightDailyStatisticChartComponent } from './component/weight-per-weekly/chart/WeightDailyStatisticChartComponent.js'
import { WeightPerWeeklyInterfaceComponent } from './component/weight-per-weekly/interface/WeightPerWeeklyInterfaceComponent.js'
import { WeightPerWeeklyGoalComponent } from './component/weight-per-weekly/goal/WeightPerWeeklyGoalComponent.js'

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

    renderTrainingPerWeeklyGoalComponent(cbFuction) {
        const targetTag = this.dom.getTrainingPerWeeklyGoal()
        const component = new TrainingPerWeeklyGoalComponent(targetTag)

        component.setCallbackProgress(cbFuction)
        component.autoRender()
    }

    renderTrainingPerWeeklyChart() {
        const ctx = this.dom.getTrainingPerWeeklyChart()

        const existingChart = Chart.getChart(ctx)
        if (existingChart) {
            existingChart.destroy()
        }

        new TrainingPerWeeklyChartComponent(ctx).autoRender()
    }

    renderWeightPerWeeklyInterfaceComponent(cbFuction) {
        const targetTag = this.dom.getWeightPerWeeklyInterface()
        const component = new WeightPerWeeklyInterfaceComponent(targetTag)

        component.componentService.setCallbackForm(cbFuction)
        component.autoRender()
    }

    renderWeightPerWeeklyGoalComponent() {
        const targetTag = this.dom.getWeightPerWeeklyGoal()
        new WeightPerWeeklyGoalComponent(targetTag).autoRender()
    }

    renderWeightDailyStatisticChart() {
        const ctx = this.dom.getWeightDailyWeeklyChartTag()

        const existingChart = Chart.getChart(ctx)
        if (existingChart) {
            existingChart.destroy()
        }

        new WeightDailyStatisticChartComponent(ctx).autoRender()
    }
}
