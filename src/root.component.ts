import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'app-root',
    templateUrl: './root.component.html'
    //template:  `<router-outlet></router-outlet>`
})
export class RootComponent extends AppComponentBase implements OnInit {

    public isAuthenticated:boolean = false;

    public constructor(injector: Injector) {
        super(injector);
    }

    ngOnInit(): void {
        if(abp.session.userId){
            this.isAuthenticated = true
        }

        let self = this;
        //this._loginService.init();
        
        $('head').append($('<link rel="stylesheet" type="text/css" />').attr('href', '/assets/metronic/worbby/global/plugin/slick/slick.css'));
        $('head').append($('<link rel="stylesheet" type="text/css" />').attr('href', '/assets/metronic/worbby/global/plugin/ng2-image-gallery.css'));
        $('head').append($('<link rel="stylesheet" type="text/css" />').attr('href', '/assets/metronic/worbby/global/css/themes.css'));

        $(document).on('click', '.close-nav', function (e) {
            //$('.btn-navbar').click();
            $('.navbar-toggle').click();
        });
    }
}