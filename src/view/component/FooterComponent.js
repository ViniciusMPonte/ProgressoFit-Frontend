export class FooterComponent {
    static config = {}

    static get() {
        return /*html*/`
            <footer class="mt-3 mb-3 text-muted" id="footer">
                ${FooterComponent.config.content || ''}
            </footer>
        `
    }

    static autoInject() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => FooterComponent.injectFooter())
        } else {
            FooterComponent.injectFooter()
        }
    }

    static injectFooter() {
        if (document.getElementById('footer')) return

        const body = document.body

        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = FooterComponent.get()

        const footer = tempDiv.firstElementChild
        body.appendChild(footer)
    }

    static init(config = {}) {
        if (document.querySelector('#footer')) return

        FooterComponent.config = {
            content: '',
            ...config,
        }

        FooterComponent.autoInject()
    }
}
