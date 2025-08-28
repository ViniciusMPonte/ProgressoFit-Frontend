import {Routes} from "./Routes.js";

export class RedirectManager extends Routes {

    constructor() {
        super()
    }

    getRoutes(){
        return this.routes
    }

    to(routeName, params = null) {
        const route = this.routes[routeName];
        if (!route) {
            console.error(`Rota '${routeName}' não encontrada`);
            return;
        }

        let finalUrl = route.url.replace(/index\.html$/, '');

        if (params) {
            const queryString = new URLSearchParams(params).toString();
            finalUrl += `?${queryString}`;
        }

        window.location.href = finalUrl;
    }

    back() {
        window.history.back();
    }

    forward() {
        window.history.forward();
    }

    reload() {
        window.location.reload();
    }
}