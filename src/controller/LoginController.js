import {LoginView} from "../view/LoginView.js";
import {LoginDTO} from "../model/dto/LoginDTO.js";
import BaseController from "./BaseController.js";

export class LoginController extends BaseController {
    constructor(redirectManager, apiService) {
        super(redirectManager, apiService)
        this.dom = new DOMElementManager();
        this.view = new LoginView()
    }

    loadPage() {
        this.setupDynamicContent();
        this.setupEventListeners();
    }

    setupDynamicContent(){
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

    async handleLogin() {
        const email = this.dom.getEmailInput()?.value;
        const password = this.dom.getPasswordInput()?.value;

        const loginDto = new LoginDTO(email, password);
        const validation = loginDto.validate();

        if (!validation.isValid) {
            this.view.alert(validation.errors[0], 'warning');
            return;
        }

        this.showLoading(true);

        try {
            const result = await this.apiService.login(loginDto);

            if (result.success) {

                if (result.data.token) {
                    localStorage.setItem('authToken', result.data.token);
                }

                this.redirect.to('dashboard');

            } else {
                this.view.alert('Credenciais inválidas. Tente novamente.', 'danger');
            }
        } catch (error) {
            console.error('Erro durante o login:', error);
            this.view.alert('Erro interno. Tente novamente mais tarde.', 'danger');
        } finally {
            this.showLoading(false);
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