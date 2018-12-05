import { Component, OnInit, ViewEncapsulation, ViewChild, OnDestroy, Inject } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { routerTransition } from '../../../router.animations';
import { NotifierService } from '../../../Services/notifier-service';
import { Subject } from 'rxjs';
import { map, tap, takeUntil} from 'rxjs/operators';
import { NotificationRule } from '../../../model/notificationModel/notificationRule';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material';
import { RuleDescription } from '../../../model/notificationModel/RuleDescription';


@Component({
  selector: 'app-notification-rule',
  templateUrl: './notification-rule.component.html',
  styleUrls: ['./notification-rule.component.css',
    '../../components/ngxtable/material.scss',
    '../../components/ngxtable/datatable.component.scss',
    '../../components/ngxtable/icons.css',
    '../../components/ngxtable/app.css'],
  animations: [routerTransition()],
  encapsulation: ViewEncapsulation.None
})
export class NotificationRuleComponent implements OnInit, OnDestroy {

  public alerts: Array<any> = [];
  public hideAlert: boolean;
  public showLoadingScreen: boolean;
  public selected = [];
  public isEditNotificationRule: boolean;
  public rows: NotificationRule[];
  public temp: NotificationRule[];
  public columns = [];
  private unsubscribe = new Subject<void>();

  ruleId: number;

  constructor(public dialog: MatDialog,
    private notifierService: NotifierService) {
  }

  ngOnInit() {
    this.showLoadingScreen = true;
    this.hideAlert = false;
    this.retrieveNotificationRuleList();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  openDialog(isEditNotificationRule: boolean, row): void {

    console.log('isEditNotificationRule : ', isEditNotificationRule);

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '500px';

    if (isEditNotificationRule) {
      dialogConfig.data = {
        isEditNotificationRule: isEditNotificationRule,
        ruleId: row.ruleId,
        ruleName: row.ruleName, reportType: row.reportType, ruleDescription: row.ruleDescription
      };
    } else {
      dialogConfig.data = { isEditNotificationRule: isEditNotificationRule };
    }

    const dialogRef = this.dialog.open(NotificationRuleDialogComponent, dialogConfig);
    this.ruleId = dialogRef.componentInstance.ruleId;
    console.log('ruleId  : ', this.ruleId);


    dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe(form => {
      console.log('The dialog was closed');
      console.log('form  values : ', JSON.stringify(form.value));
      console.log('form raw values : ', JSON.stringify(form.getRawValue()));
      let ruleDescriptionArrayString: string;
      let ruleDescriptionArray: RuleDescription[] = [];
      let notificationRule = new NotificationRule;
      let ruleDescription = new RuleDescription;

      ruleDescription.template = form.getRawValue().template;
      ruleDescription.orderType = form.getRawValue().orderType;
      ruleDescription.transType = form.getRawValue().transType;
      ruleDescription.status = form.getRawValue().statuz;
      ruleDescription.maxcount = form.getRawValue().maxcount.toString();

      let ruleDescriptionString = JSON.stringify(ruleDescription);
      console.log('ruleDescriptionString : ', ruleDescriptionString);

      notificationRule.ruleName = form.getRawValue().ruleName;
      notificationRule.reportType = form.getRawValue().reportType;

      ruleDescriptionArray.push(ruleDescription);
      console.log('ruleDescriptionArray : ', ruleDescriptionArray);

      ruleDescriptionArrayString = JSON.stringify(ruleDescriptionArray);
      console.log('ruleDescriptionArray string : ', ruleDescriptionArrayString);
      notificationRule.ruleDescription = ruleDescriptionArrayString;

      if (isEditNotificationRule) {
        notificationRule.ruleId = this.ruleId;
        console.log('Final notificationRule json string : ', JSON.stringify(notificationRule));
        this.updateNotificationRule(notificationRule);
      } else {
        console.log('Final notificationRule json string : ', JSON.stringify(notificationRule));
        this.addNotificationRule(notificationRule);
      }

    });
  }

  btnEditNotificationRule(row) {
    console.log("Inside btnEditNotificationRule. Rule Id : " + row.ruleId);
    this.openDialog(true, row);
  }

  btnDeleteNotificationRule(row) {
    console.log("Inside btnDeleteNotificationRule. Rule Id : " + row.ruleId);
    if (confirm("Are you sure you want to delete this Notification Rule? " + row.ruleId)) {
      this.deleteNotificationRule(row.ruleId);
    }
  }


  addNotificationRule(notificationRule: NotificationRule) {
    this.hideAlert = false;
    try {
      this.notifierService.addNotificationRule(notificationRule)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(
          data => {
            console.log("Response: " + data.status);
            this.showLoadingScreen = false;
            window.scrollTo(0, 0);
            this.successAlert("Notification Rule has been created successfully");
            setTimeout(function () {
              this.hideAlert = true;
              window.location.reload();
              //this.router.navigateByUrl('/notification-rule');
            }.bind(this), 3000);

          },
          (err: HttpErrorResponse) => {
            if (err.error instanceof Error) {
              console.log("Notification error, client/netowork issue.");
              this.showLoadingScreen = false;
              window.scrollTo(0, 0);
              this.failedAlert("Failed to create rule. Please try again");
              setTimeout(function () {
                this.hideAlert = true;
              }.bind(this), 8000);
            }
            else {
              console.log(`Back-end Service error, client/netowork issue: returned code ${err.status}, body error: ${err.error}.`);
              this.showLoadingScreen = false;
              window.scrollTo(0, 0);
              this.failedAlert("Failed to create rule . Please try again");
              setTimeout(function () {
                this.hideAlert = true;
              }.bind(this), 8000);
            }
          }
        );
    }
    catch (Exception) {
      console.log("Notifier Service - add notification rule Request Failed");
    }
    finally {

    }
  }

  retrieveNotificationRuleList() {
    this.showLoadingScreen = true;
    console.log("inside retrieveNotificationRuleList ");
    try {
      this.notifierService.getNotificationRule()
        .pipe(takeUntil(this.unsubscribe)).subscribe(
          (data: NotificationRule[]) => {
            //Success response
            console.log("DATA : " + data);

            //console.log("data[0].ruleId : " + data[0].ruleId);
            //console.log("data[0].ruleName : " + data[0].ruleName);

            this.rows = data;
            this.temp = data;
            this.showLoadingScreen = false;

          },
          (err: HttpErrorResponse) => {

            if (err.error instanceof Error) {
              //Client side/network error
              console.log("Client side error, client/netowork issue.");
              this.showLoadingScreen = false;
              window.scrollTo(0, 0);
              this.failedAlert("Failed to retrieve data. Please try again");
              setTimeout(function () {
                this.hideAlert = true;
              }.bind(this), 8000);
            } else {
              //Back-end service returned unsuccessful code.
              //TODO route to DASHBOARD and display warning message.
              console.log(`Back-end Service error, client/netowork issue: returned code ${err.status}, body error: ${err.error}.`);
              this.showLoadingScreen = false;
              window.scrollTo(0, 0);
              this.failedAlert("Failed to retrieve data. Please try again");
              setTimeout(function () {
                this.hideAlert = true;
              }.bind(this), 8000);
            }
          }
        );
    }
    catch (Exception) {
      console.log("Notification Rule Service exception");
    }
    finally {

    }
  }


  updateNotificationRule(notificationRule: NotificationRule) {
    this.hideAlert = false;
    try {
      this.notifierService.updateNotificationRule(notificationRule)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(
          data => {
            console.log("Response: " + data.status);
            this.showLoadingScreen = false;
            window.scrollTo(0, 0);
            this.successAlert("Notification Rule has been updated successfully");
            setTimeout(function () {
              this.hideAlert = true;
              window.location.reload();
              //this.router.navigateByUrl('/notification-rule');
            }.bind(this), 3000);

          },
          (err: HttpErrorResponse) => {
            if (err.error instanceof Error) {
              console.log("Notification error, client/netowork issue.");
              this.showLoadingScreen = false;
              window.scrollTo(0, 0);
              this.failedAlert("Failed to update Notification Rule . Please try again");
              setTimeout(function () {
                this.hideAlert = true;
              }.bind(this), 8000);
            }
            else {
              console.log(`Back-end Service error, client/netowork issue: returned code ${err.status}, body error: ${err.error}.`);
              this.showLoadingScreen = false;
              window.scrollTo(0, 0);
              this.failedAlert("Failed to update Notification Rule . Please try again");
              setTimeout(function () {
                this.hideAlert = true;
              }.bind(this), 8000);
            }
          }
        );
    }
    catch (Exception) {
      console.log("Notifier Service - Update Notification Rule Request Failed");
    }
    finally {

    }
  }


  deleteNotificationRule(ruleId: number): void {
    this.showLoadingScreen = true;
    try {
      this.notifierService.removeNotificationRule(ruleId)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(
          (response) => {
            this.showLoadingScreen = false;
            window.scrollTo(0, 0);
            this.successAlert("Notitification Rule has been deleted successfully");
            setTimeout(function () {
              this.hideAlert = true;
              window.location.reload();
              //this.router.navigateByUrl('/notification-rule');
            }.bind(this), 3000);
          },
          (err: HttpErrorResponse) => {
            if (err.error instanceof Error) {
              console.log("Notification error, client/netowork issue.");
              this.showLoadingScreen = false;
              window.scrollTo(0, 0);
              this.failedAlert("Failed to delete Notitification Rule. Please try again");
              setTimeout(function () {
                this.hideAlert = true;
              }.bind(this), 8000);
            }
            else {
              console.log(`Back-end Service error, client/netowork issue: returned code ${err.status}, body error: ${err.error}.`);
              this.showLoadingScreen = false;
              this.failedAlert("Failed to delete Notitification Rule. Please try again");
              window.scrollTo(0, 0);
              setTimeout(function () {
                this.hideAlert = true;
              }.bind(this), 8000);
            }
          }
        );
    }
    catch (Exception) {
      console.log("Notifier Service - Delete Notitification Rule Request Failed");
    }
    finally {

    }
  }

  private successAlert(successMsg: string) {
    this.alerts = [];
    this.alerts.push(
      {
        id: 1,
        type: 'success',
        message: successMsg
      }
    );
  }

  private failedAlert(errorMsg: string) {
    this.alerts = [];
    this.alerts.push(
      {
        id: 4,
        type: 'danger',
        message: errorMsg
      }
    );
  }

  private warningAlert(warningMsg: string) {
    this.alerts = [];
    this.alerts.push(
      {
        id: 3,
        type: 'alert alert-warning alert-dismissible fade show',
        message: warningMsg
      }
    );
  }

  public closeAlert(alert: any) {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
  }

  onSelect({ selected }) {
    console.log('Select Event', selected, this.selected);
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onActivate(event) {
    console.log('Activate Event', event);
  }


}



@Component({
  selector: 'notification-rule-dailog',
  templateUrl: 'notification-rule-dailog.component.html',
})
export class NotificationRuleDialogComponent {

  public myForm: FormGroup;
  public isDisabled: boolean;

  ruleId: number;
  ruleName: string;
  reportType: string;
  ruleDescription: RuleDescription;
  ruleDescriptionArray: RuleDescription[];

  public reportTypes = [{ name: 'allfailures', description: 'allfailures' },
  { name: 'monitor', description: 'monitor' },
  { name: 'monitorGraph', description: 'monitorGraph' }];

  public templates = [{ name: 'CSI_TLG', description: 'CSI_TLG' },
  { name: 'TMOBILE', description: 'TMOBILE' },
  { name: 'TMO_SIMPLE', description: 'TMO_SIMPLE' },
  { name: 'TMOWFM', description: 'TMOWFM' },
  { name: 'VZW', description: 'VZW' }];

  public transTypes = [{ name: 'BACKEND_AI', description: 'BACKEND_AI' },
  { name: 'SYSTEM_AI', description: 'SYSTEM_AI' }];

  public orderTypes = [{ name: 'ACT/REACT', description: 'ACT/REACT' },
  { name: 'SUI', description: 'SUI' },
  { name: 'OTHER', description: 'OTHER' }];

  public statuses = [{ name: 'L', description: 'L' },
  { name: 'Q', description: 'Q' },
  { name: 'S', description: 'S' },
  { name: 'W', description: 'W' }];




  constructor(private _fb: FormBuilder,
    public dialogRef: MatDialogRef<NotificationRuleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    console.log(JSON.stringify(data));
    this.initForm();

    //if comes from edit action,populate values
    if (data.isEditNotificationRule) {
      console.log('dialog:edit action');
      this.loadExistingValues(data);
      console.log(JSON.stringify(this.myForm.getRawValue()));

    } else {
      console.log('dialog:create action');
    }

  }

  loadExistingValues(data) {
    this.ruleId = data.ruleId;
    this.ruleName = data.ruleName;
    this.reportType = data.reportType;
    this.ruleDescriptionArray = JSON.parse(data.ruleDescription);
    this.ruleDescription = this.ruleDescriptionArray[0];

    this.myForm.patchValue({
      ruleName: this.ruleName, reportType: this.reportType,
      template: this.ruleDescription.template, transType: this.ruleDescription.transType,
      orderType: this.ruleDescription.orderType, statuz: this.ruleDescription.status
    });


    //disables the ruleName input field
    const ruleNameCtrl = this.myForm.controls['ruleName'];
    ruleNameCtrl.disable();

    //disables the status input field
    const statuzCtrl = this.myForm.controls['statuz'];
    statuzCtrl.disable();

    //disbables the other form select fields
    this.isDisabled = true;
  }


  private initForm() {
    this.myForm = this._fb.group({
      ruleName: ['', [Validators.required]],
      reportType: ['', [Validators.required]],
      template: ['', [Validators.required]],
      transType: ['', [Validators.required]],
      orderType: ['', [Validators.required]],
      statuz: ['', [Validators.required]],
      maxcount: ['', [Validators.required]],

    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}