export class Routes {

    routes = {
        home: {
            url: '/ProgressoFit-Frontend/index.html',
            requiresAuth: false
        },
        cadastro: {
            url: '/ProgressoFit-Frontend/cadastro/index.html',
            requiresAuth: false
        },
        login: {
            url: '/ProgressoFit-Frontend/login/index.html',
            requiresAuth: false
        },
        perfil: {
            url: '/ProgressoFit-Frontend/perfil/index.html',
            requiresAuth: true
        },
        dashboard: {
            url: '/ProgressoFit-Frontend/dashboard/index.html',
            requiresAuth: true
        },
        logout: {
            url: '/ProgressoFit-Frontend/logout/index.html',
            requiresAuth: true
        }
    }

    requiresAuthByPath(pathname) {

        const routeEntry = Object.entries(this.routes).find(([routeName, route]) => {
            return route.url === this.normalizePathname(pathname);
        });

        if (routeEntry) {
            const [routeName, route] = routeEntry;
            return route.requiresAuth;
        }

        return true;
    }

    normalizePathname(pathname) {

        if (!pathname || typeof pathname !== 'string') {
            return this.routes.home.url;
        }

        pathname = pathname.trim()

        if (pathname.endsWith('/')) {
            pathname += 'index.html';
        } else if (!pathname.includes('.') && pathname !== '/') {
            pathname += '/index.html';
        }

        return pathname
    }
}