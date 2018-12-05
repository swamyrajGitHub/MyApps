import {
    Injectable
} from '@angular/core';
import {
    Observable
} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ServiceResponse } from '../model/SharedModel/ServiceResponse';
import { NotificationRule } from '../model/notificationModel/notificationRule';
import { URLHandlerService } from './urlhandler.service';
import { Subscription } from '../model/notificationModel/subscription';


@Injectable()
export class NotifierService {

    constructor(private http: HttpClient, private urlHandler: URLHandlerService) { }

    readonly SUBSCRIBE = "subscribe";
    readonly UNSUBSCRIBE = "unsubscribe";
    readonly PREFERENCE = "preference";
    readonly RULES = "rules";
    readonly SLASH = "/";


    //Subscribes and unsubscriber user
    addPushSubscriber(subscription: Subscription): Observable<ServiceResponse> {
        return this.http.post<ServiceResponse>(this.urlHandler.HTTP_URL_NOTIFICATION + this.SUBSCRIBE, subscription);
    }
    removePushSubscriber(user: String): Observable<ServiceResponse> {
        return this.http.delete<ServiceResponse>(this.urlHandler.HTTP_URL_NOTIFICATION + this.UNSUBSCRIBE + this.SLASH + user);
    }


    //add and get notification preference
    addNotificationPreference(subscription: Subscription): Observable<ServiceResponse> {
        return this.http.post<ServiceResponse>(this.urlHandler.HTTP_URL_NOTIFICATION + this.PREFERENCE, subscription);
    }

    getNofificationPreferenceDetails(user: String): Observable<Subscription> {
        return this.http.get<Subscription>(this.urlHandler.HTTP_URL_NOTIFICATION + this.PREFERENCE + this.SLASH + user);
    }


    //CRUD operation : notification rules
    addNotificationRule(notificationRule: NotificationRule): Observable<ServiceResponse> {
        return this.http.post<ServiceResponse>(this.urlHandler.HTTP_URL_NOTIFICATION + this.RULES, notificationRule);
    }

    getNotificationRule(): Observable<NotificationRule[]> {
        return this.http.get<NotificationRule[]>(this.urlHandler.HTTP_URL_NOTIFICATION + this.RULES);
    }

    updateNotificationRule(notificationRule: NotificationRule): Observable<ServiceResponse> {
        return this.http.put<ServiceResponse>(this.urlHandler.HTTP_URL_NOTIFICATION + this.RULES, notificationRule);
    }

    removeNotificationRule(ruleId: number): Observable<ServiceResponse> {
        return this.http.delete<ServiceResponse>(this.urlHandler.HTTP_URL_NOTIFICATION + this.RULES + this.SLASH + ruleId);
    }




}