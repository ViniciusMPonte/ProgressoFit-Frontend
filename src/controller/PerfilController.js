import BaseController from './BaseController.js'
import { PerfilView } from '../view/PerfilView.js'

export class PerfilController extends BaseController {
    constructor(redirectManager, apiService) {
        super(redirectManager, apiService)
        this.dom = new DOMElementManager()
        this.view = new PerfilView(this.dom)
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
        this.handleFooter()
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
        this.view.renderTrainingPlaceholder()
    }

    handleWeightComponent() {
        this.view.renderWeightPlaceholder()
    }

    handleFooter() {
        this.view.renderFooter()
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