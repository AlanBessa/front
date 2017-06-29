import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppSessionService } from '@shared/common/session/app-session.service';
import * as moment from "moment";

@Component({
    templateUrl: './footer.component.html',
    selector: 'footer'
})
export class FooterComponent extends AppComponentBase implements OnInit {

    public anoDeCopyright: number;

    constructor(
        injector: Injector,
        public appSessionService: AppSessionService,
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.anoDeCopyright = moment().year();
    }
}