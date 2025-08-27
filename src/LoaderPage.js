import {LoginController} from "./controller/LoginController.js";
import {DashboardController} from "./controller/DashboardController.js";
import {HomeController} from "./controller/HomeController.js";
import {RegisterController} from "./controller/RegisterController.js";
import {RedirectManager} from "./router/RedirectManager.js";
import {ApiService} from "./service/ApiService.js";

export class LoaderPage {

    constructor() {
        this.redirectManager = new RedirectManager()
        this.apiService = new ApiService()

        this.controllers = {
            "home": new HomeController(this.redirectManager, this.apiService),
            "register": new RegisterController(this.redirectManager, this.apiService),
            "login": new LoginController(this.redirectManager, this.apiService),
            "dashboard": new DashboardController(this.redirectManager, this.apiService),
        };

        if (this.redirectManager.requiresAuthByPath(window.location.pathname)) {
            this.controllers.login.apiService.checkAuth().then((result) => {
                if (!result.success) this.controllers.login.redirect.to('login')
            })
        }
    }

    loadPageByPathname(pathname, params) {
        pathname = this.normalizeRoute(pathname)
        this.controllers[pathname].loadPage()
    }

    normalizeRoute(pathname) {
        if (!pathname || typeof pathname !== 'string') {
            return '';
        }

        const normalizedPathname = pathname
            .trim()
            .replace(/^\/+/, '')
            .replace(/\.html?$/i, '')
            .toLowerCase()

        return normalizedPathname === '' || normalizedPathname === 'index' ? 'home' : normalizedPathname
    }
}