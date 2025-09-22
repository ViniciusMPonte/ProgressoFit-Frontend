export class HeroComponent {

    constructor(data = {}) {
        this.setData(data)
    }

    setData(data) {
        this.name = data.name || ''
        this.profileImgName = data.profileImgName || 'avatar-1'
    }

    getWelcomeText() {
        return `Seja bem-vindo, <b>${this.name}!</b>`;
    }

    getAvatarImg(){
        return `<img class="avatar-fixo" src="/src/assets/images/${this.profileImgName}.png" alt="Avatar do Usuário" />`
    }
}

