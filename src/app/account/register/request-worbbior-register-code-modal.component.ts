import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { RequestWorbbiorRegisterCodeEmailDto, WorbbiorServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { Angulartics2 } from 'angulartics2';
import * as _ from "lodash";

@Component({
    selector: 'requestWorbbiorRegisterCodeModal',
    templateUrl: './request-worbbior-register-code-modal.component.html',
    styles: [
        `.user-edit-dialog-profile-image {
             margin-bottom: 20px;
        }`
    ]
})
export class RequestWorbbiorRegisterCodeModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal') modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active: boolean = false;
    sending: boolean = false;
    public requestWorbbiorRegisterCodeEmailDto: RequestWorbbiorRegisterCodeEmailDto = new RequestWorbbiorRegisterCodeEmailDto();

    constructor(
        injector: Injector,
        private _worbbiorService: WorbbiorServiceProxy,
        private angulartics2: Angulartics2
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
        this._worbbiorService.requestWorbbiorRegisterCode(this.requestWorbbiorRegisterCodeEmailDto)
            .finally(() => {
                this.sending = false;
            })
            .subscribe(() => {
                this.angulartics2.eventTrack.next({ action: this.requestWorbbiorRegisterCodeEmailDto.name, properties: { category: 'Solicitação de código para cadastro', label:  this.requestWorbbiorRegisterCodeEmailDto.emailAddress}});
                this.notify.info("Solicitação enviada com sucesso, verifique seu e-mail!");
                this.CleanFields();
                this.close();
            });
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }

    CleanFields():void{
        this.requestWorbbiorRegisterCodeEmailDto.name = "";
        this.requestWorbbiorRegisterCodeEmailDto.emailAddress = "";
    }
}

