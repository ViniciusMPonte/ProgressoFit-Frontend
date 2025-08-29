import {CopyrightComponent} from "./component/CopyrightComponent.js";

export class LoginView {
 
    static renderFooter (){
        return CopyrightComponent.get();
    }
}