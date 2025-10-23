import BaseController from './BaseController.js'
import { PerfilView } from '../view/PerfilView.js'
import { ProgressStorageService } from '../service/ProgressStorageService.js'

export class PerfilController extends BaseController {
    constructor(redirectManager, apiService) {
        super(redirectManager, apiService)
        this.dom = new DOMElementManager()
        this.view = new PerfilView(this.dom)
        this.progressStorageService = new ProgressStorageService()
    }

    loadPage() {
        this.setupDynamicContent()
        this.setupEventListeners()
    }

    setupEventListeners() {
        // Event listeners são gerenciados pelos componentes
    }

    setupDynamicContent() {
        this.handleSidebarNavigation()
        this.handleEditProfileComponent()
        this.handleTrainingComponent()
        this.handleWeightComponent()
    }

    handleSidebarNavigation() {
        this.view.renderSidebarNavigation()
    }

    handleEditProfileComponent() {
        this.view.renderEditProfileComponent((message, type) => {
            this.view.alert(message, type)
        })
    }

    handleTrainingComponent() {
        this.view.renderTrainingSection((message, type) => {
            this.progressStorageService.setKey('training-progress')
            this.progressStorageService.resetProgress()
            this.view.alert(message, type)
        })
    }

    handleWeightComponent() {
        this.view.renderWeightSection((message, type) => {
            this.progressStorageService.setKey('weight-progress')
            this.progressStorageService.resetProgress()
            this.view.alert(message, type)
        })
    }
}

class DOMElementManager {
    constructor() {
        this.elements = {}
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
