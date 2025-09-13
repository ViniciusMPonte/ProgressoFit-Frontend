export class AlertComponent {
    static validTypes = [
        'primary', 'secondary', 'success', 'danger',
        'warning', 'info', 'light', 'dark'
    ];

    static create(message, type = 'primary') {
        if (!this.validTypes.includes(type)) {
            type = 'primary';
        }

        return `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
    }

    static show(message, type = 'primary', container = 'body', timeout = 5000) {
        const alertHtml = this.create(message, type);

        let targetElement;
        if (typeof container === 'string') {
            targetElement = document.querySelector(container);
        } else {
            targetElement = container;
        }

        if (targetElement) {
            targetElement.insertAdjacentHTML('afterbegin', alertHtml);

            if (timeout > 0) {
                const alertElement = targetElement.querySelector('.alert');
                setTimeout(() => {
                    if (alertElement && alertElement.parentNode) {
                        alertElement.remove();
                    }
                }, timeout);
            }
        }
    }

    static getValidTypes() {
        return [...this.validTypes];
    }
}