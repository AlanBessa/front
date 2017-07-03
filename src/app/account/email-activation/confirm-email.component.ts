import { Component, Injector, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AccountServiceProxy, ActivateEmailInput } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/common/session/app-session.service';

@Component({
    template: `<p>{{waitMessage}}</p>`
})
export class ConfirmEmailComponent extends AppComponentBase implements OnInit {

    waitMessage: string;

    model: ActivateEmailInput = new ActivateEmailInput();

    endorsementId:number;
    endorsementUserId:number;

    constructor(
        injector: Injector,
        private _accountService: AccountServiceProxy,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _appSessionService: AppSessionService

    ) {
        super(injector);
    }

    ngAfterViewInit(): void {
        $("body").scrollTop(0);
    }

    ngOnInit(): void {
        this.waitMessage = this.l('PleaseWaitToConfirmYourEmailMessage');

        this.model.userId = this._activatedRoute.snapshot.queryParams["userId"];
        this.model.confirmationCode = this._activatedRoute.snapshot.queryParams["confirmationCode"];
        this.endorsementId = Number(this._activatedRoute.snapshot.queryParams["endorsementId"]);
        this.endorsementUserId = Number(this._activatedRoute.snapshot.queryParams["endorsementUserId"]);

        if (this._appSessionService.changeTenantIfNeeded(
            this.parseTenantId(
                this._activatedRoute.snapshot.queryParams["tenantId"]
            )
        )) {
            return;
        }

        this._accountService.activateEmail(this.model)
            .subscribe(() => {
                this.notify.success(this.l('YourEmailIsConfirmedMessage'));
                if(this.endorsementId != 0 && !isNaN(this.endorsementId)){
                    this._router.navigate(['/endosso' , {'endorsementId': this.endorsementId}]);
                }else if(this.endorsementUserId != 0 && !isNaN(this.endorsementUserId)){
                    this._router.navigate(['/endosso' , {'userId': this.endorsementUserId}]);
                }else{
                    this._router.navigate(['/login']);
                }
            });
    }


    parseTenantId(tenantIdAsStr?: string): number {
        let tenantId = !tenantIdAsStr ? undefined : parseInt(tenantIdAsStr);
        if (tenantId === NaN) {
            tenantId = undefined;
        }

        return tenantId;
    }
}