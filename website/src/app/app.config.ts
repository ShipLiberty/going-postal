import { OpaqueToken } from "@angular/core";
import { STRIPE_PUBLISHABLE_KEY } from "./app.environment";

export let APP_CONFIG = new OpaqueToken("app.config");

export interface IAppConfig {
    apiEndpoint: string,
    stripeKey: string
};

export const AppConfig: IAppConfig = {    
//    apiEndpoint: "https://frozen-refuge-69652.herokuapp.com/"    
    apiEndpoint: "http://localhost:4000/",
    stripeKey: STRIPE_PUBLISHABLE_KEY
};

/*
//this is what we use for a constants file. its annoying as hell. but yeah. thats angular2 for you.
//depending on where we go with it we can make a constants object so that we only have to inject one object rather than many going forward.
http://stackoverflow.com/questions/34986922/define-global-constants-in-angular-2/40287063#40287063
*/
