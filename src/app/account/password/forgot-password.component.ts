import { Component, Injector, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AccountServiceProxy, SendPasswordResetCodeInput } from '@shared/service-proxies/service-proxies';
import { accountModuleAnimation } from '@shared/animations/routerTransition';

@Component({
    templateUrl: './forgot-password.component.html',
    animations: [accountModuleAnimation()]
})
export class ForgotPasswordComponent extends AppComponentBase {

    model: SendPasswordResetCodeInput = new SendPasswordResetCodeInput();

    saving: boolean = false;

    constructor (
        injector: Injector, 
        private _accountService: AccountServiceProxy,
        private _router: Router
        ) {
        super(injector);
    }

    ngOnDestroy(): void {
        
    }

    ngAfterViewInit(): void {
        $("body").scrollTop(0);
        $(".page-loading").hide();
    }

    save(): void {
        this.saving = true;
        this._accountService.sendPasswordResetCode(this.model)
            .finally(() => { this.saving = false; })
            .subscribe(() => {
                this.message.success(this.l('PasswordResetMailSentMessage'), this.l('MailSent')).done(() => {
                    this._router.navigate(['/login']);
                });
            });
    }
}