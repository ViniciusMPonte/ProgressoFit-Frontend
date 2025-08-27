export default class BaseController {
    constructor(redirectManager, apiService) {
        this.apiService = apiService;
        this.redirect = redirectManager;
    }

    requiresAuthByPath(pathname) {
        return this.redirect.requiresAuthByPath(pathname);
    }

    loadPage() {
        console.warn('loadDefaultPage() não foi implementado');
    }

    setupDynamicContent(){
        console.warn('setupDynamicContent() não foi implementado');
    }

    setupEventListeners(){
        console.warn('setupEventListeners() não foi implementado');
    }
}