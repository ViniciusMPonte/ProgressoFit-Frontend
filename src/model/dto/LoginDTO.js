export class LoginDTO {
    constructor(email = '', password = '') {
        this.email = email;
        this.password = password;
    }

    validate() {
        const errors = [];

        if (!this.email || !this.email.trim()) {
            errors.push('Email é obrigatório');
        } else if (!this.isValidEmail(this.email)) {
            errors.push('Email inválido');
        }

        if (!this.password || !this.password.trim()) {
            errors.push('Senha é obrigatória');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    toJSON() {
        return {
            email: this.email.trim().toLowerCase(),
            password: this.password
        };
    }
}