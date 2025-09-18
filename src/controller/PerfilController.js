import BaseController from "./BaseController.js";
import {PerfilView} from "../view/PerfilView.js";

export class PerfilController extends BaseController {
    constructor(redirectManager, apiService) {
        super(redirectManager, apiService);
        this.dom = new DOMElementManager();
        this.view = new PerfilView()
        this.isEditing = false;
    }
}

class DOMElementManager {
    constructor() {
        this.elements = {};
    }

    getFooterTag() {
        if (!this.elements.footerTag) {
            this.elements.footerTag = document.querySelector('#footer');
        }
        return this.elements.footerTag;
    }

    getForm() {
        if (!this.elements.form) {
            this.elements.form = document.querySelector('#profileForm');
        }
        return this.elements.form;
    }

    getNameInput() {
        if (!this.elements.nameInput) {
            this.elements.nameInput = document.querySelector('#floatingName');
        }
        return this.elements.nameInput;
    }

    getEmailInput() {
        if (!this.elements.emailInput) {
            this.elements.emailInput = document.querySelector('#floatingEmail');
        }
        return this.elements.emailInput;
    }

    getPasswordInput() {
        if (!this.elements.passwordInput) {
            this.elements.passwordInput = document.querySelector('#floatingPassword');
        }
        return this.elements.passwordInput;
    }

    getEditButton() {
        if (!this.elements.editButton) {
            this.elements.editButton = document.querySelector('#editButton');
        }
        return this.elements.editButton;
    }

    getSaveButton() {
        if (!this.elements.saveButton) {
            this.elements.saveButton = document.querySelector('#saveButton');
        }
        return this.elements.saveButton;
    }

    getLoadingDiv() {
        if (!this.elements.loadingDiv) {
            this.elements.loadingDiv = document.querySelector('#loading');
        }
        return this.elements.loadingDiv;
    }

    destroy() {
        this.elements = {};
    }
}