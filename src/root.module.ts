import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, Injector, APP_INITIALIZER } from '@angular/core';

import { AbpModule, ABP_HTTP_PROVIDER } from '@abp/abp.module';

import { ModalModule, TooltipModule, AccordionModule, ButtonsModule, RatingModule } from 'ngx-bootstrap';

import { AccoutModule } from './app/account/account.module';
import { PublicModule } from '@app/public/public.module';
import { CommonModule } from '@shared/common/common.module';
import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';
import { RootRoutingModule } from './root-routing.module';

import { FormsModule } from '@angular/forms';

import { HttpModule, JsonpModule } from '@angular/http';

import { AppConsts } from '@shared/AppConsts';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { API_BASE_URL } from '@shared/service-proxies/service-proxies';

import { RootComponent } from './root.component';
import { AppPreBootstrap } from './AppPreBootstrap';

import { UrlHelper } from '@shared/helpers/UrlHelper';
import { AppAuthService } from '@app/shared/common/auth/app-auth.service';

import { FooterComponent } from '@app/shared/layout/footer.component';
import { HeaderComponent } from '@app/shared/layout/header.component';
import { MenuComponent } from '@app/shared/layout/menu.component';
import { AppHeaderComponent } from '@app/shared/layout/app-header.component';
import { SendReportModalComponent } from '@app/worbbior/page/send-report-modal.component';
import { FeedbackComponent } from "shared/feedback/feedback.component";
import { ChangePasswordModalComponent } from '@app/shared/layout/profile/change-password-modal.component';
import { Angulartics2Module, Angulartics2GoogleAnalytics, Angulartics2Facebook } from 'angulartics2';
import { MetaModule } from '@nglibs/meta';
import { NotificationSettingsModalCompoent } from '@app/shared/layout/notifications/notification-settings-modal.component';
import { HeaderNotificationsComponent } from '@app/shared/layout/notifications/header-notifications.component';
import { NotificationsComponent } from '@app/shared/layout/notifications/notifications.component';
import { UserNotificationHelper } from '@app/shared/layout/notifications/UserNotificationHelper';
import { MessageSignalrService } from '@app/shared/common/message/message-signalr.service'


import { UtilsModule } from '@shared/utils/utils.module';

export function appInitializerFactory(injector: Injector) {
    return () => {
        abp.ui.setBusy();

        handleLogoutRequest(injector.get(AppAuthService));

        return new Promise<boolean>((resolve, reject) => {
            AppPreBootstrap.run(() => {
                var appSessionService: AppSessionService = injector.get(AppSessionService);
                appSessionService.init().then(
                    (result) => {

                        //Css classes based on the layout
                        if (abp.session.userId) {
                            $('body').attr('class', 'page-md page-header-fixed page-sidebar-closed-hide-logo');
                        } else {
                            $('body').attr('class', 'page-md login');
                        }

                        //tenant specific custom css
                        if (appSessionService.tenant && appSessionService.tenant.customCssId) {
                            $('head').append('<link id="TenantCustomCss" href="' + AppConsts.remoteServiceBaseUrl + '/TenantCustomization/GetCustomCss?id=' + appSessionService.tenant.customCssId + '" rel="stylesheet"/>');
                        }

                        abp.ui.clearBusy();
                        resolve(result);
                    },
                    (err) => {
                        abp.ui.clearBusy();
                        reject(err);
                    }
                );
            });
        });
    }
}

export function getRemoteServiceBaseUrl(): string {
    return AppConsts.remoteServiceBaseUrl;
}

function handleLogoutRequest(authService: AppAuthService) {
    var currentUrl = UrlHelper.initialUrl;
    var returnUrl = UrlHelper.getReturnUrl();
    if (currentUrl.indexOf(('account/logout')) >= 0 && returnUrl) {
        authService.logout(true, returnUrl);
    }
}

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        CommonModule.forRoot(),
        PublicModule,
        AbpModule,
        ServiceProxyModule,
        RootRoutingModule,
        ModalModule.forRoot(),
        TooltipModule.forRoot(),
        AccordionModule.forRoot(),
        ButtonsModule.forRoot(), 
        RatingModule.forRoot(),
        FormsModule,
        HttpModule,
        JsonpModule,
        UtilsModule,
        Angulartics2Module.forRoot([ Angulartics2GoogleAnalytics, Angulartics2Facebook ]),
        MetaModule.forRoot()
    ],
    declarations: [
        RootComponent,
        FooterComponent,
        HeaderComponent,
        AppHeaderComponent,
        SendReportModalComponent,
        FeedbackComponent,
        ChangePasswordModalComponent,
        MenuComponent,
        NotificationSettingsModalCompoent,
        HeaderNotificationsComponent,
        NotificationsComponent
    ],
    exports: [
        MenuComponent,
        ChangePasswordModalComponent,
        NotificationSettingsModalCompoent,
        HeaderNotificationsComponent,
        NotificationsComponent
    ],
    providers: [
        MessageSignalrService,
        UserNotificationHelper,
        ABP_HTTP_PROVIDER,
        { provide: API_BASE_URL, useFactory: getRemoteServiceBaseUrl },
        {
            provide: APP_INITIALIZER,
            useFactory: appInitializerFactory,
            deps: [Injector],
            multi: true
        }
    ],
    bootstrap: [RootComponent]
})
export class RootModule {

}