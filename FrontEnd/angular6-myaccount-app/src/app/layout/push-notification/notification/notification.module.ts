import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NotificationComponent } from './notification.component';
import { HttpClientModule } from '@angular/common/http';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { NotificationRoutingModule } from './notification-routing.module';
import { PageHeaderModule } from '../../../shared';
import { MaterialModule } from 'src/app/shared/modules/material.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbAlertModule.forRoot(),
        ReactiveFormsModule,
        HttpClientModule,
        MaterialModule,
        NotificationRoutingModule,
        PageHeaderModule,
    ],
    declarations: [NotificationComponent],
    providers: [],
})
export class NotificationModule {}
