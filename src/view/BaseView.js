import { AlertComponent } from "./component/AlertComponent.js";
import { NavbarComponent } from "./component/NavbarComponent.js";
import { Routes } from "../router/Routes.js";

export default class BaseView {

    constructor(){
        NavbarComponent.init({
            links: new Routes().routes
        })
    }

    alert(message, type, container, timeout) {
        AlertComponent.show(message, type, container, timeout)
    }
}