import { AppComponentBase } from "shared/common/app-component-base";
import { Component, AfterViewInit, Injector, ViewChild } from "@angular/core";
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { BankAccountDto, BankAccountServiceProxy, BalanceTransferOutput, EntityDtoOfInt64, ProfileServiceProxy, CurrentUserProfileEditDto, AddressServiceProxy, AddressDto, BalanceAvailableOutput, BalanceTransferServiceProxy, RequestBalanceTransferInput } from "shared/service-proxies/service-proxies";
import { BalanceTransferStatus } from "shared/AppEnums";
import * as _ from 'lodash';
import * as moment from "moment";
import 'moment/min/locales';
import { DateFilter } from "shared/AppEnums";
import { AppConsts } from '@shared/AppConsts';
import { ConfirmBalanceTransferModalComponent } from './confirm-balance-transfer-modal.component';

@Component({
    templateUrl: './general-payment.component.html', 
    selector: 'generalPaymentComponent',
    animations: [appModuleAnimation()]
})

export class GeneralPaymentComponent extends AppComponentBase implements AfterViewInit {

    @ViewChild('confirmBalanceTransferModal') confirmBalanceTransferModal: ConfirmBalanceTransferModalComponent;

    public active: boolean = false; 

    public filtroDataHistorico: DateFilter = new DateFilter(moment().startOf("day").subtract(30, "days"), moment().endOf("day"));
    public filterBalanceTransferDate: DateFilter = new DateFilter(moment().startOf("day").subtract(30, "days"), moment().endOf("day"));

    public BalanceTransferStatus: typeof BalanceTransferStatus = BalanceTransferStatus;

    public balanceTransfers:BalanceTransferOutput[] = [];
    public balanceAvailable:number;
    public transferId:number;
    public banckAccount:BankAccountDto;

    pager: any = {};

    constructor(
        injector: Injector,
        private _balanceTransferService: BalanceTransferServiceProxy,
        private _bankAccountServiceProxy: BankAccountServiceProxy
    ) {
        super(injector);
    }

    ngOnInit() {
        moment.locale('pt-br');
        this.getBankAccountByUserId();
        this.getBalanceAvailableByUserId();
        this.getBalanceTransfers(1);
        
    }

    ngAfterViewInit(): void {
    }

    requestBalanceModalReturn():void{
        this.getBankAccountByUserId();
        this.getBalanceAvailableByUserId();
        this.getBalanceTransfers(1);
    }

    getBankAccountByUserId():void{
        this._bankAccountServiceProxy.getBankAccountForRequestBalanceTransferfileByUserId(abp.session.userId)
        .finally(() => { 

         })
        .subscribe(result => {
            this.banckAccount = result;
            if (!this.banckAccount.userId) {
                this.banckAccount.userId = abp.session.userId;
            }
        }, error => {
            console.log(error);
        });
    }

    getBalanceAvailableByUserId():void{
        this._balanceTransferService.getBalanceAvailableByUserId(abp.session.userId)
        .finally(() => { 

         })
        .subscribe(result => {
            this.balanceAvailable = result.amount;
        }, error => {
            console.log(error);
        });
    }

    getBalanceTransfers(page):void{

        var skipCount = AppConsts.maxResultCount * (page-1);

        this._balanceTransferService.getBalanceTransfersByUserId(abp.session.userId, this.filterBalanceTransferDate.start, this.filterBalanceTransferDate.end, AppConsts.maxResultCount, skipCount)
        .finally(() => { 

         })
        .subscribe(result => {
            this.balanceTransfers = result.items;
            this.pager.totalCount = result.totalCount;
            this.pager.currentPage = page;
            this.buildPager(Math.ceil(this.pager.totalCount/AppConsts.maxResultCount));  
        }, error => {
            console.log(error);
        });
    }

    requestBalanceAvailable():void{
        var input = new RequestBalanceTransferInput();
        input.amount = this.balanceAvailable;
        input.userId = abp.session.userId;
        input.bankAccountId = this.banckAccount.id;
        input.bankAccount = this.banckAccount;
        input.bankAccount.bankAccountTypeId = this.banckAccount.bankAccountTypeId;

        this.confirmBalanceTransferModal.show(input);
    }

    get balanceTransfersTotal():number{
        let total = 0;
        
        this.balanceTransfers.forEach(element => {
            if(element.balanceTransfer.balanceTransferStatus != Number(BalanceTransferStatus.Canceled)){
                total += element.balanceTransfer.amount;
            }            
        });
        return total;
    }

    buildPager(total) {
        //Quantas casa para frente e para trás
        let range = 5;

        this.pager.totalPages = [];

        if(window.screen.width <= 500) {
            range = 1;
        }
        else if(window.screen.width <= 767) {
            range = 3;
        }
          
        let maxNumberPages = (range * 2) + 1;

        for (let i = 1; i <= total; i++) {

            if (1 != total && (!(i >= this.pager.currentPage + range + 1 || i <= this.pager.currentPage - range - 1) || total <= maxNumberPages)) {

                this.pager.totalPages.push(i);
            }
        }
    }
}