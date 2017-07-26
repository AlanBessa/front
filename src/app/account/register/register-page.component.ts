import { Component, Injector, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProfileServiceProxy } from '@shared/service-proxies/service-proxies'
import { AppComponentBase } from '@shared/common/app-component-base';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AbpSessionService } from '@abp/session/abp-session.service';
import { AppConsts } from '@shared/AppConsts';

@Component({
    templateUrl: './register-page.component.html',
    animations: [accountModuleAnimation()]
})
export class RegisterPageComponent extends AppComponentBase implements OnInit {

    roleName: string;
    active:boolean = false;
    constructor(
        injector: Injector,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
    ) {
        super(injector);
        
    }

    ngOnInit() {
        this.roleName = this._activatedRoute.snapshot.params['roleName'];
        this.active = true;
    }

    ngOnDestroy(): void {
        
    }

    ngAfterViewInit(): void {
        $("body").scrollTop(0);
        $(".page-loading").hide();
    }

    back(): void {
        this._router.navigate(['/login']);
    }
}