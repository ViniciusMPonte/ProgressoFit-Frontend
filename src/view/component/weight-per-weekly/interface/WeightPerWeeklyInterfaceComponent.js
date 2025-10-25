import { WeightPerWeeklyInterfaceService } from './service/WeightPerWeeklyInterfaceService.js'
import DaseView from '../../../BaseView.js'

export class WeightPerWeeklyInterfaceComponent {
    constructor(targetTag) {
        this.targetTag = targetTag

        this.dom = new DOMElementManager()
        this.componentService = new WeightPerWeeklyInterfaceService(this.dom)
    }

    autoRender() {
        this.targetTag.innerHTML = this.get()
        this.setupCalendarButtonListener()
        this.setupWeightFormSubmitBtnListener()
        this.setupDynamicInputListener()
    }

    async getWeightInputData() {
        const date = this.dom.getWeightDateField()?.value
        this.dom.getWeightInput().value = await this.componentService.getWeightData(date)
    }

    showLoading(show) {
        const weightFormSubmitBtn = this.dom.getWeightFormSubmitBtn()
        if (!weightFormSubmitBtn) return

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
                        <div class="form-floating">
                            <input type="number" step="0.1" id="weight-input" class="form-control" name="weight" placeholder="Peso (kg)" required />
                            <label for="weight-input">Peso (kg)</label>
                        </div>
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

    //listeners
    setupCalendarButtonListener() {
        const weightCalendarButton = this.dom.getWeightCalendarBtn()
        const weightDataField = this.dom.getWeightDateField()

        weightDataField.value = new DaseView().getTodayString()

        weightCalendarButton.addEventListener('click', () => {
            if (weightDataField.showPicker) {
                weightDataField.showPicker()
            } else {
                weightDataField.click()
            }
        })
    }

    setupWeightFormSubmitBtnListener() {
        const weightFormSubmitBtn = this.dom.getWeightFormSubmitBtn()
        if (!weightFormSubmitBtn) return

        weightFormSubmitBtn.addEventListener('click', async () => {
            await this.componentService.weightFormSubmit()
        })
    }

    setupDynamicInputListener() {
        const weightDateField = this.dom.getWeightDateField()
        if (!weightDateField) return
        this.getWeightInputData()
        weightDateField.addEventListener('change', () => this.getWeightInputData())
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
