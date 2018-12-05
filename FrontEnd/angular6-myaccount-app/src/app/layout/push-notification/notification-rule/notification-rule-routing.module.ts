import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotificationRuleComponent } from './notification-rule.component';


const routes: Routes = [
    {
        path: '', 
        component: NotificationRuleComponent,
        runGuardsAndResolvers: 'always'
    } ,
    {
        path: ':id',
        component: NotificationRuleComponent,
        runGuardsAndResolvers: 'always'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NotificationRuleRoutingModule {
}
