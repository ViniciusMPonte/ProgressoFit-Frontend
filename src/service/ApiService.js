export class ApiService {
    constructor() {
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

        const config = {
            headers: {
                ...this.headers,
                // 'Authorization': `Bearer ${this.getToken()}`
            },
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

    async login(email, password) {
        return await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    }

    async register(userData) {
        return await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
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