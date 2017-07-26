import { Component, Injector, AfterViewInit, OnDestroy } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AccordionConfig } from 'ngx-bootstrap/accordion';
import { Angulartics2 } from 'angulartics2';
import { AppSessionService } from "shared/common/session/app-session.service";

export function getAccordionConfig(): AccordionConfig {
  return Object.assign(new AccordionConfig(), {closeOthers: true});
}

@Component({
    templateUrl: './insurance.component.html',
    animations: [appModuleAnimation()]
})

export class InsuranceComponent extends AppComponentBase implements AfterViewInit {

    public tab: string;

    public active: boolean = false;

    constructor(
        injector: Injector,
        private _appSessionService: AppSessionService,
        private angulartics2: Angulartics2
    ) {
        super(injector);
    }

    ngAfterViewInit(): void {
        $("body").scrollTop(0);
        $(".page-loading").hide();

        if(this.tab){
            $("accordion #" + this.tab + " .accordion-toggle").click();            
            $("body").animate({scrollTop: $("accordion #" + this.tab + " .accordion-toggle").offset().top + 100},'slow');
        }
    }

    ngOnDestroy(): void {
        
    }

    public callAnalytics(question: string): void {

        let info = "Pergunta: " + question;

        this.angulartics2.eventTrack.next({ 
            action: info, 
            properties: { category: 'FAQ Geral', 
            label: this._appSessionService.user ? this._appSessionService.user.emailAddress : "Anonimo" } 
        });
    }
}