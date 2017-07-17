import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { WorbbyTaskDto, WorbbyTaskServiceProxy, WorbbyOfferDto} from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { ScheduleDateType, DayOfWeek } from '@shared/AppEnums';
import * as moment from "moment"; 
import { Router } from '@angular/router';
import * as _ from "lodash";

@Component({
    selector: 'worbbiorTaskScheduleDateModal',
    templateUrl: './worbbior-task-scheduledate-modal.component.html',
    styles: [
        `.user-edit-dialog-profile-image {
             margin-bottom: 20px;
        }`
    ]
})
export class WorbbiorScheduleDateModalComponent extends AppComponentBase {

    @ViewChild('scheduleDateModal') modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    public worbbyOffer: WorbbyOfferDto;
    public active:boolean = false;
    public worbbyTask:WorbbyTaskDto;
    public showDataPicker:boolean = false;
    public scheduleDateDisplay:string = "Selecione uma data";

    ScheduleDateType: typeof ScheduleDateType = ScheduleDateType;

    constructor(
        injector: Injector,
        private _worbbyTaskService: WorbbyTaskServiceProxy,
        private _router: Router,
    ) {
        super(injector);
    }

    show(worbbyTask: WorbbyTaskDto): void {
        this.worbbyTask = worbbyTask;
        this.active = true;
        this.modal.show();
    }


    onShown(): void {
    }
   
    save(): void {  
        this._worbbyTaskService.worbbyTaskProposalAcceptedByWorbbior(this.worbbyTask)
        .finally(() => {
        })
        .subscribe(() => {
            this.message.custom('', 'Proposta aceita com sucesso!', 'assets/common/images/icon-dove@2x.png').done(() => {
                this.modalSave.emit(null);
                this.close();
            });
        });
    }

    close(): void {
        this.modal.hide();
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

