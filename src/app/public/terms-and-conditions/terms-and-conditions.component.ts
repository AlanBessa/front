import { Component, Injector, AfterViewInit, OnDestroy } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: './terms-and-conditions.component.html',
    animations: [appModuleAnimation()]
})
export class TermsAndConditionsComponent extends AppComponentBase implements AfterViewInit {

    constructor(
        injector: Injector,
        public activatedRoute: ActivatedRoute,
    ) {
        super(injector);
    }

    ngOnDestroy(): void {
        
    }

    ngAfterViewInit(): void {
        $("body").scrollTop(0);
        $(".page-loading").hide();
        this.activatedRoute.fragment.subscribe(f => {
            this.goTo(f);
        })   
    }
}