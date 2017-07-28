import * as ngCommon from '@angular/common';
import { CommonModule } from '@shared/common/common.module';
import { AppCommonModule } from '@app/shared/common/app-common.module'
import { NgModule } from '@angular/core';
import { FormsModule, FormControl } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { RecaptchaModule } from 'ng-recaptcha';
import { ModalModule, AccordionModule, ButtonsModule, TabsModule, DatepickerModule, RatingModule, TooltipModule } from 'ngx-bootstrap';

import { AbpModule } from '@abp/abp.module';

import { PublicRoutingModule } from './public-routing.module';

import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';

import { PublicComponent } from './public.component';

//PUBLIC CONTENT

import { AboutWorbbyComponent } from './about-worbby/about-worbby.component';
import { ContactComponent } from './contact/contact.component';
import { FaqComponent } from './faq/faq.component';
import { HowDoesItWorkComponent } from './how-does-it-work/how-does-it-work.component';
import { InsuranceComponent } from './insurance/insurance.component';
import { SupportComponent } from './support/support.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { EndorsementsComponent } from './endorsements/endorsements.component';
import { PageWorbbiorComponent } from '@app/worbbior/page/page-worbbior.component';
import { BecomeWorbbiorComponent } from './become-a-worbbior/become-a-worbbior.component';
import { HowDoesItWorkWorbbiorComponent } from './how-does-it-work-worbbior/how-does-it-work-worbbior.component';
import { FindTasksComponent } from './find-tasks/find-tasks.component';
import { PostTaskComponent } from './post-a-task/post-a-task.component';
import { EndorsementSelectActivityComponent } from './endorsements/endorsement-select-activity.component';
import { EndorsementSuccessComponent } from './endorsements/endorsement-success.component';
import { WorbbyTaskComponent } from './worbby-task/worbby-task.component';
import { SendOfferModalComponent } from './worbby-task/send-offer-modal.component';
import { ActivityCenterComponent } from "./activity-center/activity-center-page.component";
import { SideMenuComponent } from '@app/shared/layout/side-menu.component';
import { AppAuthService } from '@app/shared/common/auth/app-auth.service';
import { AgmCoreModule } from '@agm/core';
import { LoginService } from "app/account/login/login.service";
import { UtilsModule } from '@shared/utils/utils.module';
import { Ng2ImageGalleryModule } from 'ng2-image-gallery';
import { MomentModule } from 'angular2-moment';
import { TextMaskModule } from 'angular2-text-mask';
import { ShareButtonsModule } from 'ngx-sharebuttons';

@NgModule({
    imports: [
        ngCommon.CommonModule,
        CommonModule,
        FormsModule,
        HttpModule,
        JsonpModule,
        RecaptchaModule.forRoot(),
        ModalModule.forRoot(),
        TabsModule.forRoot(),
        AccordionModule.forRoot(),
        ButtonsModule.forRoot(),
        TooltipModule.forRoot(),
        DatepickerModule.forRoot(),
        ShareButtonsModule.forRoot(),
        AbpModule,
        ServiceProxyModule,
        PublicRoutingModule,
        RatingModule,
        UtilsModule,
        AppCommonModule,
        Ng2ImageGalleryModule,
        MomentModule,
        TextMaskModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyDmAf99svQmS-Oi0BDl2Zpn0YtMGccRZRM'
        }),
    ],
    declarations: [
        PublicComponent,
        AboutWorbbyComponent,
        ContactComponent,
        FaqComponent,
        HowDoesItWorkComponent,
        InsuranceComponent,
        SupportComponent,
        TermsAndConditionsComponent,
        EndorsementsComponent,
        PageWorbbiorComponent,
        BecomeWorbbiorComponent,
        HowDoesItWorkWorbbiorComponent,
        FindTasksComponent,
        PostTaskComponent,
        SendOfferModalComponent,
        EndorsementSelectActivityComponent,
        EndorsementSuccessComponent,
        WorbbyTaskComponent,
        ActivityCenterComponent,
        SideMenuComponent
    ],
    providers: [
        LoginService
    ]
})
export class PublicModule {

}