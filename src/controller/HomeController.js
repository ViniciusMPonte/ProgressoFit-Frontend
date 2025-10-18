import BaseController from "./BaseController.js"
import { HomeView } from "../view/HomeView.js"

export class HomeController extends BaseController {
    constructor(redirectManager, apiService) {
        super(redirectManager, apiService)
        this.view = new HomeView(this.dom)
    }
}