import { AlertComponent } from "./component/AlertComponent.js";

export default class BaseView {

    alert(message, type, container, timeout) {
        AlertComponent.show(message, type, container, timeout)
    }
}