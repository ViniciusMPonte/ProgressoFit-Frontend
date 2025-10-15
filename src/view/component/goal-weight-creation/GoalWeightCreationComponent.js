import { GoalWeightCreationService } from './service/GoalWeightCreationService.js'

export class GoalWeightCreationComponent {
    constructor(targetTag) {
        this.targetTag = targetTag
        this.dom = new DOMElementManager()
        this.componentService = new GoalWeightCreationService(this.dom)
    }

    autoRender() {
        this.targetTag.innerHTML = this.get()
        this.setupCalendarButtonListeners()
        this.setupFormSubmitListener()
        this.setupDefaultValues()
    }

    showLoading(show) {
        const submitBtn = this.dom.getGoalFormSubmitBtn()
        if (!submitBtn) return

        submitBtn.disabled = show

        if (show) {
            submitBtn.classList.add('disabled')
            submitBtn.innerHTML = `
                <span class="spinner-border spinner-border-sm me-2"></span>
                Criando...
            `
        } else {
            submitBtn.innerHTML = 'Salvar Objetivo'
            submitBtn.classList.remove('disabled')
        }
    }

    get() {
        return /*html*/ `
            <style>
                #goal-weight-creation-form .card-header {
                    margin: 0; 
                    align-items: center; 
                    padding: 20px; 
                    font-size: x-large;
                }
                #goal-weight-creation-form .custom-border {
                    border: var(--bs-border-width) solid var(--bs-border-color);
                    border-radius: 25px;
                }
                #goal-weight-creation-form .custom-calendar-btn {
                    border: none;
                    background-color: transparent;
                    padding-right: 15px;
                }
            </style>
            <form id="goal-weight-creation-form">
                <div class="card-header">
                    <span class="g-bold"><i class="fa-solid fa-weight-scale fa-lg"></i>&nbsp;&nbsp;Peso</span>
                </div>
                <div class="card-body">
                    <p class="text-muted">Defina sua meta de peso</p>
                    <div class="form-group mb-3">
                        <label class="g-bold" for="goal-weight-target-value">Meta (peso alvo em kg)</label>
                        <input 
                            type="number" 
                            step="0.1" 
                            id="goal-weight-target-value" 
                            name="targetValue" 
                            class="form-control"
                            placeholder="Ex: 75.0" 
                            required 
                        />
                        <small class="text-muted">Defina o peso que deseja alcançar</small>
                    </div>
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label class="g-bold" for="goal-weight-start-date">Data de Início</label>
                            <div class="input-group custom-border">
                                <input 
                                    type="date" 
                                    id="goal-weight-start-date" 
                                    name="startDate" 
                                    class="form-control pointer-events-none custom-date"
                                    required 
                                />
                                <button 
                                    type="button" 
                                    class="custom-calendar-btn" 
                                    id="goal-weight-start-calendar-btn"
                                >
                                    <i class="fa-solid fa-calendar"></i>
                                </button>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <label class="g-bold" for="goal-weight-end-date">Data de Término</label>
                            <div class="input-group custom-border">
                                <input 
                                    type="date" 
                                    id="goal-weight-end-date" 
                                    name="endDate" 
                                    class="form-control pointer-events-none custom-date"
                                    required 
                                />
                                <button 
                                    type="button" 
                                    class="custom-calendar-btn" 
                                    id="goal-weight-end-calendar-btn"
                                >
                                    <i class="fa-solid fa-calendar"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex gap-2">
                        <button type="button" class="btn btn-primary" id="goal-weight-form-submit-btn">
                            Salvar Objetivo
                        </button>
                        <button type="button" class="btn btn-light" id="goal-weight-form-reset-btn">
                            Limpar
                        </button>
                    </div>
                </div>
            </form>
        `
    }

    setupCalendarButtonListeners() {
        const startCalendarBtn = this.dom.getGoalStartCalendarBtn()
        const startDateField = this.dom.getGoalStartDate()
        const endCalendarBtn = this.dom.getGoalEndCalendarBtn()
        const endDateField = this.dom.getGoalEndDate()

        if (startCalendarBtn && startDateField) {
            startCalendarBtn.addEventListener('click', () => {
                if (startDateField.showPicker) {
                    startDateField.showPicker()
                } else {
                    startDateField.click()
                }
            })
        }

        if (endCalendarBtn && endDateField) {
            endCalendarBtn.addEventListener('click', () => {
                if (endDateField.showPicker) {
                    endDateField.showPicker()
                } else {
                    endDateField.click()
                }
            })
        }
    }

    setupFormSubmitListener() {
        const submitBtn = this.dom.getGoalFormSubmitBtn()
        const resetBtn = this.dom.getGoalFormResetBtn()

        if (submitBtn) {
            submitBtn.addEventListener('click', async () => {
                const isSuccess = await this.componentService.handleGoalFormSubmit()
                if (isSuccess) await this.setupDefaultValues()
            })
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetForm()
            })
        }
    }

    async setupDefaultValues() {
        const targetValueInput = this.dom.getGoalTargetValue()
        const startDateField = this.dom.getGoalStartDate()
        const endDateField = this.dom.getGoalEndDate()

        const data = await this.componentService.getCurrentGoal()

        if (targetValueInput) targetValueInput.value = data.targetValue

        if (startDateField) {
            startDateField.value = data.startDate
        }

        if (endDateField) {
            endDateField.value = data.endDate
        }
    }

    resetForm() {
        const form = this.dom.getGoalWeightCreationForm()
        if (form) {
            form.reset()
            this.setupDefaultValues()
        }
    }
}

class DOMElementManager {
    constructor() {
        this.elements = {}
    }

    getGoalWeightCreationForm() {
        if (!this.elements.goalWeightCreationForm) {
            this.elements.goalWeightCreationForm = document.querySelector('#goal-weight-creation-form')
        }
        return this.elements.goalWeightCreationForm
    }

    getGoalTargetValue() {
        if (!this.elements.goalTargetValue) {
            this.elements.goalTargetValue = document.querySelector('#goal-weight-target-value')
        }
        return this.elements.goalTargetValue
    }

    getGoalStartDate() {
        if (!this.elements.goalStartDate) {
            this.elements.goalStartDate = document.querySelector('#goal-weight-start-date')
        }
        return this.elements.goalStartDate
    }

    getGoalEndDate() {
        if (!this.elements.goalEndDate) {
            this.elements.goalEndDate = document.querySelector('#goal-weight-end-date')
        }
        return this.elements.goalEndDate
    }

    getGoalStartCalendarBtn() {
        if (!this.elements.goalStartCalendarBtn) {
            this.elements.goalStartCalendarBtn = document.querySelector('#goal-weight-start-calendar-btn')
        }
        return this.elements.goalStartCalendarBtn
    }

    getGoalEndCalendarBtn() {
        if (!this.elements.goalEndCalendarBtn) {
            this.elements.goalEndCalendarBtn = document.querySelector('#goal-weight-end-calendar-btn')
        }
        return this.elements.goalEndCalendarBtn
    }

    getGoalFormSubmitBtn() {
        if (!this.elements.goalFormSubmitBtn) {
            this.elements.goalFormSubmitBtn = document.querySelector('#goal-weight-form-submit-btn')
        }
        return this.elements.goalFormSubmitBtn
    }

    getGoalFormResetBtn() {
        if (!this.elements.goalFormResetBtn) {
            this.elements.goalFormResetBtn = document.querySelector('#goal-weight-form-reset-btn')
        }
        return this.elements.goalFormResetBtn
    }

    destroy() {
        this.elements = {}
    }
}