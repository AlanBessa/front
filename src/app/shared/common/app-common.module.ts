import * as ngCommon from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalModule, TooltipModule } from 'ngx-bootstrap';

import { UtilsModule } from '@shared/utils/utils.module';
import { AbpModule } from '@abp/abp.module';
import { CommonModule } from '@shared/common/common.module';
import { ComingSoonComponent } from '@app/public/coming-soon/coming-soon.component';
import { TimeZoneComboComponent } from './timing/timezone-combo.component';
import { AppAuthService } from './auth/app-auth.service';
import { JqPluginDirective } from './libs/jq-plugin.directive';
import { CommonLookupModalComponent } from './lookup/common-lookup-modal.component';
import { DateRangePickerComponent } from './timing/date-range-picker.component';
import { DatePickerComponent } from './timing/date-picker.component';
import { AppRouteGuard } from './auth/auth-route-guard';
import { DateTimeService } from './timing/date-time.service';
import { AppLocalizationService } from '@app/shared/common/localization/app-localization.service';
import { ChangeProfilePictureModalComponent } from '@app/shared/layout/profile/change-profile-picture-modal.component';
import { ImageCropperModule} from 'ng2-img-cropper';
import { LoginComponent } from '@app/account/login/login.component';
import { RegisterComponent } from '@app/account/register/register.component';
import { SelectModule } from 'ng2-select';
import { RecaptchaModule } from 'ng-recaptcha';
import { RouterModule } from '@angular/router';
import { NotificationsComponent } from "app/shared/layout/notifications/notifications.component";
import { WorbbientWorbbyTaskActions } from '@app/worbbient/worbby-task/worbbient-task-actions.component';
import { SendReportModalComponent } from '@app/worbbior/page/send-report-modal.component';
import { SlickSliderComponent } from 'shared/slick-slider.component';

@NgModule({
    imports: [
        ngCommon.CommonModule,
        FormsModule,
        ModalModule.forRoot(),
        TooltipModule.forRoot(),
        UtilsModule,
        AbpModule,
        CommonModule,
        SelectModule,
        RecaptchaModule.forRoot(),
        ImageCropperModule,
        RouterModule
    ],
    declarations: [
        TimeZoneComboComponent,
        JqPluginDirective,
        CommonLookupModalComponent,
        DateRangePickerComponent,
        DatePickerComponent,
        ChangeProfilePictureModalComponent,
        LoginComponent,
        RegisterComponent,
        ComingSoonComponent,
        NotificationsComponent,
        WorbbientWorbbyTaskActions,
        SendReportModalComponent,
        SlickSliderComponent
    ],
    exports: [
        TimeZoneComboComponent,
        JqPluginDirective,
        CommonLookupModalComponent,
        DateRangePickerComponent,
        DatePickerComponent,
        ChangeProfilePictureModalComponent,
        LoginComponent,
        RegisterComponent,
        ComingSoonComponent,
        NotificationsComponent,
        WorbbientWorbbyTaskActions,
        SendReportModalComponent,
        SlickSliderComponent
    ],
    providers: [
        DateTimeService,
        AppLocalizationService
    ]
})
export class AppCommonModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: AppCommonModule,
            providers: [
                AppAuthService,
                AppRouteGuard
            ]
        }
    }
}