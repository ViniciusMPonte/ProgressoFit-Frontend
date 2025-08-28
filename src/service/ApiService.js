import {Routes} from "../router/Routes.js";

export class ApiService extends Routes {
    constructor() {
        super()
        this.baseURL = 'http://localhost:8090';
        this.headers = {
            'Content-Type': 'application/json',
        };
    }

    getToken(){
        return  localStorage.getItem('authToken') ? localStorage.getItem('authToken') : ''
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;

        const headers = { ...this.headers };

        if (this.requiresAuthByPath(window.location.pathname)) {
            const token = this.getToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        const config = {
            headers,
            ...options
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return { success: true, data, status: response.status };

        } catch (error) {
            console.error('Erro na requisição:', error);
            return { success: false, error: error.message };
        }
    }

    async login(loginDto) {
        return await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(loginDto.toJSON())
        });
    }

    async register(registerDto) {
        return await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(registerDto.toJSON())
        });
    }

    async checkAuth() {
        return await this.request('/auth/check', { method: 'GET' });
    }

    async get(endpoint) {
        return await this.request(endpoint, { method: 'GET' });
    }

    async post(endpoint, data) {
        return await this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
}