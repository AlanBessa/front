import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { BalanceTransferServiceProxy, BankAccountDto, RequestBalanceTransferInput, BankAccountServiceProxy, ListResultDtoOfBankAccountType, BankAccountType } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { UnitMeasure, CancellationPolicy, WorbbiorState } from '@shared/AppEnums';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { IAjaxResponse } from '@abp/abpHttp';

import * as _ from "lodash";

@Component({
    selector: 'confirmBalanceTransferModal',
    templateUrl: './confirm-balance-transfer-modal.component.html',
    styles: [
        `.user-edit-dialog-profile-image {
             margin-bottom: 20px;
        }`
    ]
})
export class ConfirmBalanceTransferModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal') modal: ModalDirective;
    @ViewChild('bankAccountTypeSelect') bankAccountTypeSelect: ElementRef;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    active: boolean = false;
    saving: boolean = false;
    public AppConsts: typeof AppConsts = AppConsts;

    balanceTransfer: RequestBalanceTransferInput;
    bankAccountTypes: BankAccountType[] = [];


    constructor(
        injector: Injector,
        private _appSessionService: AppSessionService,
        private _balanceTransferService: BalanceTransferServiceProxy,
        private _bankAccountService: BankAccountServiceProxy
    ) {
        super(injector);
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
       
    }

    show(balanceTransfer: RequestBalanceTransferInput): void {
        this.balanceTransfer = balanceTransfer;
        this.active = true;
        this.modal.show();
        this.getBankAccountTypes();
    }

    onShown(): void {
    }

    save(): void {
        this.saving = true;

        this._balanceTransferService.requestBalanceTransfer(this.balanceTransfer)
            .finally(() => {

            })
            .subscribe(() => {
                this.message.success(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
            }, error => {
                console.log(error);
                this.close();
            });
    }

    changeBank(value: number): void {
        this.balanceTransfer.bankAccount.bankAccountTypeId = value;
    }

    getBankAccountTypes(): void {
        let self = this;
        this._bankAccountService.getBankAccountTypes().subscribe((result: ListResultDtoOfBankAccountType) => {
            this.bankAccountTypes = result.items;
            setTimeout(() => {
                $(self.bankAccountTypeSelect.nativeElement).selectpicker('refresh');
            }, 0);
        });

    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}