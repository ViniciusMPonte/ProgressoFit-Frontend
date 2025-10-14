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
        // Event listeners são gerenciados pelo componente
    }

    setupDynamicContent() {
        this.handleEditProfileComponent()
    }

    handleEditProfileComponent() {
        this.view.renderEditProfileComponent((message, type) => {
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

    destroy() {
        this.elements = {}
    }
}
