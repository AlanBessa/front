import { Injector, Component, ViewContainerRef, OnInit, ViewEncapsulation } from '@angular/core';
import { PublicModule } from './public.module';
import { LoginService } from './login/login.service';
import { AppConsts } from '@shared/AppConsts';
import { MetaService } from '@nglibs/meta';
import { Angulartics2GoogleAnalytics } from 'angulartics2';
import { Router} from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';

import * as moment from 'moment';

@Component({
    selector: 'app-root',
    templateUrl: './public.component.html',
    styleUrls: [
        './public.component.less'
    ],
    encapsulation: ViewEncapsulation.None
})
export class PublicComponent extends AppComponentBase implements OnInit {

    private viewContainerRef: ViewContainerRef;

    currentYear: number = moment().year();

    public constructor(
        injector: Injector,
        private _loginService: LoginService,
        viewContainerRef: ViewContainerRef,
        private readonly meta: MetaService,
        angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
        private _router: Router,
    ) {
        super(injector);
        this.viewContainerRef = viewContainerRef; // We need this small hack in order to catch application root view container ref for modals
    }

    showTenantChange(): boolean {
        return abp.multiTenancy.isEnabled && !this.supportsTenancyNameInUrl();
    }

    ngOnInit(): void {
        let self = this;
        this._loginService.init();
        $('head').append($('<link rel="stylesheet" type="text/css" />').attr('href', '/assets/metronic/worbby/global/plugin/slick/slick.css'));
        $('head').append($('<link rel="stylesheet" type="text/css" />').attr('href', '/assets/metronic/worbby/global/plugin/ng2-image-gallery.css'));
        $('head').append($('<link rel="stylesheet" type="text/css" />').attr('href', '/assets/metronic/worbby/global/css/themes.css'));

        $(document).on('click', '.close-nav', function (e) {
            //$('.btn-navbar').click();
            $('.navbar-toggle').click();
        });

        $('.btn-landing-login').click(function() {
            self._router.navigate(['/entrar']);
            self.setTheme();
        });

        $('.btn-landing-cadastro').click(function() {
            self._router.navigate(['/registrar/Worbbior']);
            self.setTheme();
        });
    }

    private supportsTenancyNameInUrl() {
        return (AppConsts.appBaseUrlFormat && AppConsts.appBaseUrlFormat.indexOf(AppConsts.tenancyNamePlaceHolderInUrl) >= 0);
    }
}
