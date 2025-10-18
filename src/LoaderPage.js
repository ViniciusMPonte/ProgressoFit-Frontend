import { LoginController } from './controller/LoginController.js'
import { PerfilController } from './controller/PerfilController.js'
import { DashboardController } from './controller/DashboardController.js'
import { HomeController } from './controller/HomeController.js'
import { RegisterController } from './controller/RegisterController.js'
import { LogoutController } from './controller/LogoutController.js'
import { RedirectManager } from './router/RedirectManager.js'
import { ApiService } from './service/ApiService.js'

export class LoaderPage {
    constructor() {
        this.redirectManager = new RedirectManager()
        this.apiService = new ApiService()

        let routes = this.redirectManager.routes
        this.controllerClasses = {
            [routes.home.url]: HomeController,
            [routes.cadastro.url]: RegisterController,
            [routes.login.url]: LoginController,
            [routes.perfil.url]: PerfilController,
            [routes.dashboard.url]: DashboardController,
            [routes.logout.url]: LogoutController,
        }

        this.controllers = {}

        const needToken = true
        if (this.redirectManager.requiresAuthByPath(window.location.pathname)) {
            this.apiService.checkAuth(needToken).then((result) => {
                if (!result.success) this.redirectManager.to('login')
            })
        } else {
            this.apiService.checkAuth(needToken).then((result) => {
                if (result.success) this.redirectManager.to('dashboard')
            })
        }
    }

    getController(pathname) {
        if (this.controllers[pathname]) {
            return this.controllers[pathname]
        }

        const ControllerClass = this.controllerClasses[pathname]
        if (ControllerClass) {
            this.controllers[pathname] = new ControllerClass(this.redirectManager, this.apiService)
            return this.controllers[pathname]
        }

        return null
    }

    load(pathname = window.location.pathname) {
        pathname = this.redirectManager.normalizePathname(pathname)
        const controller = this.getController(pathname)

        if (controller) {
            controller.loadPage()
        } else {
            console.error(`Controller não encontrado para a rota: ${pathname}`)
        }
    }
}
