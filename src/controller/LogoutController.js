import BaseController from "./BaseController.js";

export class LogoutController extends BaseController {
    constructor(redirectManager, apiService) {
        super(redirectManager, apiService);
    }

    loadPage() {
        localStorage.removeItem('authToken');
        this.redirect.to('home')
    }
}