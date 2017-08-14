import { Component, Injector, AfterViewInit, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { WorbbyTaskServiceProxy, WorbbyTaskDto, WorbbiorProfileDto } from '@shared/service-proxies/service-proxies';
import { Router, ActivatedRoute } from '@angular/router';
import { TimeEnum, ScheduleDateType, UnitMeasure } from '@shared/AppEnums';
import { AppConsts } from '@shared/AppConsts';
import { SendOfferModalComponent } from './send-offer-modal.component';
import * as _ from 'lodash';
import * as moment from "moment";
import { Angulartics2 } from 'angulartics2';
import { MetaService } from '@nglibs/meta';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
declare const FB: any;

@Component({
    templateUrl: './worbby-task.component.html',
    animations: [appModuleAnimation()]
})
export class WorbbyTaskComponent extends AppComponentBase implements AfterViewInit {

    @ViewChild('sendOfferModal') sendOfferModal: SendOfferModalComponent;

    public active: boolean = false;
    public showRegisterOrLogin:boolean = false;
    public worbbyTaskId: number;
    public worbbyTask: WorbbyTaskDto;
    public scheduleDateDisplay: string; 
    public worbbiorProfile: WorbbiorProfileDto;

    public ScheduleDateType: typeof ScheduleDateType = ScheduleDateType;
    public UnitMeasure: typeof UnitMeasure = UnitMeasure;
    public TimeEnum: typeof TimeEnum = TimeEnum;
    public AppConsts: typeof AppConsts = AppConsts;
    public isLogged:boolean = false;
    public isMobile: boolean = false;
    public whatsappLink:SafeUrl = "";

    constructor(
        injector: Injector,
        private _activatedRoute: ActivatedRoute,
        private _worbbyTaskService: WorbbyTaskServiceProxy,
        private _router: Router,
        private angulartics2: Angulartics2,
        private metaService: MetaService,
        private sanitizer:DomSanitizer,
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.isLogged = abp.session.userId ? true : false;

        this.worbbyTaskId = this._activatedRoute.snapshot.params['worbbyTaskId'];

        this._worbbyTaskService.getWorbbyTask(this.worbbyTaskId).subscribe(result => {
            this.worbbyTask = result;

            this.scheduleDateDisplay = result.scheduledDate ? moment(result.scheduledDate).format('DD/MM/YYYY') : null;

            this.active = true;

            this.whatsappLink = this.sanitizer.bypassSecurityTrustUrl("whatsapp://send?text=" + this.worbbyTask.title + " - " + AppConsts.appBaseUrl + "/publico/worbby-task/" + this.worbbyTask.id); 

            this.metaService.setTitle(this.worbbyTask.title);
            this.metaService.setTag("og:description", this.worbbyTask.description);
            this.metaService.setTag("og:image", AppConsts.appBaseUrl + '/assets/metronic/worbby/global/img/Tarefa-na-worbby-facebook.jpg');
            this.metaService.setTag("og:title", this.worbbyTask.title);
            this.metaService.setTag("og:url", AppConsts.appBaseUrl + "/publico/worbby-task/" + this.worbbyTask.id);
        });

        this.isMobile = window.screen.width < 768;
    }

    ngOnDestroy(): void {
        
    }

    ngAfterViewInit(): void {
        $("body").scrollTop(0);
        $(".page-loading").hide();
    }

    openOfferModal():void {
        if(abp.session.userId){
            this.sendOfferModal.show(this.worbbyTask);
        }else{
            this.showRegisterOrLogin = true;
        }
    }

    modalOfferSuccess():void{
        this.message.custom('Se sua oferta for aceita, você receberá uma notificação. Acompanhe as ofertas feitas para a sua tarefa em Meu Worbby.', 'Oferta enviada!', 'assets/common/images/default-profile-picture.png').done(() => {
            this._router.navigate(['/worbbior/my-worbby']);
        });
    }

    sharedFacebook():void {
        FB.ui({
            method: 'feed',
            link: AppConsts.appBaseUrl + "/publico/worbby-task/" + this.worbbyTask.id,
            picture: AppConsts.appBaseUrl + '/assets/metronic/worbby/global/img/Tarefa-na-worbby-facebook.jpg',
            name: this.worbbyTask.title,
            description: this.worbbyTask.description
        }, function(response){
            console.log(response);
        });

        this.angulartics2.eventTrack.next({ 
            action: 'Compartilharmento de tarefa', 
            properties: { category: 'Facebook', 
            label: AppConsts.appBaseUrl + "/publico/worbby-task/" + this.worbbyTask.id } 
        });
    }

    shareButtonClick(name:string):void{
        this.angulartics2.eventTrack.next({ 
            action: 'Compartilharmento de tarefa', 
            properties: { category: name, 
            label: AppConsts.appBaseUrl + "/publico/worbby-task/" + this.worbbyTask.id } 
        });
    }
}