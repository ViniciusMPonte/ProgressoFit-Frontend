import {LoginView} from "../view/LoginView.js";
import BaseController from "./BaseController.js";

export class LoginController extends BaseController {
    constructor() {
        super()
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
                await this.handleLogin();
            });
        }
    }

    handleCurrentYear(){
        const yearTag = this.domManager.getYearTag();
        if (yearTag) {
            yearTag.innerHTML = LoginView.renderCurrentYear();
        }
    }

    async handleLogin() {
        const email = this.domManager.getEmailInput()?.value;
        const password = this.domManager.getPasswordInput()?.value;

        if (!email || !password) {
            this.showError('Por favor, preencha todos os campos.');
            return;
        }

        this.showLoading(true);
        this.showError('');

        try {
            const result = await this.apiService.login(email, password);

            if (result.success) {
                console.log('Login realizado com sucesso:', result.data);

                if (result.data.token) {
                    localStorage.setItem('authToken', result.data.token);
                }

                this.redirect.to('dashboard');

            } else {
                this.showError('Credenciais inválidas. Tente novamente.');
            }
        } catch (error) {
            console.error('Erro durante o login:', error);
            this.showError('Erro interno. Tente novamente mais tarde.');
        } finally {
            this.showLoading(false);
        }
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
        const loginButton = this.domManager.getLoginButton();

        if (loginButton) {
            loginButton.disabled = show;
            loginButton.textContent = show ? 'Entrando...' : 'Login';
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

    getEmailInput() {
        if (!this.elements.emailInput) {
            this.elements.emailInput = document.querySelector('#floatingInput');
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

    getLoginButton() {
        if (!this.elements.loginButton) {
            this.elements.loginButton = document.querySelector('#loginButton');
        }
        return this.elements.loginButton;
    }

    destroy() {
        this.elements = {};
    }
}