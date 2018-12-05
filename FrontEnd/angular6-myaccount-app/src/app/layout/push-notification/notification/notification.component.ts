import { Component, OnInit, OnDestroy } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { NotifierService } from '../../../Services/notifier-service';
import { Subscription } from '../../../model/notificationModel/subscription';
import { map, tap, take,takeUntil} from 'rxjs/operators';
import { SwPush } from '@angular/service-worker';
import { NgForm, FormGroup, FormBuilder, Validators, FormControl, FormArray, ValidatorFn } from '@angular/forms';
import { Subject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'
  ],
  animations: [routerTransition()]
})
export class NotificationComponent implements OnInit,OnDestroy {

  private unsubscribe = new Subject<void>();
  public alerts: Array<any> = [];
  public showLoadingScreen: boolean;
  public hideAlert: boolean;

  readonly VAPID_PUBLIC_KEY = "BPua82YY1HK8AaPn3AziCHoWjMpbKcBRf9IuWfx0PUwe0Gixu9pqeFh6yGe8tbenLj1t0Iip473JJQShKa4cCJY";
  
  
  isSubscribed: boolean = false;
  types: any;
  form: FormGroup;
  

  notifTypes = [
    { code: 'BSN', name: 'Business Alerts' },
    { code: 'TRN', name: 'Transaction Events' },
    { code: 'WRN', name: 'Warnings' }
  ];

  constructor(private formBuilder: FormBuilder,
    private swPush: SwPush,private notifierService: NotifierService) {
  }

  ngOnInit() {
    this.showLoadingScreen = true;
    this.hideAlert = false;
    this.initialize();
  }

  /**
     * Unsubscribe from all Observable.
     */
    public ngOnDestroy() {
      this.unsubscribe.next();
      this.unsubscribe.complete();
  }

  initialize() {
    this.swPush.subscription.pipe(take(1))
      .subscribe(pushSubscription => {
        console.log('pushSubscription : ', JSON.stringify(pushSubscription));

        if (pushSubscription === null) {
          console.log(' user is subscribing..');
          this.isSubscribed = false;
          this.initalizeForm();
        } else {
          console.log('user already subscribed');
          this.isSubscribed = true;
          this.getNofificationPreferenceDetails();

        }

      });
  }

  initalizeForm() {
    // Create a new array with a form control for each order
    const controls = this.notifTypes.map(c => new FormControl(false));
    //controls[0].setValue(true); // Set the first checkbox to true (checked)
    this.form = this.formBuilder.group({
      notifTypes: new FormArray(controls)
    });

  }

  addNotificationPreference(notifTypes) {
    this.hideAlert = false;
    this.showLoadingScreen = true;

    let currentUser = this.getCurrentUser();

    let sub = new Subscription();
    sub.notifType = notifTypes;
    sub.user = currentUser.userName;

    try {
      this.notifierService.addNotificationPreference(sub)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(
          data => {
            console.log('Response : ', data);
            this.showLoadingScreen = false;
            this.successAlert("Notification preferences saved successfully.");
            setTimeout(function () {
              this.hideAlert = true;
            }.bind(this), 6000);
          },
          (err: HttpErrorResponse) => {
            if (err.error instanceof Error) {
              console.log("Notification preferences, client/netowork issue.");
              this.failedAlert("Failed to save notification preferences. Please try again");
              this.showLoadingScreen = false;
              setTimeout(function () {
                this.hideAlert = true;
              }.bind(this), 6000);
            }
            else {
              console.log(`Back-end Service error, client/netowork issue: returned code ${err.status}, body error: ${err.error}.`);
              this.failedAlert("Failed to save notification preferences. Please try again");
              this.showLoadingScreen = false;
              setTimeout(function () {
                this.hideAlert = true;
              }.bind(this), 6000);
            }
          }
        );
    }
    catch (Exception) {
      console.log("Notifier Service - add notification preferences failed");
    }
    finally {

    }
  }

  getNofificationPreferenceDetails() {
    this.hideAlert = false;
    this.showLoadingScreen = true;
    let currentUser = this.getCurrentUser();
    try {
      this.notifierService.getNofificationPreferenceDetails(currentUser.userName)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(
          data => {
            console.log('Response : ', data);
            console.log("saved notification types : " + data.notifType);
            this.types = data.notifType.split(",");
            // Create a new array with a form control for each order
            const controls = this.notifTypes.map(c => new FormControl(false));
            this.types.forEach(type => {
              if (type === 'BSN') {
                controls[0].setValue(true);// Set the checkbox to true (checked)
              } else if (type === 'TRN') {
                controls[1].setValue(true);
              } else if (type === 'WRN') {
                controls[2].setValue(true);
              }
            });

            this.form = this.formBuilder.group({
              notifTypes: new FormArray(controls)
            });

            this.showLoadingScreen = false;
            

          },
          (err: HttpErrorResponse) => {
            if (err.error instanceof Error) {
              console.log("Notification error, client/netowork issue.");
              this.failedAlert("Failed to get notification preferences. Please try again");
              this.showLoadingScreen = false;
              setTimeout(function () {
                this.hideAlert = true;
              }.bind(this), 6000);
            }
            else {
              console.log(`Back-end Service error, client/netowork issue: returned code ${err.status}, body error: ${err.error}.`);
              this.failedAlert("Failed to get notification preferences. Please try again");
              this.showLoadingScreen = false;
              setTimeout(function () {
                this.hideAlert = true;
              }.bind(this), 6000);
            }
          }
        );
    }
    catch (Exception) {
      console.log("Notifier Service - get notification preferences failed");
    }
    finally {

    }
  }

  subscribeToPushNotification() {
    this.hideAlert = false;
    this.showLoadingScreen = true;
    let sub = new Subscription();
    // Requesting messaging service to subscribe current client (browser)
    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    }).then((pushSubscription) => {
      let subscription = JSON.parse(JSON.stringify(pushSubscription));
      console.log('pushSubscription : ', subscription);

      let currentUser = this.getCurrentUser();
      subscription.user = currentUser.userName;

      // Passing subscription object to our backend
      this.notifierService.addPushSubscriber(subscription)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(
          (res) => {
            console.log('Response : ', res);
            this.isSubscribed = true;
            this.showLoadingScreen = false;
            this.successAlert("Now you are subscribed to push notifications.");
            setTimeout(function () {
              this.hideAlert = true;
            }.bind(this), 6000);
          }, (err: HttpErrorResponse) => {
            if (err.error instanceof Error) {
              console.log("Notification error, client/netowork issue.");
              this.failedAlert("Failed to subscribe for notification. Please try again");
              pushSubscription.unsubscribe();
              this.showLoadingScreen = false;
              setTimeout(function () {
                this.hideAlert = true;
              }.bind(this), 6000);
            }
            else {
              console.log(`Back-end Service error, client/netowork issue: returned code ${err.status}, body error: ${err.error}.`);
              this.failedAlert("Failed to subscribe for notification. Please try again");
              pushSubscription.unsubscribe();
              this.showLoadingScreen = false;
              setTimeout(function () {
                this.hideAlert = true;
              }.bind(this), 6000);
            }
          }
        );
    }).catch((err) => {
      console.error("Could not subscribe to notifications : ", err);
      this.failedAlert("You have blocked the permission.Please allow it in the browser notification settings to recieve push notifications");
      this.showLoadingScreen = false;
      setTimeout(function () {
        this.hideAlert = true;
      }.bind(this), 6000);
    });
  }



  unsubscribeFromPushNotification() {
    this.hideAlert = false;
    this.showLoadingScreen = true;
    // Get active subscription
    this.swPush.subscription.pipe(take(1))
      .subscribe(pushSubscription => {
        console.log('pushSubscription : ', JSON.stringify(pushSubscription));

        // Unsubscribe current client (browser)
        pushSubscription.unsubscribe()
          .then(success => {
            console.log('Unsubscription successfull : ', success)
            let currentUser = this.getCurrentUser();
            // Delete the subscription from the backend
            this.notifierService.removePushSubscriber(currentUser.userName)
              .pipe(takeUntil(this.unsubscribe))
              .subscribe(res => {
                console.log('Response : ', res);
                this.isSubscribed = false;
                this.initalizeForm();
                this.showLoadingScreen = false;
                this.successAlert("Now you are unsubscribed from push notifications.");
                setTimeout(function () {
                  this.hideAlert = true;
                }.bind(this), 6000);
              },
                (err: HttpErrorResponse) => {
                  if (err.error instanceof Error) {
                    console.log("Unsubscription error, client/netowork issue.");
                    this.failedAlert("Failed to unsubscribe from notification. Please try again");
                    this.showLoadingScreen = false;
                    setTimeout(function () {
                      this.hideAlert = true;
                    }.bind(this), 6000);
                  }
                  else {
                    console.log(`Back-end Service error, client/netowork issue: returned code ${err.status}, body error: ${err.error}.`);
                    this.failedAlert("Failed to unsubscribe from notification. Please try again");
                    this.showLoadingScreen = false;
                    setTimeout(function () {
                      this.hideAlert = true;
                    }.bind(this), 6000);
                  }
                })
          })
          .catch(err => {
            console.log('Unsubscription failed : ', err)
          })
      })
  }

  submit() {
    const selectedNotifTypes = this.form.value.notifTypes
      .map((v, i) => v ? this.notifTypes[i].code : null)
      .filter(v => v !== null);
    let notifTypes = selectedNotifTypes.join(",");
    console.log("Selected notification preferences to save : ", notifTypes);
    this.addNotificationPreference(notifTypes);
  }

  getCurrentUser() {
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    console.log("currentUser : ", currentUser.userName);
    return currentUser;
  }

  public closeAlert(alert: any) {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
}

private successAlert(successMsg:string){
  this.alerts = [];
    this.alerts.push(
        {
            id: 1,
            type: 'success',
            message: successMsg
        }
    );
}

private failedAlert(errorMsg:string){
  this.alerts = [];
    this.alerts.push(
        {
            id: 4,
            type: 'danger',
            message: errorMsg
        }
    );
}


}
