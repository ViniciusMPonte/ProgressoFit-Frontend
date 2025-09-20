import BaseController from "./BaseController.js";
import { PerfilView } from "../view/PerfilView.js";
import { RegisterDTO } from "../model/dto/RegisterDTO.js";

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
        this.setupSaveButtonListener();
        this.setupEditButtonListener();
        this.setupCancelButtonListener();
    }

    setupSaveButtonListener() {
        const saveButton = this.dom.getSaveButton();
        if (!saveButton) return;

        saveButton.addEventListener('click', () => {
            this.updateProfileData();
        })
    }

    setupEditButtonListener() {
        const editButton = this.dom.getEditButton();
        if (!editButton) return;

        editButton.addEventListener('click', () => {
            this.view.enableEdit();
            this.storeOriginalData();
            this.dom.getPasswordInput().value = ''
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


    async updateProfileData() {
        const name = this.dom.getNameInput()?.value;
        const email = this.dom.getEmailInput()?.value;
        const password = this.dom.getPasswordInput()?.value;

        const registerDto = new RegisterDTO(name, email, password);
        const validation = registerDto.validate();

        if (!validation.isValid) {
            this.view.alert(validation.errors[0], 'warning');
            return;
        }

        try {
            const result = await this.apiService.put('/api/user', registerDto);

            if (result.success) {
                this.redirect.to('perfil');
            } else {
                this.view.alert(result.message || 'Erro ao criar conta. Tente novamente.', 'danger');
            }
        } catch (error) {
            console.error('Erro durante o atualização:', error);
            this.view.alert('Erro interno. Tente novamente mais tarde.', 'danger');
        }
    }

    async getUserProfile() {
        let response = await this.apiService.get('/api/user');
        this.dom.getNameInput().value = response.data.name
        this.dom.getEmailInput().value = response.data.email
        this.dom.getPasswordInput().value = '********'
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