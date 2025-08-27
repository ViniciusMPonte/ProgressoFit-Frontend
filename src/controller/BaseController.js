import {ApiService} from "../service/ApiService.js";

export default class BaseController {
    constructor() {
        this.apiService = new ApiService();
        this.redirect = new RedirectManager();
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

class RedirectManager {

    constructor() {
        this.routes = {
            home: {
                url: '/',
                requiresAuth: false
            },
            login: {
                url: '/login.html',
                requiresAuth: false
            },
            dashboard: {
                url: '/dashboard.html',
                requiresAuth: true
            }
        }
    }

    to(routeName, params = null) {
        const route = this.routes[routeName];
        if (!route) {
            console.error(`Rota '${routeName}' não encontrada`);
            return;
        }

        let finalUrl = route.url;

        if (params) {
            const queryString = new URLSearchParams(params).toString();
            finalUrl += `?${queryString}`;
        }

        window.location.href = finalUrl;
    }

    requiresAuthByPath(pathname) {

        if (pathname === '/index.html') pathname = '/'

        const routeEntry = Object.entries(this.routes).find(([routeName, route]) => {
            return route.url === pathname;
        });

        if (routeEntry) {
            const [routeName, route] = routeEntry;
            return route.requiresAuth;
        }

        return true;
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