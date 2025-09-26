import { AvatarComponent } from '../../view/component/AvatarComponent.js'

export class RegisterDTO {
    constructor(name = '', email = '', password = '', profileImgName = '') {
        this.name = name;
        this.email = email;
        this.password = password;
        this.profileImgName = profileImgName;
    }

    validate() {
        const errors = [];

        if (!this.name || this.name.trim().length < 3) {
            errors.push('Nome deve ter pelo menos 3 caracteres');
        }

        if (!this.email || !this.isValidEmail(this.email)) {
            errors.push('Email inválido');
        }

        if (!this.password || this.password.length < 8) {
            errors.push('Senha deve ter pelo menos 8 caracteres');
        }

        if (this.profileImgName != '' && !AvatarComponent.avatarNames.includes(this.profileImgName)) {
            errors.push('Nome de imagem inválido');
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
            name: this.name.trim(),
            email: this.email.trim().toLowerCase(),
            password: this.password,
            profileImgName: this.profileImgName.trim()
        };
    }
}