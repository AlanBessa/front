import { CommonModule } from '@angular/common';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule, FormControl } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { RecaptchaModule } from 'ng-recaptcha';
import { ModalModule, AccordionModule, ButtonsModule, TabsModule, DatepickerModule, RatingModule, TooltipModule } from 'ngx-bootstrap';

import { AbpModule, ABP_HTTP_PROVIDER } from '@abp/abp.module';

import { PublicRoutingModule } from './public-routing.module';

import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';
import { API_BASE_URL } from "@shared/service-proxies/service-proxies";

import { AppConsts } from '@shared/AppConsts';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { GroupByPipe } from '@shared/utils/group-by.pipe';
import { UtilsModule } from '@shared/utils/utils.module';

import { PublicComponent } from './public.component';
//import { WorbbyHeaderComponent } from '@app/shared/layout/worbby-header.component';

//PUBLIC CONTENT
import { HomeComponent } from './home/home.component';
import { AboutWorbbyComponent } from './about-worbby/about-worbby.component';
import { ContactComponent } from './contact/contact.component';
import { FaqComponent } from './faq/faq.component';
import { HowDoesItWorkComponent } from './how-does-it-work/how-does-it-work.component';
import { InsuranceComponent } from './insurance/insurance.component';
import { SupportComponent } from './support/support.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { EndorsementsComponent } from './endorsements/endorsements.component';
import { FindTalentComponent } from './find-talent/find-talent.component';
import { PageWorbbiorComponent } from '@app/worbbior/page/page-worbbior.component';
import { BecomeWorbbiorComponent } from './become-a-worbbior/become-a-worbbior.component';
import { HowDoesItWorkWorbbiorComponent } from './how-does-it-work-worbbior/how-does-it-work-worbbior.component';
import { FindTasksComponent } from './find-tasks/find-tasks.component';
import { PostTaskComponent } from './post-a-task/post-a-task.component';
import { EndorsementSelectActivityComponent } from './endorsements/endorsement-select-activity.component';
import { AppAuthService } from '@app/shared/common/auth/app-auth.service';
import { EndorsementSuccessComponent } from './endorsements/endorsement-success.component';
import { WorbbyTaskComponent } from './worbby-task/worbby-task.component';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';
import { RequestWorbbiorRegisterCodeModalComponent } from './register/request-worbbior-register-code-modal.component';

import { TenantChangeComponent } from './shared/tenant-change.component';
import { TenantChangeModalComponent } from './shared/tenant-change-modal.component';
import { SendOfferModalComponent } from './worbby-task/send-offer-modal.component';
import { LoginComponent } from './login/login.component';
import { LoginPageComponent } from './login/login-page.component';
import { RegisterComponent } from './register/register.component';
import { RegisterPageComponent } from './register/register-page.component';
import { ForgotPasswordComponent } from './password/forgot-password.component';
import { ResetPasswordComponent } from './password/reset-password.component';
import { EmailActivationComponent } from './email-activation/email-activation.component';
import { ConfirmEmailComponent } from './email-activation/confirm-email.component';
import { LoginService } from './login/login.service';
import { SendTwoFactorCodeComponent } from './login/send-two-factor-code.component';
import { ValidateTwoFactorCodeComponent } from './login/validate-two-factor-code.component';
import { LanguageSwitchComponent } from './language-switch.component';
import { SlickSliderComponent } from '../shared/slick-slider.component';
import { SendReportModalComponent } from '@app/worbbior/page/send-report-modal.component';
import { ShareButtonsModule } from 'ngx-sharebuttons';
import { BinaryObjectServiceProxy }  from '@shared/service-proxies/service-proxies';
import { Angulartics2Module, Angulartics2GoogleAnalytics, Angulartics2Facebook } from 'angulartics2';
import { PdfViewerComponent } from 'ng2-pdf-viewer';
import { TextMaskModule } from 'angular2-text-mask';
import { Ng2ImageGalleryModule } from 'ng2-image-gallery';
import { SelectModule } from 'ng2-select';
import { MomentModule } from 'angular2-moment';
import { FeedbackComponent } from "shared/feedback/feedback.component";
import { ActivityCenterComponent } from "public/activity-center/activity-center-page.component";
import { ImageCropperComponent} from 'ng2-img-cropper';
import { MetaModule } from '@nglibs/meta';
import { HomeReleaseModalComponent } from './home/home-release-modal.component';
import { SideMenuComponent } from "public/shared/layout/side-menu.component";

import { FooterComponent } from '@app/shared/layout/footer.component';
import { HeaderComponent } from './shared/layout/header.component';

import { AgmCoreModule } from '@agm/core';

export function appInitializerFactory(appSessionService: AppSessionService): () => Promise<boolean> {
    return () => appSessionService.init();
}

export function apiBaseUrlFactory(): string {
    return AppConsts.remoteServiceBaseUrl;
}

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        JsonpModule,
        RecaptchaModule.forRoot(),
        ModalModule.forRoot(),
        TabsModule.forRoot(),
        AccordionModule.forRoot(),
        ButtonsModule.forRoot(),
        DatepickerModule.forRoot(),
        TooltipModule.forRoot(),
        Ng2ImageGalleryModule,
        AbpModule,
        UtilsModule,
        ServiceProxyModule,
        PublicRoutingModule,
        RatingModule,
        ShareButtonsModule.forRoot(),
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyDmAf99svQmS-Oi0BDl2Zpn0YtMGccRZRM'
        }),
        Angulartics2Module.forRoot([ Angulartics2GoogleAnalytics, Angulartics2Facebook ]),
        TextMaskModule,
        SelectModule,
        MomentModule,
        MetaModule.forRoot()
    ],
    declarations: [
        PublicComponent,
        TenantChangeComponent,
        TenantChangeModalComponent,
        LoginComponent,
        LoginPageComponent,
        RegisterComponent,
        RegisterPageComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent,
        EmailActivationComponent,
        ConfirmEmailComponent,
        SendTwoFactorCodeComponent,
        ValidateTwoFactorCodeComponent,
        LanguageSwitchComponent,
        HomeComponent,
        AboutWorbbyComponent,
        ContactComponent,
        FaqComponent,
        HowDoesItWorkComponent,
        InsuranceComponent,
        SupportComponent,
        TermsAndConditionsComponent,
        EndorsementsComponent,
        FindTalentComponent,
        PageWorbbiorComponent,
        BecomeWorbbiorComponent,
        SlickSliderComponent,
        HowDoesItWorkWorbbiorComponent,
        FindTasksComponent,
        PostTaskComponent,
        SendReportModalComponent,
        SendOfferModalComponent,
        EndorsementSelectActivityComponent,
        EndorsementSuccessComponent,
        PdfViewerComponent,
        WorbbyTaskComponent,
        ComingSoonComponent,
        FeedbackComponent,
        ActivityCenterComponent,
        RequestWorbbiorRegisterCodeModalComponent,
        ImageCropperComponent,
        HomeReleaseModalComponent,
        SideMenuComponent,
        HeaderComponent,
        FooterComponent
    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: appInitializerFactory,
            deps: [AppSessionService],
            multi: true
        },
        ABP_HTTP_PROVIDER,
        { provide: API_BASE_URL, useFactory: apiBaseUrlFactory },
        LoginService,
        AppSessionService,
        AppAuthService,
        BinaryObjectServiceProxy
    ],
    bootstrap: [PublicComponent]
})
export class PublicModule {

}