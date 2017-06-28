import { Component, Injector, AfterViewInit, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppConsts } from '@shared/AppConsts';
import * as _ from 'lodash';

@Component({
    templateUrl: './talent-questionnaire.component.html',
    animations: [appModuleAnimation()]
})
export class TalentQuestionnaireComponent extends AppComponentBase implements AfterViewInit {

    public question1: string = "";
    public question1_1: string = "";
    public question2: string = "";
    
    constructor(
        injector: Injector,
        private _activatedRoute: ActivatedRoute,
        private _router: Router
    ) {
        super(injector);
    }

    ngOnInit() {
        
    }

    ngAfterViewInit(): void {
        $("body").scrollTop(0);
    }
}