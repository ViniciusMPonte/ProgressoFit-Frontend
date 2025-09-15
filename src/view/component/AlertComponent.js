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
            <div class="alert alert-${type} alert-dismissible fade show alert-fixed" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
    }

    static show(message, type = 'primary', container = null, timeout = 5000) {
        const targetElement = this._getTargetElement(container);
        
        if (targetElement) {
            this._insertAlert(targetElement, message, type);
            this._scheduleRemoval(targetElement, container, timeout);
        }
    }

    static _getTargetElement(container) {
        return container === null 
            ? this._getOrCreateFixedContainer() 
            : this._resolveCustomContainer(container);
    }

    static _getOrCreateFixedContainer() {
        let container = document.querySelector('.alert-container');
        
        if (!container) {
            container = document.createElement('div');
            container.className = 'alert-container';
            document.body.appendChild(container);
        }
        
        return container;
    }

    static _resolveCustomContainer(container) {
        return typeof container === 'string' 
            ? document.querySelector(container) 
            : container;
    }

    static _insertAlert(targetElement, message, type) {
        const alertHtml = this.create(message, type);
        targetElement.insertAdjacentHTML('afterbegin', alertHtml);
    }

    static _scheduleRemoval(targetElement, container, timeout) {
        if (timeout <= 0) return;

        const alertElement = targetElement.querySelector('.alert-fixed');
        
        setTimeout(() => {
            if (alertElement?.parentNode) {
                this._removeAlert(alertElement, container);
            }
        }, timeout);
    }

    static _removeAlert(alertElement, container) {
        if (container === null) {
            this._removeWithAnimation(alertElement);
        } else {
            alertElement.remove();
        }
    }

    static _removeWithAnimation(alertElement) {
        alertElement.classList.add('removing');
        setTimeout(() => {
            if (alertElement.parentNode) {
                alertElement.remove();
            }
        }, 300);
    }

    static getValidTypes() {
        return [...this.validTypes];
    }
}