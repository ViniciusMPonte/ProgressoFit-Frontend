import BaseView from './BaseView.js'
import { EditProfileComponent } from './component/profile/EditProfileComponent.js'
import { GoalTrainingCreationComponent } from './component/goal-training-creation/GoalTrainingCreationComponent.js'
import { GoalWeightCreationComponent } from './component/goal-weight-creation/GoalWeightCreationComponent.js'
import { SidebarNavigationComponent } from './component/navigation/SidebarNavigationComponent.js'
import { CopyrightComponent } from './component/CopyrightComponent.js'

export class PerfilView extends BaseView {
    constructor(dom) {
        super()
        this.dom = dom
        this.sidebarNavigation = null
    }

    renderSidebarNavigation() {
        this.sidebarNavigation = new SidebarNavigationComponent()
        this.sidebarNavigation.autoRender()
    }

    renderEditProfileComponent(cbFunction) {
        const targetTag = this.dom.getProfileContainer()
        if (!targetTag) return

        const component = new EditProfileComponent(targetTag)

        if (cbFunction) {
            component.componentService.setCallbackForm(cbFunction)
        }

        component.autoRender()
    }

    renderTrainingSection(cbFunction) {
        const targetTag = this.dom.getTrainingContainer()
        if (!targetTag) return

        const component = new GoalTrainingCreationComponent(targetTag)

        if (cbFunction) {
            component.componentService.setCallbackForm(cbFunction)
        }

        component.autoRender()
    }

    renderWeightSection(cbFunction) {
        const targetTag = this.dom.getWeightContainer()
        if (!targetTag) return

        const component = new GoalWeightCreationComponent(targetTag)

        if (cbFunction) {
            component.componentService.setCallbackForm(cbFunction)
        }

        component.autoRender()
    }

    renderFooter() {
        const footerTag = document.querySelector('#footer')
        if (footerTag) {
            footerTag.innerHTML = CopyrightComponent.get()
        }
    }
}