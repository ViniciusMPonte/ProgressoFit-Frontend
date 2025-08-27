import {LoginController} from "../controller/LoginController.js";
import {DashboardController} from "../controller/DashboardController.js";
import {HomeController} from "../controller/HomeController.js";
import {RegisterController} from "../controller/RegisterController.js";


export class Router {

    constructor() {
        this.controllers = {
            "home": new HomeController(),
            "register": new RegisterController(),
            "login": new LoginController(),
            "dashboard": new DashboardController(),
        };

        if (this.controllers.login.requiresAuthByPath(window.location.pathname)) {
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