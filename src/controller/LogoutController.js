import BaseController from './BaseController.js'

export class LogoutController extends BaseController {
    constructor(redirectManager, apiService) {
        super(redirectManager, apiService)
    }

    loadPage() {
        localStorage.removeItem('ai_requests')
        localStorage.removeItem('authToken')
        localStorage.removeItem('last-update')
        localStorage.removeItem('training-progress')
        localStorage.removeItem('user')
        localStorage.removeItem('weight-progress')

        this.redirect.to('home')
    }
}