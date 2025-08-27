export class Routes {

    routes = {
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
}