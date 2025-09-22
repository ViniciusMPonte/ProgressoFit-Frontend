export class AvatarComponent {
    constructor() {
        this.avatarNames = [];
        this.loadAllAvatarNames();
    }

    async loadAllAvatarNames() {
        let imageIndex = 1;
        
        while (true) {
            try {
                const imageName = `avatar-${imageIndex}`;
                const imageExists = await this.checkImageExists(`/src/assets/images/avatars/${imageName}.png`);
                
                if (!imageExists) {
                    break;
                }
                
                this.avatarNames.push(imageName);
                imageIndex++;
            } catch (error) {
                break;
            }
        }
    }

    checkImageExists(src) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = src;
        });
    }

    getAvatarNames() {
        return this.avatarNames;
    }
}
