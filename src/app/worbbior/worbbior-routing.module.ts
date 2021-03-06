import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WorbbiorComponent } from './worbbior.component';
import { EditProfileWorbbiorComponent } from './edit-profile/edit-profile.component';
import { TalentQuestionnaireComponent } from './edit-profile/talent-questionnaire.component';
import { MessagesWorbbiorComponent } from './messages/messages.component';
import { MyWorbbyWorbbiorComponent } from './my-worbby/my-worbby.component';
import { PaymentsHistoryComponent } from 'app/payments-history/payments-history.component';
import { TasksHistoryWorbbiorComponent } from './tasks-history/tasks-history.component';
import { SelectActivityComponent } from './edit-profile/select-activity.component';
import { ComingSoonComponent } from '@app/public/coming-soon/coming-soon.component';
import { WorbbiorTaskOfferComponent } from './worbby-task/worbbior-task-offer.component';
import { WorbbiorTaskDetailsComponent } from './worbby-task/worbbior-task-details.component';
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
                    { path: 'edit-profile', component: EditProfileWorbbiorComponent, data: { permission: 'Pages.Worbbior.EditProfile' } },
                    { path: 'edit-profile/:hash', component: EditProfileWorbbiorComponent, data: { permission: 'Pages.Worbbior.EditProfile' } },
                    { path: 'select-activity', component: SelectActivityComponent, data: { permission: 'Pages.Worbbior.EditProfile' } },
                    // { path: 'messages', component: MessagesWorbbiorComponent, data: { permission: 'Pages.Worbbior.Messages' } },
                    { path: 'my-worbby', component: MyWorbbyWorbbiorComponent, data: { permission: 'Pages.Worbbior.MyWorbby' } },
                    { path: 'payments-history', component: PaymentsHistoryComponent, data: { permission: 'Pages.Worbbior.PaymentsHistory' } },
                    { path: 'tasks-history', component: TasksHistoryWorbbiorComponent, data: { permission: 'Pages.Worbbior.TasksHistory' } },
                    { path: 'talent-questionnaire', component: TalentQuestionnaireComponent, data: { } },
                    { path: 'worbby-task-offer/:worbbyOfferId', component: WorbbiorTaskOfferComponent, data: { } },
                    { path: 'worbby-task-details/:worbbyTaskId', component: WorbbiorTaskDetailsComponent, data: { } },
                    { path: 'notifications', component: NotificationsComponent, data: { } }

                    //Versão limitada
                    // { path: 'edit-profile', component: EditProfileWorbbiorComponent, data: { permission: 'Pages.Worbbior.EditProfile' } },
                    // { path: 'edit-profile/:hash', component: EditProfileWorbbiorComponent, data: { permission: 'Pages.Worbbior.EditProfile' } },
                    // { path: 'select-activity', component: SelectActivityComponent, data: { permission: 'Pages.Worbbior.EditProfile' } },
                    // // { path: 'messages', component: MessagesWorbbiorComponent, data: { permission: 'Pages.Worbbior.Messages' } },
                    // { path: 'my-worbby', component: ComingSoonComponent, data: { permission: 'Pages.Worbbior.MyWorbby' } },
                    // { path: 'payments-history', component: ComingSoonComponent, data: { permission: 'Pages.Worbbior.PaymentsHistory' } },
                    // { path: 'tasks-history', component: ComingSoonComponent, data: { permission: 'Pages.Worbbior.TasksHistory' } },
                    // //{ path: 'talent-questionnaire', component: ComingSoonComponent, data: { } },
                    // { path: 'worbby-task-offer/:worbbyOfferId', component: ComingSoonComponent, data: { } },
                    // { path: 'worbby-task-details/:worbbyTaskId', component: ComingSoonComponent, data: { } },
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class WorbbiorRoutingModule { }