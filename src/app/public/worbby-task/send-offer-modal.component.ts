import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { WorbbyTaskDto, WorbbyTaskServiceProxy, WorbbyOfferDto} from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { DayOfWeek, CancellationPolicy, WorbbyOfferStatus } from '@shared/AppEnums';

import * as _ from "lodash";

@Component({
    selector: 'sendOfferModal',
    templateUrl: './send-offer-modal.component.html'
})
export class SendOfferModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal') modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    public worbbyOffer: WorbbyOfferDto;
    public active:boolean = false;

    CancellationPolicy: typeof CancellationPolicy = CancellationPolicy;
    WorbbyOfferStatus: typeof WorbbyOfferStatus = WorbbyOfferStatus;
    cancellationPolicyOptions: string[];
    currentCancellationPolicyOptions: string = "";

    public tooltipPoliticaCancelamento: string = "Você é quem decide qual será o valor a ser devolvido ao cliente (worbbient) caso a tarefa contratada seja cancelada por ele. Escolha uma das opções:<br /><br /> <strong>Superflexível:</strong> 100% de reembolso do valor da tarefa até 4 horas antes da hora prevista.<br /><br /> <strong>Flexível:</strong> 100% de reembolso do valor da tarefa até 24 horas antes da data prevista.<br /><br /> <strong>Moderada:</strong> 50% de reembolso do valor da tarefa até 48 horas da data prevista.<br /><br /> <strong>Rígida:</strong> 50% de reembolso do valor da tarefa até 5 dias (120 horas) antes da data prevista.";

    constructor(
        injector: Injector,
        private _worbbyTaskService: WorbbyTaskServiceProxy
    ) {
        super(injector);
    }

    show(worbbyTask: WorbbyTaskDto): void {
        this.worbbyOffer = new WorbbyOfferDto();
        this.worbbyOffer.worbbyTaskId = worbbyTask.id;
        this.worbbyOffer.userId = abp.session.userId;
        this.worbbyOffer.worbbyOfferStatus = Number(WorbbyOfferStatus.Post);
        this.active = true;
        var cancellationPolicyOptions = Object.keys(CancellationPolicy);
        this.cancellationPolicyOptions = cancellationPolicyOptions.slice(cancellationPolicyOptions.length / 2);
        this.currentCancellationPolicyOptions = this.cancellationPolicyOptions[0];


        this.modal.show();
    }


    onShown(): void {
    }
   
    save(): void {  
        this._worbbyTaskService.createOrUpdateWorbbyOffer(this.worbbyOffer).subscribe(result => {            
            this.modalSave.emit(null);
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
}

