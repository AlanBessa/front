import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileUploadModule } from '@node_modules/ng2-file-upload';
import { ModalModule, TabsModule, TooltipModule, AccordionModule, ButtonsModule, DatepickerModule } from 'ngx-bootstrap';
import { WorbbiorRoutingModule } from './worbbior-routing.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { WorbbiorComponent } from './worbbior.component';
import { EditProfileWorbbiorComponent } from './edit-profile/edit-profile.component';
import { MyPersonalDataWorbbiorComponent } from './edit-profile/my-personal-data.component';
import { MyDocumentsWorbbiorComponent } from './edit-profile/my-documents.component';
import { MyActivitiesWorbbiorComponent } from './edit-profile/my-activities.component';
import { SelectActivityComponent } from './edit-profile/select-activity.component';
import { CreateOrEditUserActivityModalComponent } from './edit-profile/create-or-edit-user-activity-modal.component';
import { CreateOrEditAvailabilityModalComponent } from './edit-profile/create-or-edit-availability-modal.component';
import { MyAvailabilityWorbbiorComponent } from './edit-profile/my-availability.component';
import { MyEndorsementsWorbbiorComponent } from './edit-profile/my-endorsements.component';
import { MessagesWorbbiorComponent } from './messages/messages.component';
import { MyWorbbyWorbbiorComponent } from './my-worbby/my-worbby.component';
import { PaymentsHistoryWorbbiorComponent } from './payments-history/payments-history.component';
import { TasksHistoryWorbbiorComponent } from './tasks-history/tasks-history.component';
import { TalentQuestionnaireComponent } from './edit-profile/talent-questionnaire.component';
import { WorbbiorTaskOfferComponent } from './worbby-task/worbbior-task-offer.component';
import { WorbbiorTaskOffersComponent } from './worbby-task/worbbior-task-offers.component';
import { WorbbiorTaskDetailsComponent } from './worbby-task/worbbior-task-details.component';
import { MomentModule } from "angular2-moment";

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
        WorbbiorRoutingModule,
        UtilsModule,
        AppCommonModule,
        MomentModule,
        FileUploadModule
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
        WorbbiorTaskOffersComponent,
        WorbbiorTaskDetailsComponent
    ],
    providers: [
    ]
})
export class WorbbiorModule { }