import {RegisterView} from "../view/RegisterView.js";
import {RegisterDTO} from "../model/dto/RegisterDTO.js";
import BaseController from "./BaseController.js";

export class RegisterController extends BaseController {
    constructor(redirectManager, apiService) {
        super(redirectManager, apiService)
        this.dom = new DOMElementManager();
    }

    loadPage() {
        this.setupDynamicContent();
        this.setupEventListeners();
    }

    setupDynamicContent(){
        this.handleFooter()
    }

    setupEventListeners() {
        const form = this.dom.getForm();

        if (form) {
            form.addEventListener('submit', async (event) => {
                event.preventDefault();
                await this.handleRegister();
            });
        }
    }

    handleFooter(){
        const footerTag = this.dom.getFooterTag();
        if (footerTag) {
            footerTag.innerHTML = RegisterView.renderFooter();
        }
    }

    async handleRegister() {
        const name = this.dom.getNameInput()?.value;
        const email = this.dom.getEmailInput()?.value;
        const password = this.dom.getPasswordInput()?.value;

        const registerDto = new RegisterDTO(name, email, password);
        const validation = registerDto.validate();

        if (!validation.isValid) {
            this.showError(validation.errors[0]);
            return;
        }

        this.showLoading(true);
        this.showError('');

        try {
            const result = await this.apiService.register(registerDto);

            if (result.success) {

                if (result.data.token) {
                    localStorage.setItem('authToken', result.data.token);
                }

                this.redirect.to('dashboard');

            } else {
                this.showError(result.message || 'Erro ao criar conta. Tente novamente.');
            }
        } catch (error) {
            console.error('Erro durante o cadastro:', error);
            this.showError('Erro interno. Tente novamente mais tarde.');
        } finally {
            this.showLoading(false);
        }
    }

    showError(message) {
        const errorDiv = this.dom.getErrorDiv();
        if (errorDiv) {
            if (message) {
                errorDiv.textContent = message;
                errorDiv.classList.remove('d-none');
            } else {
                errorDiv.classList.add('d-none');
            }
        }
    }

    showLoading(show) {
        const loadingDiv = this.dom.getLoadingDiv();
        const registerButton = this.dom.getRegisterButton();

        if (registerButton) {
            registerButton.disabled = show;
            registerButton.textContent = show ? 'Criando conta...' : 'Criar conta';
        }

        if (loadingDiv) {
            if (show) {
                loadingDiv.classList.remove('d-none');
            } else {
                loadingDiv.classList.add('d-none');
            }
        }
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
            this.elements.form = document.querySelector('#loginForm');
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

    getErrorDiv() {
        if (!this.elements.errorDiv) {
            this.elements.errorDiv = document.querySelector('#error-message');
        }
        return this.elements.errorDiv;
    }

    getLoadingDiv() {
        if (!this.elements.loadingDiv) {
            this.elements.loadingDiv = document.querySelector('#loading');
        }
        return this.elements.loadingDiv;
    }

    getRegisterButton() {
        if (!this.elements.registerButton) {
            this.elements.registerButton = document.querySelector('#registerButton');
        }
        return this.elements.registerButton;
    }

    destroy() {
        this.elements = {};
    }
}