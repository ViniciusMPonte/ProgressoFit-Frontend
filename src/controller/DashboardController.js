import BaseController from "./BaseController.js";
import {DashboardView} from "../view/DashboardView.js";

export class DashboardController extends BaseController {
    constructor(redirectManager, apiService) {
        super(redirectManager, apiService)
        this.dom = new DOMElementManager();
    }

    loadPage() {
        this.setupDynamicContent();
        //this.setupEventListeners();
    }

    setupDynamicContent(){
        this.handleWeeklyChart()
    }

    async handleWeeklyChart(){
        try {
            const request = await this.apiService.get('/api/statistics/weekly/last-months/2');
            const tag = this.dom.getTrainingPerWeeklyChartTag();

            DashboardView.renderTrainingPerWeeklyChart(tag, request.data);

        } catch (error) {
            console.error('Erro ao carregar dados semanais:', error);
        }
    }
}

class DOMElementManager {
    constructor() {
        this.elements = {};
    }

    getTrainingPerWeeklyChartTag() {
        if (!this.elements.TrainingPerWeeklyChart) {
            this.elements.TrainingPerWeeklyChart = document.querySelector('#training-per-weekly-chart');
        }
        return this.elements.TrainingPerWeeklyChart;
    }

    destroy() {
        this.elements = {};
    }
}