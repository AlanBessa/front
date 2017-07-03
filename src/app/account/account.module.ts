import * as ngCommon from '@angular/common';
import { CommonModule } from '@shared/common/common.module';
import { AppCommonModule } from '@app/shared/common/app-common.module'
import { NgModule } from '@angular/core';
import { FormsModule, FormControl } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';

import { ModalModule, AccordionModule, ButtonsModule, TabsModule, DatepickerModule, RatingModule, TooltipModule } from 'ngx-bootstrap';

import { AbpModule } from '@abp/abp.module';

import { AccountRoutingModule } from './account-routing.module';

import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';

import { UtilsModule } from '@shared/utils/utils.module';

import { TextMaskModule } from 'angular2-text-mask';
import { Ng2ImageGalleryModule } from 'ng2-image-gallery';

import { MomentModule } from 'angular2-moment';

import { AccountComponent } from './account.component';

import { LoginService } from './login/login.service';

import { BinaryObjectServiceProxy }  from '@shared/service-proxies/service-proxies';

import { LoginPageComponent } from './login/login-page.component';
import { RegisterPageComponent } from './register/register-page.component';
import { ForgotPasswordComponent } from './password/forgot-password.component';
import { ResetPasswordComponent } from './password/reset-password.component';
import { EmailActivationComponent } from './email-activation/email-activation.component';
import { ConfirmEmailComponent } from './email-activation/confirm-email.component';
import { SendTwoFactorCodeComponent } from './login/send-two-factor-code.component';
import { ValidateTwoFactorCodeComponent } from './login/validate-two-factor-code.component';


@NgModule({
    imports: [
        AccountRoutingModule,
        ngCommon.CommonModule,
        CommonModule,
        FormsModule,
        HttpModule,
        JsonpModule,
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
        RatingModule,
        TextMaskModule,
        MomentModule,
        AppCommonModule        
    ],
    declarations: [
        LoginPageComponent,
        RegisterPageComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent,
        EmailActivationComponent,
        ConfirmEmailComponent,
        SendTwoFactorCodeComponent,
        ValidateTwoFactorCodeComponent,
        AccountComponent
    ],
    providers: [
        LoginService,
        BinaryObjectServiceProxy
    ]
})
export class AccoutModule {

}