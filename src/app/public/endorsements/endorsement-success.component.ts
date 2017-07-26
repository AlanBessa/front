import { Component, Injector, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';

@Component({
    templateUrl: './endorsement-success.component.html',
    animations: [appModuleAnimation()]
})
export class EndorsementSuccessComponent extends AppComponentBase implements AfterViewInit {

    public filter:string;

    constructor(
        injector: Injector,
        private router: Router
    ) {
        super(injector);
    }

    ngAfterViewInit(): void {
        $("body").scrollTop(0);
        $(".page-loading").hide();
    }

    ngOnDestroy(): void {
        
    }

    findByTerm():void{
        this.router.navigate(['/find-a-talents-t', this.filter]);
    }
}