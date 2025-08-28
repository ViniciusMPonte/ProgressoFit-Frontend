export class Routes {

    routes = {
        home: {
            url: '/index.html',
            requiresAuth: false
        },
        register: {
            url: '/cadastro/index.html',
            requiresAuth: false
        },
        login: {
            url: '/login/index.html',
            requiresAuth: false
        },
        dashboard: {
            url: '/dashboard/index.html',
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

        pathname = pathname.trim().toLowerCase()

        if (pathname.endsWith('/')) {
            pathname += 'index.html';
        } else if (!pathname.includes('.') && pathname !== '/') {
            pathname += '/index.html';
        }

        return pathname
    }
}