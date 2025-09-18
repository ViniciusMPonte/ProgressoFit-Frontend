import BaseView from "./BaseView.js";
import { CopyrightComponent } from "./component/CopyrightComponent.js";

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

    static renderFooter() {
        return CopyrightComponent.get();
    }
}