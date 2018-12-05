import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbAlertModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NotificationRuleComponent, NotificationRuleDialogComponent } from './notification-rule.component';

import { PageHeaderModule } from '../../../shared';
import { NotificationRuleRoutingModule } from './notification-rule-routing.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MaterialModule } from 'src/app/shared/modules/material.module';




@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbAlertModule.forRoot(),
        NgbModule.forRoot(),
        NgxDatatableModule,
        ReactiveFormsModule,
        HttpClientModule,
        MaterialModule,
        PageHeaderModule,
        NotificationRuleRoutingModule
    ],
    declarations: [NotificationRuleComponent,NotificationRuleDialogComponent],
    providers: [],
    entryComponents:[NotificationRuleComponent,NotificationRuleDialogComponent]
})
export class NotificationRuleModule {}
