export class TrainingPerWeeklyInterfaceComponent {
    constructor(targetTag) {
        this.targetTag = targetTag
        this.dom = new DOMElementManager()
        this.toggleState = false
    }

    getToggleState() {
        return this.toggleState
    }

    setToggleState(boolean) {
        this.toggleState = boolean
    }

    setupCalendarButtonListener() {
        const trainingCalendarButton = this.dom.getTrainingCalendarBtn()
        const trainingDataField = this.dom.getTrainingDataField()

        trainingCalendarButton.addEventListener('click', () => {
            if (trainingDataField.showPicker) {
                trainingDataField.showPicker()
            } else {
                trainingDataField.click()
            }
        })
    }

    updateToogleButton() {
        const trainingFormSubmitBtn = this.dom.getTrainingFormSubmitBtn()

        if (this.toggleState) {
            trainingFormSubmitBtn.classList.remove('btn-danger')
            trainingFormSubmitBtn.classList.add('btn-primary')
            trainingFormSubmitBtn.innerHTML = '<i class="fa-solid fa-square-check fa-xl"></i>&nbsp Sim'
        } else {
            trainingFormSubmitBtn.classList.remove('btn-primary')
            trainingFormSubmitBtn.classList.add('btn-danger')
            trainingFormSubmitBtn.innerHTML = '<i class="fa-solid fa-square-xmark fa-xl"></i>&nbsp Não'
        }
    }

    showLoading(show) {
        const trainingFormSubmitBtn = this.dom.getTrainingFormSubmitBtn()

        if (trainingFormSubmitBtn) {
            trainingFormSubmitBtn.disabled = show

            if (show) {
                trainingFormSubmitBtn.classList.add('disabled')
                trainingFormSubmitBtn.innerHTML = `
                    <span class="spinner-border spinner-border-sm me-2"></span>
                    Enviando...
                `
            } else {
                trainingFormSubmitBtn.classList.remove('disabled')
                this.updateToogleButton()
            }
        }
    }

    get() {
        return /*html*/ `
            <div class="card">
                <form id="training-per-weekly-form">
                    <div class="card-header">
                        <i class="fa-solid fa-calendar-week fa-2xl"></i>
                        <div>
                            <label class="g-bold pointer-events-none" for="training-data-field">Data</label>
                            <input class="custom-date pointer-events-none" type="date" id="training-data-field" name="data" required />
                        </div>
                    </div>
                    <div class="form-group">
                        <p>Você definiu uma meta para essa dia, você realizou seu treino?</p>
                        <button type="button" class="btn btn-danger" id="training-form-submit-btn">
                            <i class="fa-solid fa-square-xmark fa-xl"></i>&nbsp Não
                        </button>
                        <button type="button" class="btn btn-light" id="training-calendar-btn">
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

    getTrainingPerWeeklyForm() {
        if (!this.elements.trainingPerWeeklyForm) {
            this.elements.trainingPerWeeklyForm = document.querySelector('#training-per-weekly-form')
        }
        return this.elements.trainingPerWeeklyForm
    }

    getTrainingDataField() {
        if (!this.elements.trainingDataField) {
            this.elements.trainingDataField = document.querySelector('#training-data-field')
        }
        return this.elements.trainingDataField
    }

    getTrainingCalendarBtn() {
        if (!this.elements.trainingCalendarBtn) {
            this.elements.trainingCalendarBtn = document.querySelector('#training-calendar-btn')
        }
        return this.elements.trainingCalendarBtn
    }

    getTrainingFormSubmitBtn() {
        if (!this.elements.trainingFormSubmitBtn) {
            this.elements.trainingFormSubmitBtn = document.querySelector('#training-form-submit-btn')
        }
        return this.elements.trainingFormSubmitBtn
    }

    destroy() {
        this.elements = {}
    }
}
