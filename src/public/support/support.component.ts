import { Component, Injector, AfterViewInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';

@Component({
    templateUrl: './support.component.html',
    animations: [appModuleAnimation()]
})
export class SupportComponent extends AppComponentBase implements AfterViewInit {

    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    ngAfterViewInit(): void {
        $("body").scrollTop(0);
    }
}