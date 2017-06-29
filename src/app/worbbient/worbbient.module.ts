import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from '@node_modules/ng2-file-upload';
import { ModalModule, TabsModule, TooltipModule, AccordionModule, ButtonsModule, DatepickerModule } from 'ngx-bootstrap';
import { WorbbientRoutingModule } from './worbbient-routing.module'
import { UtilsModule } from '@shared/utils/utils.module'
import { AppCommonModule } from '@app/shared/common/app-common.module'
import { WorbbientComponent } from './worbbient.component'
import { EditProfileWorbbientComponent } from './edit-profile/edit-profile.component'
import { MyPersonalDataWorbbientComponent } from './edit-profile/my-personal-data.component'
import { MyPaymentWorbbientComponent } from './edit-profile/my-payment.component'
import { MyAddressWorbbientComponent } from './edit-profile/my-address.component'
import { MessagesWorbbientComponent } from './messages/messages.component';
import { MyWorbbyWorbbientComponent } from './my-worbby/my-worbby.component';
import { PaymentsHistoryWorbbientComponent } from './payments-history/payments-history.component';
import { TasksHistoryWorbbientComponent } from './tasks-history/tasks-history.component';
import { WorbbientTaskOffersComponent } from './worbby-task/worbbient-task-offers.component';
import { WorbbientTaskOfferComponent } from './worbby-task/worbbient-task-offer.component';
import { MainModule } from '@app/main/main.module';
import { WorbbientTaskDetailsComponent } from './worbby-task/worbbient-task-details.component';
import { EvaluateWorbbiorComponent } from './worbby-task/worbbient-evaluate-worbbior.component';
import { WorbbientTaskSubmitPaymentComponent } from './worbby-task/worbbient-task-submit-payment.component';
import { WorbbientTaskPaymentComponent } from './worbby-task/worbbient-task-payment.component';
import { WorbbientEditWorbbyTaskComponent } from './worbby-task/worbbient-edit-worbby-task.component';
import { MomentModule } from "angular2-moment";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        FileUploadModule,
        ModalModule.forRoot(),
        TabsModule.forRoot(),
        TooltipModule.forRoot(),
        AccordionModule.forRoot(),
        ButtonsModule.forRoot(),
        DatepickerModule.forRoot(),
        WorbbientRoutingModule,
        UtilsModule,
        AppCommonModule,
        MomentModule,
        MainModule
    ],
    declarations: [
        WorbbientComponent,
        EditProfileWorbbientComponent,
        MyPersonalDataWorbbientComponent,
        MyPaymentWorbbientComponent,
        MyAddressWorbbientComponent,
        MessagesWorbbientComponent,
        MyWorbbyWorbbientComponent,
        PaymentsHistoryWorbbientComponent,
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
    ]
})
export class WorbbientModule { }