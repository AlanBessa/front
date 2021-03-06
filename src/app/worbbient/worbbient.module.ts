import * as ngCommon from '@angular/common';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from '@node_modules/ng2-file-upload';
import { ModalModule, TabsModule, TooltipModule, AccordionModule, ButtonsModule, DatepickerModule, RatingModule } from 'ngx-bootstrap';
import { WorbbientRoutingModule } from './worbbient-routing.module'
import { UtilsModule } from '@shared/utils/utils.module'
import { AppCommonModule } from '@app/shared/common/app-common.module'
import { WorbbientComponent } from './worbbient.component'
import { EditProfileWorbbientComponent } from './edit-profile/edit-profile.component'
import { MyPersonalDataWorbbientComponent } from './edit-profile/my-personal-data.component'
import { MyAddressWorbbientComponent } from './edit-profile/my-address.component'
import { MessagesWorbbientComponent } from './messages/messages.component';
import { MyWorbbyWorbbientComponent } from './my-worbby/my-worbby.component';
import { TasksHistoryWorbbientComponent } from './tasks-history/tasks-history.component';
import { WorbbientTaskOffersComponent } from './worbby-task/worbbient-task-offers.component';
import { WorbbientTaskOfferComponent } from './worbby-task/worbbient-task-offer.component';
import { WorbbientTaskDetailsComponent } from './worbby-task/worbbient-task-details.component';
import { EvaluateWorbbiorComponent } from './worbby-task/worbbient-evaluate-worbbior.component';
import { WorbbientTaskSubmitPaymentComponent } from './worbby-task/worbbient-task-submit-payment.component';
import { WorbbientTaskPaymentComponent } from './worbby-task/worbbient-task-payment.component';
import { WorbbientEditWorbbyTaskComponent } from './worbby-task/worbbient-edit-worbby-task.component';
import { MomentModule } from "angular2-moment";
import { TextMaskModule } from 'angular2-text-mask';
import { SelectModule } from 'ng2-select';
import { AppRouteGuard } from '@app/shared/common/auth/auth-route-guard';
import { PaymentsHistoryModule } from 'app/payments-history/payments-history.module';


@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        ngCommon.CommonModule,
        CommonModule,
        FileUploadModule,
        ModalModule.forRoot(),
        TabsModule.forRoot(),
        TooltipModule.forRoot(),
        AccordionModule.forRoot(),
        ButtonsModule.forRoot(),
        DatepickerModule.forRoot(),
        RatingModule.forRoot(),
        WorbbientRoutingModule,
        UtilsModule,
        AppCommonModule,
        MomentModule,
        TextMaskModule,
        SelectModule,
        PaymentsHistoryModule
    ],
    declarations: [
        WorbbientComponent,
        EditProfileWorbbientComponent,
        MyPersonalDataWorbbientComponent,
        MyAddressWorbbientComponent,
        MessagesWorbbientComponent,
        MyWorbbyWorbbientComponent,
        TasksHistoryWorbbientComponent,
        WorbbientTaskOffersComponent,
        WorbbientTaskOfferComponent,
        WorbbientTaskDetailsComponent,
        EvaluateWorbbiorComponent,
        WorbbientTaskSubmitPaymentComponent,
        WorbbientTaskPaymentComponent,
        WorbbientEditWorbbyTaskComponent
    ],
    providers: [
        AppRouteGuard
    ]
})
export class WorbbientModule { }