export class HeroComponent {

    constructor(data = {}) {
        this.setData(data)
    }

    setData(data) {
        this.name = data.name || ''
        this.profileImg = data.profileImg || ''
    }

    get() {
        return `Seja bem-vindo, <b>${this.name}!</b>`;
    }
}