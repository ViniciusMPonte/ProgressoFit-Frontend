export class AvatarComponent {
    static avatarNames = [
        'avatar-1',
        'avatar-2',
        'avatar-3',
        'avatar-4',
        'avatar-5',
        'avatar-6',
    ];

    getAvatarNames() {
        return AvatarComponent.avatarNames;
    }

    getAllAvatarImg() {
        let buffer = ''
        AvatarComponent.avatarNames.forEach((avatarName) => {
            buffer += `<img src="../src/assets/images/avatars/${avatarName}.png"/>`
        })
        return buffer
    }

    getAllAvatarImgOptions() {
        let buffer = ''
        AvatarComponent.avatarNames.forEach((avatarName) => {
            buffer += `
                <div class="image-option" data-image="${avatarName}">    
                    <img src="../src/assets/images/avatars/${avatarName}.png"/>
                </div>
            `
        })
        return buffer
    }
}