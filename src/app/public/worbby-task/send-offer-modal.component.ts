import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { WorbbyTaskDto, WorbbyTaskServiceProxy, WorbbyOfferDto} from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { DayOfWeek } from '@shared/AppEnums';

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
        this.worbbyOffer.cancellationPolicy = 1;
        this.active = true;
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
}

