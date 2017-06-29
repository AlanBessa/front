import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppSessionService } from '@shared/common/session/app-session.service';

@Component({
    templateUrl: './side-menu.component.html',
    selector: 'side-menu'
})
export class SideMenuComponent extends AppComponentBase implements OnInit {

    constructor(
        injector: Injector,
        public appSessionService: AppSessionService,
    ) {
        super(injector);
    }

    ngOnInit(): void {
    }
}