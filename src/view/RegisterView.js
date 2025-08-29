import {CopyrightComponent} from "./component/CopyrightComponent.js";

export class RegisterView {

    static renderFooter (){
        return CopyrightComponent.get();
    }
}