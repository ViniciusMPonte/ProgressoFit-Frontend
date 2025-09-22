export class NavbarComponent {
    static config = {};

    static get() {
        const linksHTML = NavbarComponent.generateLinks();

        return `
            <nav class="navbar bg-primary fixed-top">
                <div class="container-fluid">
                    <a class="navbar-brand text-white" href="#">${NavbarComponent.config.brand}</a>
                    <button class="navbar-toggler btn-light" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
                        <i class="fa-solid fa-bars fa-lg"></i>
                    </button>
                    <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                    <div class="offcanvas-header">
                        <h5 class="offcanvas-title" id="offcanvasNavbarLabel">${NavbarComponent.config.brand}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div class="offcanvas-body">
                        <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
                            ${linksHTML}
                        </ul>
                    </div>
                    </div>
                </div>
            </nav>
        `;
    }

    static generateLinks() {
        if (!NavbarComponent.config.links) {
            return '';
        }

        const isAuthenticated = NavbarComponent.config.isAuthenticated;
        const currentPath = window.location.pathname;

        return Object.entries(NavbarComponent.config.links)
            .filter(([name, link]) => {
                return link.requiresAuth == isAuthenticated;
            })
            .map(([name, link]) => {
                const isActive = this.normalizedRoutePath(currentPath) === this.normalizedRoutePath(link.url);
                const activeClass = isActive ? ' active' : '';
                const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

                return `
                    <li class="nav-item">
                        <a class="nav-link${activeClass}" href="${this.normalizedRoutePath(link.url)}">${capitalizedName}</a>
                    </li>
                `;
            })
            .join('');
    }

    static autoInject() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => NavbarComponent.injectNavbar());
        } else {
            NavbarComponent.injectNavbar();
        }
    }

    static injectNavbar() {
        if (document.getElementById('offcanvasNavbar')) return
        
        const body = document.body;
        body.classList.add('padding-navbar');

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = NavbarComponent.get();

        const navbar = tempDiv.firstElementChild;
        body.insertBefore(navbar, body.firstChild);
    }

    static checkAuthRequired(routes) {
        const currentPath = window.location.pathname;
        const normalizedCurrentPath = this.normalizedRoutePath(currentPath);

        for (const routeName in routes) {
            const route = routes[routeName];
            const normalizedRoutePath = this.normalizedRoutePath(route.url);

            if (normalizedRoutePath === normalizedCurrentPath) {
                return route.requiresAuth;
            }
        }

        return false;
    }

    static normalizedRoutePath(route) {

        route = route.replace('index.html', '');

        return route.endsWith('/') && route !== '/'
            ? route.slice(0, -1)
            : route;
    }

    static init(config = {}) {
        if (document.querySelector('nav')) return

        NavbarComponent.config = {
            brand: 'ProgressoFit',
            isAuthenticated: this.checkAuthRequired(config.links),
            links: {},
            ...config
        };

        NavbarComponent.autoInject();
    }
}