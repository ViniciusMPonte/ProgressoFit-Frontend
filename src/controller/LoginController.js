import {LoginView} from "../view/LoginView.js";
import {LoginDTO} from "../model/dto/LoginDTO.js";
import BaseController from "./BaseController.js";

export class LoginController extends BaseController {
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
                await this.handleLogin();
            });
        }
    }

    handleFooter(){
        const footerTag = this.dom.getFooterTag();
        if (footerTag) {
            footerTag.innerHTML = LoginView.renderFooter();
        }
    }

    async handleLogin() {
        const email = this.dom.getEmailInput()?.value;
        const password = this.dom.getPasswordInput()?.value;

        const loginDto = new LoginDTO(email, password);
        const validation = loginDto.validate();

        if (!validation.isValid) {
            this.showError(validation.errors[0]);
            return;
        }

        this.showLoading(true);
        this.showError('');

        try {
            const result = await this.apiService.login(loginDto);

            if (result.success) {

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
        const loginButton = this.dom.getLoginButton();

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