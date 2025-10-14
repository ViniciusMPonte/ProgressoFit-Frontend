import BaseView from './BaseView.js'
import { EditProfileComponent } from './component/profile/EditProfileComponent.js'
import { CopyrightComponent } from './component/CopyrightComponent.js'

export class PerfilView extends BaseView {
    constructor(dom) {
        super()
        this.dom = dom
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

    renderFooter() {
        const footerTag = document.querySelector('#footer')
        if (footerTag) {
            footerTag.innerHTML = CopyrightComponent.get()
        }
    }
}
