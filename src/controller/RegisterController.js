import {RegisterView} from "../view/RegisterView.js";
import BaseController from "./BaseController.js";

export class RegisterController extends BaseController {
    constructor(redirectManager, apiService) {
        super(redirectManager, apiService)
        this.domManager = new DOMElementManager();
    }

    loadPage() {
        this.setupDynamicContent();
        this.setupEventListeners();
    }

    setupDynamicContent(){
        this.handleCurrentYear()
    }

    setupEventListeners() {
        const form = this.domManager.getForm();

        if (form) {
            form.addEventListener('submit', async (event) => {
                event.preventDefault();
                await this.handleRegister();
            });
        }
    }

    handleCurrentYear(){
        const yearTag = this.domManager.getYearTag();
        if (yearTag) {
            yearTag.innerHTML = RegisterView.renderCurrentYear();
        }
    }

    async handleRegister() {
        const name = this.domManager.getNameInput()?.value;
        const email = this.domManager.getEmailInput()?.value;
        const password = this.domManager.getPasswordInput()?.value;

        if (!name || !email || !password) {
            this.showError('Por favor, preencha todos os campos.');
            return;
        }

        if (!this.validateEmail(email)) {
            this.showError('Por favor, insira um e-mail válido.');
            return;
        }

        if (!this.validatePassword(password)) {
            this.showError('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        this.showLoading(true);
        this.showError('');

        try {
            const result = await this.apiService.register(name, email, password);

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

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validatePassword(password) {
        return password && password.length >= 6;
    }

    showError(message) {
        const errorDiv = this.domManager.getErrorDiv();
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
        const loadingDiv = this.domManager.getLoadingDiv();
        const registerButton = this.domManager.getRegisterButton();

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

    getYearTag() {
        if (!this.elements.yearTag) {
            this.elements.yearTag = document.querySelector('#year-tag');
        }
        return this.elements.yearTag;
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