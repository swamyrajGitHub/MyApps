import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'; 

@Injectable()
export class URLHandlerService {
        
    readonly HTTP_URL_ADMIN : string;
    readonly HTTP_URL_REPORT : string;
    readonly HTTP_URL_ACTION : string;
    readonly HTTP_URL_TOOLS : string; 
    readonly HTTP_URL_APIFULL : string; 
    readonly HTTP_URL_NOTIFICATION : string; 

    constructor() {
       this.HTTP_URL_APIFULL = environment.HTTP_URL_APIFULL;
       this.HTTP_URL_ADMIN = environment.HTTP_URL_ADMIN;
       this.HTTP_URL_REPORT = environment.HTTP_URL_REPORT;
       this.HTTP_URL_ACTION = environment.HTTP_URL_ACTION;
       this.HTTP_URL_TOOLS = environment.HTTP_URL_TOOLS;
       this.HTTP_URL_NOTIFICATION = environment.HTTP_URL_NOTIFICATION;
    }
}