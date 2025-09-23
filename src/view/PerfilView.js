import BaseView from "./BaseView.js";
import { CopyrightComponent } from "./component/CopyrightComponent.js";
import { AvatarComponent } from "./component/AvatarComponent.js";

export class PerfilView extends BaseView {

    constructor(dom) {
        super()
        this.dom = dom
    }

    enableEdit() {
        this.enableEditForm()
        this.enableEditButtons()
    }

    disableEdit() {
        this.disableEditForm()
        this.disableEditButtons()
    }

    enableEditForm() {
        const avatarOptContainer = this.dom.getAvatarOptions()
        avatarOptContainer.classList.add('editing')

        const inputs = [
            this.dom.getNameInput(),
            this.dom.getEmailInput(),
            this.dom.getPasswordInput()
        ];

        inputs.forEach(input => {
            if (!input) return

            input.removeAttribute('readonly');
            input.classList.remove('form-control-plaintext');
            input.classList.add('form-control');

        });
    }

    disableEditForm() {
        const avatarOptContainer = this.dom.getAvatarOptions()
        avatarOptContainer.classList.remove('editing')

        const inputs = [
            this.dom.getNameInput(),
            this.dom.getEmailInput(),
            this.dom.getPasswordInput()
        ];

        inputs.forEach(input => {
            if (!input) return

            input.setAttribute('readonly', true);
            input.classList.remove('form-control');
            input.classList.add('form-control-plaintext');

        });
    }

    enableEditButtons() {
        const editButton = this.dom.getEditButton();
        const saveButton = this.dom.getSaveButton();
        const cancelButton = this.dom.getCancelButton();

        if (editButton) editButton.classList.add('d-none');
        if (saveButton) saveButton.classList.remove('d-none');
        if (cancelButton) cancelButton.classList.remove('d-none');
    }

    disableEditButtons() {
        const editButton = this.dom.getEditButton();
        const saveButton = this.dom.getSaveButton();
        const cancelButton = this.dom.getCancelButton();

        if (editButton) editButton.classList.remove('d-none');
        if (saveButton) saveButton.classList.add('d-none');
        if (cancelButton) cancelButton.classList.add('d-none');
    }

    swapSelected(allTags, selectedTag) {
        allTags.forEach(opt => opt.classList.remove('selected'));
        selectedTag.classList.add('selected');
    }

    selectAvatarOptByImgName(profileImgName) {
        const selectedImg = document.querySelector(`.image-option[data-image="${profileImgName}"]`)
        if (!selectedImg) return

        const avatarOptionsContainer = this.dom.getAvatarOptions()
        const imageOptions = [...avatarOptionsContainer.children]

        this.swapSelected(imageOptions, selectedImg)
    }

    renderAvartarImgOptions() {
        return new AvatarComponent().getAllAvatarImgOptions();
    }

    static renderFooter() {
        return CopyrightComponent.get();
    }
}