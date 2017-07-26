import { Component, Injector, AfterViewInit, OnDestroy } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Router } from '@angular/router';

@Component({
    templateUrl: './messages.component.html',
    animations: [appModuleAnimation()]
})
export class MessagesWorbbientComponent extends AppComponentBase implements AfterViewInit {

    public filter:string;
    constructor(
        injector: Injector,
        private router: Router
    ) {
        super(injector);
    }

    ngOnDestroy(): void {
        
    }

    ngAfterViewInit(): void {
        $("body").scrollTop(0);
        $(".page-loading").hide();
    }

    findByTerm(): void {
        this.router.navigate(['/find-a-talents-t', this.filter]);
    }
}