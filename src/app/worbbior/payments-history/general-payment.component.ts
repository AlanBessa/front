import { AppComponentBase } from "shared/common/app-component-base";
import { Component, AfterViewInit, Injector, ViewChild } from "@angular/core";
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { BalanceTransferOutput, EntityDtoOfInt64, ProfileServiceProxy, CurrentUserProfileEditDto, AddressServiceProxy, AddressDto, BalanceAvailableOutput, BalanceTransferServiceProxy, RequestBalanceTransferInput } from "shared/service-proxies/service-proxies";
import { BalanceTransferStatus } from "shared/AppEnums";
import * as _ from 'lodash';
import * as moment from "moment";
import 'moment/min/locales';
import { DateFilter } from "shared/AppEnums";

@Component({
    templateUrl: './general-payment.component.html', 
    selector: 'generalPaymentWorbbiorComponent',
    animations: [appModuleAnimation()]
})

export class GeneralPaymentWorbbiorComponent extends AppComponentBase implements AfterViewInit {

    public active: boolean = false; 

    public filtroDataHistorico: DateFilter = new DateFilter(moment().startOf("day").subtract(30, "days"), moment().endOf("day"));
    public filtroDataTransferencia: DateFilter = new DateFilter(moment().startOf("day").subtract(30, "days"), moment().endOf("day"));

    public BalanceTransferStatus: typeof BalanceTransferStatus = BalanceTransferStatus;

    public balanceTransfers:BalanceTransferOutput[] = [];
    public balanceAvailable:number;
    public transferId:number;

    constructor(
        injector: Injector,
        private _balanceTransferService: BalanceTransferServiceProxy
    ) {
        super(injector);
    }

    ngOnInit() {
        moment.locale('pt-br');

        this._balanceTransferService.getBalanceAvailableByUserId(abp.session.userId)
        .finally(() => { 

         })
        .subscribe(result => {
            this.balanceAvailable = result.amount;
        }, error => {
            console.log(error);
        });

        this._balanceTransferService.getBalanceTransfersByUserId(abp.session.userId)
        .finally(() => { 

         })
        .subscribe(result => {
            this.balanceTransfers = result.items;
            console.log(this.balanceTransfers);
        }, error => {
            console.log(error);
        });
    }

    ngAfterViewInit(): void {
    }

    requestBalanceAvailable():void{
        var input = new RequestBalanceTransferInput();
        input.amount = this.balanceAvailable;
        input.userId = abp.session.userId;
        input.bankAccountId = 1;

        this._balanceTransferService.requestBalanceTransfer(input)
        .finally(() => { 

         })
        .subscribe(result => {
        }, error => {
            console.log(error);
        });
    }


    testConfirmRequest():void{

        this._balanceTransferService.confirmBalanceTransfer(new EntityDtoOfInt64({id: this.transferId}))
        .finally(() => { 

         })
        .subscribe(result => {
        }, error => {
            console.log(error);
        });
    }

    testCancelRequest():void{
        this._balanceTransferService.cancelBalanceTransfer(new EntityDtoOfInt64({id: this.transferId}))
        .finally(() => { 

         })
        .subscribe(result => {
        }, error => {
            console.log(error);
        });
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
}