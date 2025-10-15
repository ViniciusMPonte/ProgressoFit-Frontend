export class SidebarNavigationComponent {
    constructor() {
        this.dom = new DOMElementManager()
        this.currentSection = 'profile'
    }

    autoRender() {
        this.setupEventListeners()
        this.showSection(this.currentSection)
    }

    setupEventListeners() {
        this.setupProfileButtonListener()
        this.setupTrainingButtonListener()
        this.setupWeightButtonListener()
    }

    setupProfileButtonListener() {
        const profileButton = this.dom.getProfileButton()
        if (!profileButton) return

        profileButton.addEventListener('click', () => {
            this.showSection('profile')
        })
    }

    setupTrainingButtonListener() {
        const trainingButton = this.dom.getTrainingButton()
        if (!trainingButton) return

        trainingButton.addEventListener('click', () => {
            this.showSection('training')
        })
    }

    setupWeightButtonListener() {
        const weightButton = this.dom.getWeightButton()
        if (!weightButton) return

        weightButton.addEventListener('click', () => {
            this.showSection('weight')
        })
    }

    showSection(sectionName) {
        this.currentSection = sectionName

        this.updateContainers(sectionName)
        this.updateActiveButton(sectionName)
    }

    updateContainers(activeSectionName) {
        const sections = {
            profile: this.dom.getProfileContainer(),
            training: this.dom.getTrainingContainer(),
            weight: this.dom.getWeightContainer(),
        }

        Object.entries(sections).forEach(([name, container]) => {
            if (!container) return

            if (name === activeSectionName) {
                container.classList.remove('d-none')
            } else {
                container.classList.add('d-none')
            }
        })
    }

    updateActiveButton(activeSectionName) {
        const buttons = {
            profile: this.dom.getProfileButton(),
            training: this.dom.getTrainingButton(),
            weight: this.dom.getWeightButton(),
        }

        Object.entries(buttons).forEach(([name, button]) => {
            if (!button) return

            if (name === activeSectionName) {
                button.classList.add('active')
            } else {
                button.classList.remove('active')
            }
        })
    }

    getCurrentSection() {
        return this.currentSection
    }
}

class DOMElementManager {
    constructor() {
        this.elements = {}
    }

    getProfileButton() {
        if (!this.elements.profileButton) {
            const buttons = document.querySelectorAll('.left-highlight-btn')
            this.elements.profileButton = buttons[0]
        }
        return this.elements.profileButton
    }

    getTrainingButton() {
        if (!this.elements.trainingButton) {
            const buttons = document.querySelectorAll('.left-highlight-btn')
            this.elements.trainingButton = buttons[1]
        }
        return this.elements.trainingButton
    }

    getWeightButton() {
        if (!this.elements.weightButton) {
            const buttons = document.querySelectorAll('.left-highlight-btn')
            this.elements.weightButton = buttons[2]
        }
        return this.elements.weightButton
    }

    getProfileContainer() {
        if (!this.elements.profileContainer) {
            this.elements.profileContainer = document.querySelector('#profile-container')
        }
        return this.elements.profileContainer
    }

    getTrainingContainer() {
        if (!this.elements.trainingContainer) {
            this.elements.trainingContainer = document.querySelector('#training-container')
        }
        return this.elements.trainingContainer
    }

    getWeightContainer() {
        if (!this.elements.weightContainer) {
            this.elements.weightContainer = document.querySelector('#weight-container')
        }
        return this.elements.weightContainer
    }

    destroy() {
        this.elements = {}
    }
}
