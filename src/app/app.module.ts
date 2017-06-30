import { NgModule } from '@angular/core';
import * as ngCommon from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { ModalModule, TooltipModule, AccordionModule, ButtonsModule, RatingModule } from 'ngx-bootstrap';
import { FileUploadModule } from '@node_modules/ng2-file-upload';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderNotificationsComponent } from './shared/layout/notifications/header-notifications.component';
import { ChangePasswordModalComponent } from '@app/shared/layout/profile/change-password-modal.component';
import { MySettingsModalComponent } from '@app/shared/layout/profile/my-settings-modal.component';
import { AbpModule } from '@abp/abp.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { AppCommonModule } from './shared/common/app-common.module';
import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';
import { NotificationsComponent } from './shared/layout/notifications/notifications.component';
import { NotificationSettingsModalCompoent } from './shared/layout/notifications/notification-settings-modal.component';
import { UserNotificationHelper } from './shared/layout/notifications/UserNotificationHelper';

@NgModule({
    declarations: [
        AppComponent,
        HeaderNotificationsComponent,
        ChangePasswordModalComponent,
        MySettingsModalComponent,
        NotificationsComponent,
        NotificationSettingsModalCompoent
    ],
    imports: [
        ngCommon.CommonModule,
        FormsModule,
        HttpModule,
        JsonpModule,
        ModalModule.forRoot(),
        TooltipModule.forRoot(),
        AccordionModule.forRoot(),
        ButtonsModule.forRoot(), 
        FileUploadModule,
        AbpModule,
        AppRoutingModule,
        UtilsModule,
        AppCommonModule.forRoot(),
        ServiceProxyModule
    ],
    providers: [
        UserNotificationHelper,
    ]
})
export class AppModule { }
