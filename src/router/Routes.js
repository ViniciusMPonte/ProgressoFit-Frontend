import EnvironmentConfig from '../EnvironmentConfig.js'

export class Routes {

    routes = {
        home: {
            url: `${EnvironmentConfig.BASE_URL}/index.html`,
            requiresAuth: false
        },
        cadastro: {
            url: `${EnvironmentConfig.BASE_URL}/cadastro/index.html`,
            requiresAuth: false
        },
        login: {
            url: `${EnvironmentConfig.BASE_URL}/login/index.html`,
            requiresAuth: false
        },
        perfil: {
            url: `${EnvironmentConfig.BASE_URL}/perfil/index.html`,
            requiresAuth: true
        },
        dashboard: {
            url: `${EnvironmentConfig.BASE_URL}/dashboard/index.html`,
            requiresAuth: true
        },
        logout: {
            url: `${EnvironmentConfig.BASE_URL}/logout/index.html`,
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