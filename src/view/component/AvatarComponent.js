export class AvatarComponent {
    constructor() {
        this.avatarNames = [
            'avatar-1',
            'avatar-2',
            'avatar-3',
            'avatar-4',
            'avatar-5',
            'avatar-6',
        ];
    }

    getAvatarNames() {
        return this.avatarNames;
    }

    getAllAvatarImg() {
        let buffer = ''
        this.avatarNames.forEach((avatarName)=>{
            buffer += `<img src="/src/assets/images/avatars/${avatarName}.png"/>`
        })
        return buffer
    }
}