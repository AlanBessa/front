import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WorbbientComponent } from './worbbient.component';
import { EditProfileWorbbientComponent } from './edit-profile/edit-profile.component';
import { MessagesWorbbientComponent } from './messages/messages.component';
import { MyWorbbyWorbbientComponent } from './my-worbby/my-worbby.component';
import { PaymentsHistoryWorbbientComponent } from './payments-history/payments-history.component';
import { TasksHistoryWorbbientComponent } from './tasks-history/tasks-history.component';
import { WorbbientTaskOffersComponent } from './worbby-task/worbbient-task-offers.component';
import { ComingSoonComponent } from '@app/public/coming-soon/coming-soon.component';
import { WorbbientTaskOfferComponent } from './worbby-task/worbbient-task-offer.component';
import { WorbbientTaskDetailsComponent } from './worbby-task/worbbient-task-details.component';
import { EvaluateWorbbiorComponent } from './worbby-task/worbbient-evaluate-worbbior.component';
import { WorbbientTaskSubmitPaymentComponent } from './worbby-task/worbbient-task-submit-payment.component';
import { WorbbientEditWorbbyTaskComponent } from './worbby-task/worbbient-edit-worbby-task.component';
import { WorbbientTaskPaymentComponent } from './worbby-task/worbbient-task-payment.component';
import { AppRouteGuard } from '@app/shared/common/auth/auth-route-guard';
import { NotificationsComponent } from "app/shared/layout/notifications/notifications.component";

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                canActivate: [AppRouteGuard],
                canActivateChild: [AppRouteGuard],
                path: '',
                children: [
                    //Versão Completa
                    { path: 'edit-profile', component: EditProfileWorbbientComponent, data: { permission: 'Pages.Worbbient.EditProfile' } },
                    //{ path: 'messages', component: MessagesWorbbientComponent, data: { permission: 'Pages.Worbbient.Messages' } },
                    { path: 'my-worbby', component: MyWorbbyWorbbientComponent, data: { permission: 'Pages.Worbbient.MyWorbby' } },
                    { path: 'payments-history', component: PaymentsHistoryWorbbientComponent, data: { permission: 'Pages.Worbbient.PaymentsHistory' } },
                    { path: 'tasks-history', component: TasksHistoryWorbbientComponent, data: { permission: 'Pages.Worbbient.TasksHistory' } },
                    { path: 'worbby-task-offers/:worbbyTaskId', component: WorbbientTaskOffersComponent, data: { permission: 'Pages.Worbbient.PostTask' } },
                    { path: 'worbby-task-offer/:worbbyOfferId', component: WorbbientTaskOfferComponent, data: { permission: 'Pages.Worbbient.PostTask' } },
                    { path: 'worbby-task-details/:worbbyTaskId', component: WorbbientTaskDetailsComponent, data: { } },
                    { path: 'evaluate-worbbior/:worbbyTaskId', component: EvaluateWorbbiorComponent, data: { } },
                    { path: 'worbby-task-submit-payment/:worbbyTaskId', component: WorbbientTaskSubmitPaymentComponent, data: { } },
                    { path: 'worbby-task-payment/:worbbyTaskId', component: WorbbientTaskPaymentComponent, data: { } },
                    { path: 'post-a-task-edit/:worbbyTaskId', redirectTo: 'editar-tarefa-postada', pathMatch: 'full' },
                    {
                        path: 'editar-tarefa-postada/:worbbyTaskId', component: WorbbientEditWorbbyTaskComponent, data: {
                            meta: {
                                title: '',
                                description: ''
                            }
                        }
                    },
                    { path: 'notifications', component: NotificationsComponent, data: { } }

                    //Versão limitada
                    // { path: 'edit-profile', component: EditProfileWorbbientComponent, data: { permission: 'Pages.Worbbient.EditProfile' } },
                    // //{ path: 'messages', component: MessagesWorbbientComponent, data: { permission: 'Pages.Worbbient.Messages' } },
                    // { path: 'my-worbby', component: ComingSoonComponent, data: { permission: 'Pages.Worbbient.MyWorbby' } },
                    // { path: 'payments-history', component: ComingSoonComponent, data: { permission: 'Pages.Worbbient.PaymentsHistory' } },
                    // { path: 'tasks-history', component: ComingSoonComponent, data: { permission: 'Pages.Worbbient.TasksHistory' } },
                    // { path: 'worbby-task-offers/:worbbyTaskId', component: ComingSoonComponent, data: { permission: 'Pages.Worbbient.PostTask' } },
                    // { path: 'worbby-task-offer/:worbbyOfferId', component: ComingSoonComponent, data: { permission: 'Pages.Worbbient.PostTask' } },
                    // { path: 'worbby-task-details/:worbbyTaskId', component: ComingSoonComponent, data: { } },
                    // { path: 'evaluate-worbbior/:worbbyTaskId', component: ComingSoonComponent, data: { } },
                    // { path: 'worbby-task-submit-payment/:worbbyTaskId', component: ComingSoonComponent, data: { } },
                    // { path: 'worbby-task-payment/:worbbyTaskId', component: ComingSoonComponent, data: { } },
                    // { path: 'post-a-task-edit/:worbbyTaskId', redirectTo: 'editar-tarefa-postada', pathMatch: 'full' },
                    // {
                    //     path: 'editar-tarefa-postada/:worbbyTaskId', component: ComingSoonComponent, data: {
                    //         meta: {
                    //             title: '',
                    //             description: ''
                    //         }
                    //     }
                    // }
                    
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class WorbbientRoutingModule { }