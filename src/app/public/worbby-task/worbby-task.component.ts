import { Component, Injector, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { WorbbyTaskServiceProxy, WorbbyTaskDto } from '@shared/service-proxies/service-proxies';
import { Router, ActivatedRoute } from '@angular/router';
import { ScheduleDateType, UnitMeasure } from '@shared/AppEnums';
import { AppConsts } from '@shared/AppConsts';
import { SendOfferModalComponent } from './send-offer-modal.component';
import * as _ from 'lodash';
import * as moment from "moment";

@Component({
    templateUrl: './worbby-task.component.html',
    animations: [appModuleAnimation()]
})
export class WorbbyTaskComponent extends AppComponentBase implements AfterViewInit {

    @ViewChild('sendOfferModal') sendOfferModal: SendOfferModalComponent;

    public active: boolean = false;
    public worbbyTaskId: number;
    public worbbyTask: WorbbyTaskDto;
    public scheduleDateDisplay: string;

    public ScheduleDateType: typeof ScheduleDateType = ScheduleDateType;
    public UnitMeasure: typeof UnitMeasure = UnitMeasure;
    public AppConsts: typeof AppConsts = AppConsts;
    public isLogged:boolean = false;

    constructor(
        injector: Injector,
        private _activatedRoute: ActivatedRoute,
        private _worbbyTaskService: WorbbyTaskServiceProxy,
        private _router: Router
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.isLogged = abp.session.userId ? true : false;

        this.worbbyTaskId = this._activatedRoute.snapshot.params['worbbyTaskId'];

        this._worbbyTaskService.getWorbbyTask(this.worbbyTaskId).subscribe(result => {
            this.worbbyTask = result;

            this.scheduleDateDisplay = moment(result.creationTime).format('L');

            this.active = true;
        });

    }

    ngAfterViewInit(): void {
        $("body").scrollTop(0); 
    }

    openOfferModal():void {
        this.sendOfferModal.show(this.worbbyTask);
    }

    modalOfferSuccess():void{
        this.message.custom('Se sua oferta for aceita, você será notificado! Você também pode acompanha-la em seu perfil.', 'Oferta enviada!', 'assets/common/images/default-profile-picture.png').done(() => {
            this._router.navigate(['/worbbior/my-worbby']);
        });
    }
}