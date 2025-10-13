export class WeightPerWeeklyInterfaceComponent {
    constructor(targetTag) {
        this.targetTag = targetTag
        this.dom = new DOMElementManager()
    }

    setupCalendarButtonListener() {
        const weightCalendarButton = this.dom.getWeightCalendarBtn()
        const weightDataField = this.dom.getWeightDateField()

        weightCalendarButton.addEventListener('click', () => {
            if (weightDataField.showPicker) {
                weightDataField.showPicker()
            } else {
                weightDataField.click()
            }
        })
    }

    showLoading(show) {
        const weightFormSubmitBtn = this.dom.getWeightFormSubmitBtn()

        if (weightFormSubmitBtn) {
            weightFormSubmitBtn.disabled = show

            if (show) {
                weightFormSubmitBtn.classList.add('disabled')
                weightFormSubmitBtn.innerHTML = `
                    <span class="spinner-border spinner-border-sm me-2"></span>
                    Enviando...
                `
            } else {
                weightFormSubmitBtn.classList.remove('disabled')
            }
        }
    }

    get() {
        return /*html*/ `
            <div class="card">
                <form id="weight-per-weekly-form">
                    <div class="card-header">
                        <i class="fa-solid fa-weight-scale fa-2xl"></i>
                        <div>
                            <label class="g-bold pointer-events-none" for="weight-date-field">Data</label>
                            <input class="custom-date pointer-events-none" type="date" id="weight-date-field" name="weight-date" required />
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="g-bold" for="weight-input">Peso (kg)</label>
                        <input type="number" step="0.1" id="weight-input" name="weight" placeholder="Digite seu peso" required />
                        <br>
                        <button type="button" class="btn btn-primary" id="weight-form-submit-btn">
                            Salvar Peso
                        </button>
                        <button type="button" class="btn btn-light" id="weight-calendar-btn">
                            <span><i class="fa-solid fa-calendar-week fa-lg"></i>&nbsp Mudar data</span>
                        </button>
                    </div>
                </form>
            </div>
        `
    }

    autoRender() {
        this.targetTag.innerHTML = this.get()
        this.setupCalendarButtonListener()
    }
}

class DOMElementManager {
    constructor() {
        this.elements = {}
    }

    getWeightPerWeeklyForm() {
        if (!this.elements.weightPerWeeklyForm) {
            this.elements.weightPerWeeklyForm = document.querySelector('#weight-per-weekly-form')
        }
        return this.elements.weightPerWeeklyForm
    }

    getWeightDateField() {
        if (!this.elements.weightDateField) {
            this.elements.weightDateField = document.querySelector('#weight-date-field')
        }
        return this.elements.weightDateField
    }

    getWeightInput() {
        if (!this.elements.weightInput) {
            this.elements.weightInput = document.querySelector('#weight-input')
        }
        return this.elements.weightInput
    }

    getWeightCalendarBtn() {
        if (!this.elements.weightCalendarBtn) {
            this.elements.weightCalendarBtn = document.querySelector('#weight-calendar-btn')
        }
        return this.elements.weightCalendarBtn
    }

    getWeightFormSubmitBtn() {
        if (!this.elements.weightFormSubmitBtn) {
            this.elements.weightFormSubmitBtn = document.querySelector('#weight-form-submit-btn')
        }
        return this.elements.weightFormSubmitBtn
    }

    destroy() {
        this.elements = {}
    }
}
