import BaseController from "./BaseController.js";
import { PerfilView } from "../view/PerfilView.js";

export class PerfilController extends BaseController {
    constructor(redirectManager, apiService) {
        super(redirectManager, apiService);
        this.dom = new DOMElementManager();
        this.view = new PerfilView(this.dom)
        this.originalData = {};
    }

    loadPage() {
        this.setupEventListeners();
        this.getUserProfile()
    }

    setupEventListeners() {
        this.setupEditButtonListener();
        this.setupCancelButtonListener();
    }

    setupEditButtonListener() {
        const editButton = this.dom.getEditButton();
        if (!editButton) return;

        editButton.addEventListener('click', () => {
            this.view.enableEdit();
            this.storeOriginalData();
        })
    }

    setupCancelButtonListener() {
        const cancelButton = this.dom.getCancelButton();
        if (!cancelButton) return;

        cancelButton.addEventListener('click', () => {
            this.view.disableEdit();
            this.restoresOriginalData();
        })
    }

    storeOriginalData() {
        this.originalData = {
            name: this.dom.getNameInput()?.value || '',
            email: this.dom.getEmailInput()?.value || '',
            password: this.dom.getPasswordInput()?.value || ''
        };
    }

    restoresOriginalData() {
        const nameInput = this.dom.getNameInput();
        const emailInput = this.dom.getEmailInput();
        const passwordInput = this.dom.getPasswordInput();

        if (nameInput) nameInput.value = this.originalData.name;
        if (emailInput) emailInput.value = this.originalData.email;
        if (passwordInput) passwordInput.value = this.originalData.password;
    }

    async getUserProfile(){
        let teste = await this.apiService.get('/api/user');
        this.dom.getNameInput().value = teste.data.name
        this.dom.getEmailInput().value = teste.data.email
        this.dom.getPasswordInput().value = 'xxxxxxxx'
        return teste;
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

    getCancelButton() {
        if (!this.elements.cancelButton) {
            this.elements.cancelButton = document.querySelector('#cancelButton');
        }
        return this.elements.cancelButton;
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