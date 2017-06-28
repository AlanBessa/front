import { Component, ViewChild, Injector, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { ReportEmailDto, WorbbiorServiceProxy, ReportWorbbintEmailDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import * as _ from "lodash";

@Component({
    selector: 'sendReportModal',
    templateUrl: './send-report-modal.component.html',
    styles: [
        `.user-edit-dialog-profile-image {
             margin-bottom: 20px;
        }`
    ]
})
export class SendReportModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal') modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @Input() inputId: number; 
    @Input() inputType: string; 
    @Input() inputIdTask: number;

    active: boolean = false;
    sending: boolean = false;
    public reportEmailDto: ReportEmailDto = new ReportEmailDto();
    public reportWorbbientEmailDto: ReportWorbbintEmailDto = new ReportWorbbintEmailDto();
    public worbbyId: number;

    constructor(
        injector: Injector,
        private _worbbiorService: WorbbiorServiceProxy,
    ) {
        super(injector);
    }

    show(): void {
        this.active = true;
        this.modal.show();
    }

    onShown(): void {
    }

    save(): void {
        this.sending = true;
        if(this.inputType == "worbbior") {
            this.reportEmailDto.emailNotification = AppConsts.contactEmail;
            this.reportEmailDto.worbbiorID =  this.inputId;
            this._worbbiorService.reportEmailWorbbior(this.reportEmailDto)
                .finally(() => {
                    this.sending = false;
                })
                .subscribe(() => {
                    this.notify.info(this.l('MessageSendSuccessfully'));
                    this.CleanFields();
                    this.close();
                });
        }
        else {
            this.reportWorbbientEmailDto.emailNotification = AppConsts.contactEmail;
            this.reportWorbbientEmailDto.worbbiorID = abp.session.userId;
            this.reportWorbbientEmailDto.reason = this.reportEmailDto.reason;
            this.reportWorbbientEmailDto.reportedWorbbientID = this.inputId;
            this.reportWorbbientEmailDto.taskId = this.inputIdTask;
            this._worbbiorService.reportEmailWorbbient(this.reportWorbbientEmailDto)
                .finally(() => {
                    this.sending = false;
                })
                .subscribe(() => {
                    this.notify.info(this.l('MessageSendSuccessfully'));
                    this.CleanFields();
                    this.close();
                });
        }
        
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }

    CleanFields():void{
        this.reportEmailDto.name = "";
        this.reportEmailDto.emailAddress = "";
        this.reportEmailDto.reason = "";
    }
}

