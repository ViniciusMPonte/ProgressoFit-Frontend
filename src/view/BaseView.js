import { AlertComponent } from "./component/AlertComponent.js";
import { NavbarComponent } from "./component/NavbarComponent.js";
import { Routes } from "../router/Routes.js";

export default class BaseView {

    constructor() {
        this.ensureFontAwesome();
        NavbarComponent.init({
            links: new Routes().routes
        })
    }
    
    ensureFontAwesome() {
        const linkId = "fontawesome-cdn";
        if (document.getElementById(linkId)) return

        const link = document.createElement("link");
        link.id = linkId;
        link.rel = "stylesheet";
        link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
        document.head.appendChild(link);
    }

    alert(message, type, container, timeout) {
        AlertComponent.show(message, type, container, timeout)
    }
}