import { Component, Injector, AfterViewInit, OnDestroy } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AccordionConfig } from 'ngx-bootstrap/accordion';
import { ActivatedRoute } from '@angular/router';
import { Angulartics2 } from 'angulartics2';
import { AppSessionService } from "shared/common/session/app-session.service";

export function getAccordionConfig(): AccordionConfig {
  return Object.assign(new AccordionConfig(), {closeOthers: true});
}

@Component({
    templateUrl: './faq.component.html',
    animations: [appModuleAnimation()],
    providers: [{provide: AccordionConfig, useFactory: getAccordionConfig}]
})
export class FaqComponent extends AppComponentBase implements AfterViewInit {

    tab:string;

    constructor(
        injector: Injector,
        private _activatedRoute: ActivatedRoute,
        private _appSessionService: AppSessionService,
        private angulartics2: Angulartics2
    ) {
        super(injector);
    }

    ngAfterViewInit(): void {
        $("body").scrollTop(0);
        $(".page-loading").hide();

        this.activatedRoute.fragment.subscribe(f => {
            this.goToFaqItem(f);
        })
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

    goToFaqItem(item:string): void {
        this.goTo(item);

        var heightMenu = $('header').outerHeight();

        $("accordion #" + item + " .accordion-toggle").click();            
        $("body").animate({scrollTop: $("accordion #" + item + " .accordion-toggle").offset().top - heightMenu},'slow');
    }
}