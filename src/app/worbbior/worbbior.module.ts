import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileUploadModule } from '@node_modules/ng2-file-upload';
import { ModalModule, TabsModule, TooltipModule, AccordionModule, ButtonsModule, DatepickerModule, RatingModule } from 'ngx-bootstrap';
import { WorbbiorRoutingModule } from './worbbior-routing.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { WorbbiorComponent } from './worbbior.component';
import { EditProfileWorbbiorComponent } from './edit-profile/edit-profile.component';
import { MyPersonalDataWorbbiorComponent } from './edit-profile/my-personal-data.component';
import { MyDocumentsWorbbiorComponent } from './edit-profile/my-documents.component';
import { MyActivitiesWorbbiorComponent } from './edit-profile/my-activities.component';
import { SelectActivityComponent } from './edit-profile/select-activity.component';
import { CreateOrEditAvailabilityModalComponent } from './edit-profile/create-or-edit-availability-modal.component';
import { MyAvailabilityWorbbiorComponent } from './edit-profile/my-availability.component';
import { MyEndorsementsWorbbiorComponent } from './edit-profile/my-endorsements.component';
import { MessagesWorbbiorComponent } from './messages/messages.component';
import { MyWorbbyWorbbiorComponent } from './my-worbby/my-worbby.component';
import { PaymentsHistoryWorbbiorComponent } from './payments-history/payments-history.component';
import { TasksHistoryWorbbiorComponent } from './tasks-history/tasks-history.component';
import { TalentQuestionnaireComponent } from './edit-profile/talent-questionnaire.component';
import { WorbbiorTaskOfferComponent } from './worbby-task/worbbior-task-offer.component';
import { WorbbiorTaskDetailsComponent } from './worbby-task/worbbior-task-details.component';
import { MomentModule } from "angular2-moment";
import { TextMaskModule } from 'angular2-text-mask';
import { InfoTutorialCadastroModalComponent } from "app/worbbior/edit-profile/info-tutorial-cadastro-modal.component";
import { SendEndorsementModalComponent } from 'app/worbbior/edit-profile/send-endorsement-modal.component';
import { GeneralPaymentWorbbiorComponent } from "app/worbbior/payments-history/general-payment.component";
import { ReceivedPaymentWorbbiorComponent } from "app/worbbior/payments-history/received-payment.component";
import { PaidPaymentWorbbiorComponent } from "app/worbbior/payments-history/paid-payment.component";
import { ViewDocumentModalComponent } from '@app/worbbior/edit-profile/view-document-modal.component';
import { PdfViewerComponent } from 'ng2-pdf-viewer';
import { AppRouteGuard } from '@app/shared/common/auth/auth-route-guard';
import { WorbbiorWorbbyTaskActions } from './worbby-task/worbbior-task-actions.component';
import { WorbbiorScheduleDateModalComponent } from './worbby-task/worbbior-task-scheduledate-modal.component';
import { LoginService } from "app/account/login/login.service";
import { ShareButtonsModule } from 'ngx-sharebuttons';
import { ConfirmBalanceTransferModalComponent } from 'app/worbbior/payments-history/confirm-balance-transfer-modal.component';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        ModalModule.forRoot(),
        TabsModule.forRoot(),
        TooltipModule.forRoot(),
        AccordionModule.forRoot(),
        ButtonsModule.forRoot(),
        DatepickerModule.forRoot(),
        RatingModule.forRoot(),
        ShareButtonsModule.forRoot(),
        WorbbiorRoutingModule,
        UtilsModule,
        AppCommonModule,
        MomentModule,
        FileUploadModule,
        TextMaskModule
    ],
    declarations: [
        WorbbiorComponent,
        EditProfileWorbbiorComponent,
        MyPersonalDataWorbbiorComponent,
        MyActivitiesWorbbiorComponent,
        MyEndorsementsWorbbiorComponent,
        MyAvailabilityWorbbiorComponent,
        MessagesWorbbiorComponent,
        MyWorbbyWorbbiorComponent,
        PaymentsHistoryWorbbiorComponent,
        TasksHistoryWorbbiorComponent,
        MyDocumentsWorbbiorComponent,
        CreateOrEditAvailabilityModalComponent,
        SelectActivityComponent,
        TalentQuestionnaireComponent,
        WorbbiorTaskOfferComponent,
        WorbbiorTaskDetailsComponent,
        InfoTutorialCadastroModalComponent,
        SendEndorsementModalComponent,
        GeneralPaymentWorbbiorComponent,
        ReceivedPaymentWorbbiorComponent,
        PaidPaymentWorbbiorComponent,
        ViewDocumentModalComponent,
        PdfViewerComponent,
        WorbbiorWorbbyTaskActions,
        WorbbiorScheduleDateModalComponent,
        ConfirmBalanceTransferModalComponent
    ],
    providers: [
        AppRouteGuard,
        LoginService
    ]
})
export class WorbbiorModule { }