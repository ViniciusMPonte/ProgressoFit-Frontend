import BaseView from './BaseView.js'
import { EditProfileComponent } from './component/profile/EditProfileComponent.js'
import { GoalTrainingCreationComponent } from './component/goal-training-creation/GoalTrainingCreationComponent.js'
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

    renderWeightPlaceholder() {
        const targetTag = this.dom.getWeightContainer()
        if (!targetTag) return

        targetTag.innerHTML = /*html*/ `
            <div class="card-header" style="margin: 0; align-items: center; padding: 20px; font-size: x-large">
                <span class="g-bold"><i class="fa-solid fa-weight-scale fa-lg"></i>&nbsp;&nbsp;Peso</span>
            </div>
            <div class="card-body p-5">
                <p class="text-muted">Seção de peso em desenvolvimento...</p>
            </div>
        `
    }

    renderFooter() {
        const footerTag = document.querySelector('#footer')
        if (footerTag) {
            footerTag.innerHTML = CopyrightComponent.get()
        }
    }
}
