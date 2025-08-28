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

        let routes = this.redirectManager.routes
        this.controllers = {
            [routes.home.url]: new HomeController(this.redirectManager, this.apiService),
            [routes.register.url]: new RegisterController(this.redirectManager, this.apiService),
            [routes.login.url]: new LoginController(this.redirectManager, this.apiService),
            [routes.dashboard.url]: new DashboardController(this.redirectManager, this.apiService),
        };

        if (this.redirectManager.requiresAuthByPath(window.location.pathname)) {
            this.apiService.checkAuth().then((result) => {
                if (!result.success) this.redirectManager.to('login')
            })
        }
    }

    loadPageByPathname(pathname) {
        pathname = this.redirectManager.normalizePathname(pathname)
        this.controllers[pathname].loadPage()
    }
}