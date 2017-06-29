import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers } from '@angular/http';
import { TokenAuthServiceProxy, AuthenticateModel, AuthenticateResultModel } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { LoginService, ExternalLoginProvider } from './login.service';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AbpSessionService } from '@abp/session/abp-session.service';

@Component({
    selector: 'loginComponent',
    templateUrl: './login.component.html',
    animations: [accountModuleAnimation()]
})
export class LoginComponent extends AppComponentBase {

    submitting: boolean = false;

    constructor(
        injector: Injector,
        public loginService: LoginService,
        private _router: Router,
        private _sessionService: AbpSessionService
    ) {
        super(injector);
    }

    ngAfterViewInit(): void {
        $("body").scrollTop(0);
    }

    get multiTenancySideIsTeanant(): boolean {
        return this._sessionService.tenantId > 0;
    }

    get isSelfRegistrationAllowed(): boolean {
        if (!this._sessionService.tenantId) {
            return false;
        }

        return this.setting.getBoolean('App.UserManagement.AllowSelfRegistration');
    }

    login(): void {
        this.submitting = true;
        this.loginService.authenticate(
            () => this.submitting = false
        );
    }

    externalLogin(provider: ExternalLoginProvider) {
        this.submitting = true;
        this.loginService.externalAuthenticate(provider, null, null, null,() => this.submitting = false);
    }
}