import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { WorbbyTaskDto, WorbbyTaskServiceProxy, WorbbyOfferDto} from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { ScheduleDateType, DayOfWeek, CancellationPolicy, WorbbyOfferStatus } from '@shared/AppEnums';
import * as moment from "moment"; 

import * as _ from "lodash";

@Component({
    selector: 'sendOfferModal',
    templateUrl: './send-offer-modal.component.html'
})
export class SendOfferModalComponent extends AppComponentBase implements OnInit {

    @ViewChild('createOrEditModal') modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    public worbbyOffer: WorbbyOfferDto;
    public active:boolean = false;
    public worbbyTask:WorbbyTaskDto;
    public showDataPicker:boolean = false;
    public scheduleDateDisplay:string = "Selecione uma data";
    public saving: boolean = false;
    public isMobile: boolean = false;

    CancellationPolicy: typeof CancellationPolicy = CancellationPolicy;
    WorbbyOfferStatus: typeof WorbbyOfferStatus = WorbbyOfferStatus;
    ScheduleDateType: typeof ScheduleDateType = ScheduleDateType;
    cancellationPolicyOptions: string[];
    currentCancellationPolicyOptions: string = "";

    public tooltipPoliticaCancelamento: string = "<strong>Superflexível:</strong> 100% de reembolso do valor da tarefa até 4 horas antes da hora prevista.<br /><br /> <strong>Flexível:</strong> 100% de reembolso do valor da tarefa até 24 horas antes da data prevista.<br /><br /> <strong>Moderada:</strong> 50% de reembolso do valor da tarefa até 48 horas da data prevista.<br /><br /> <strong>Rígida:</strong> 50% de reembolso do valor da tarefa até 5 dias (120 horas) antes da data prevista.";

    constructor(
        injector: Injector,
        private _worbbyTaskService: WorbbyTaskServiceProxy
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.isMobile = window.screen.width < 768;
    }

    show(worbbyTask: WorbbyTaskDto): void {
        this.worbbyTask = worbbyTask;
        var cancellationPolicyOptions = Object.keys(CancellationPolicy);
        this.cancellationPolicyOptions = cancellationPolicyOptions.slice(cancellationPolicyOptions.length / 2);
        this.currentCancellationPolicyOptions = this.cancellationPolicyOptions[0];        
        
        this.worbbyOffer = new WorbbyOfferDto();
        this.worbbyOffer.worbbyTaskId = worbbyTask.id;
        this.worbbyOffer.userId = abp.session.userId;
        this.worbbyOffer.worbbyOfferStatus = Number(WorbbyOfferStatus.Post);
        this.worbbyOffer.cancellationPolicy = CancellationPolicy[this.currentCancellationPolicyOptions];
        this.active = true;
        this.modal.show();
    }

    onShown(): void {
    }
   
    save(): void {  
        this.saving = true;

        this._worbbyTaskService.createOrUpdateWorbbyOffer(this.worbbyOffer).subscribe(result => {            
            this.modalSave.emit(null);
            this.saving = false;
            this.close();
        });
    }

    close(): void {
        this.modal.hide();
    }

    changeCancellationPolicy(name: string): void {
        this.currentCancellationPolicyOptions = name;
        this.worbbyOffer.cancellationPolicy = CancellationPolicy[name];
    }

    scheduleDateFixeClick():void {
        this.showDataPicker = this.showDataPicker ? false : true;        
    }

    scheduleDateDone(date):void {
        var currentDate = new Date();
        currentDate.setHours(0,0,0,0)
        //console.log(event);
        if(date < currentDate){
            this.message.error("Selecione um data igual ou posterior à data atual.", "Data inválida!")
        }else{
            this.scheduleDateDisplay = moment(date).format('L');
            this.showDataPicker = false;
        }
    }
}

