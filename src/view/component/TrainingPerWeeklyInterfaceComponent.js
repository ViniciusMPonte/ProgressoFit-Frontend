

export class TrainingPerWeeklyInterfaceComponent {

    constructor() {

    }

    listener() {
        const trainingCalendarButton = document.getElementById("training-calendar-button");
        const trainingDataField = document.getElementById("training-data-field");

        trainingCalendarButton.addEventListener("click", () => {
            if (trainingDataField.showPicker) {
                trainingDataField.showPicker();
            } else {
                trainingDataField.click();
            }
        });
    }

    render() {
        return /*html*/`
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
                        <button type="button" class="btn btn-danger" id="toggleButton">
                            <span id="toggleLabel"><i class="fa-solid fa-square-xmark fa-xl"></i>&nbsp Não</span>
                        </button>
                        <button type="button" class="btn btn-light" id="training-calendar-button">
                            <span><i class="fa-solid fa-calendar-week fa-lg"></i>&nbsp Mudar data</span>
                        </button>
                    </div>
                </form>
            </div>
        `
    }
}

class DOMElementManager {
    constructor() {
        this.elements = {};
    }

    getTrainingPerWeeklyForm() {
        if (!this.elements.trainingPerWeeklyForm) {
            this.elements.trainingPerWeeklyForm = document.querySelector('#training-per-weekly-form');
        }
        return this.elements.trainingPerWeeklyForm;
    }

    getTrainingDataField() {
        if (!this.elements.trainingDataField) {
            this.elements.trainingDataField = document.querySelector('#training-data-field');
        }
        return this.elements.trainingDataField;
    }

    getToggleButton() {
        if (!this.elements.toggleButton) {
            this.elements.toggleButton = document.querySelector('#toggleButton');
        }
        return this.elements.toggleButton;
    }

    getToggleLabel() {
        if (!this.elements.toggleLabel) {
            this.elements.toggleLabel = document.querySelector('#toggleLabel');
        }
        return this.elements.toggleLabel;
    }

    destroy() {
        this.elements = {};
    }
}