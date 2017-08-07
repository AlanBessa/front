import { AppComponentBase } from "shared/common/app-component-base";
import { Component, AfterViewInit, Injector } from "@angular/core";
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { DateFilter } from "shared/AppEnums";
import { SaleServiceProxy, WorbbyTaskSaleDto } from "shared/service-proxies/service-proxies";
import { AppConsts } from '@shared/AppConsts';
import * as moment from "moment";
import 'moment/min/locales';

@Component({
    templateUrl: './received-payment.component.html', 
    selector: 'receivedPaymentWorbbiorComponent',
    animations: [appModuleAnimation()]
})

export class ReceivedPaymentWorbbiorComponent extends AppComponentBase implements AfterViewInit {

    public active: boolean = false;

    pager: any = {};

    public worbbyTasksSales: WorbbyTaskSaleDto[] = [];

    public filtroDataRecebidos: DateFilter = new DateFilter(moment().startOf("day").subtract(30, "days"), moment().endOf("day"));

    constructor(
        injector: Injector,
        private _saleService: SaleServiceProxy,
    ) {
        super(injector);
    }

    ngOnInit() {
        moment.locale('pt-br');
        this.getPaymentsByTargetUserId(1);
    }

    ngAfterViewInit(): void {

    }

    getPaymentsByTargetUserId(page:number):void{

        var skipCount = AppConsts.maxResultCount * (page-1);

        this._saleService.getPaymentsByTargetUserId(abp.session.userId, this.filtroDataRecebidos.start, this.filtroDataRecebidos.end, AppConsts.maxResultCount, skipCount)
        .finally(() => { 

        })
        .subscribe(result => {
            this.worbbyTasksSales = result.items;
            // this.worbbyTasksSales.forEach(element => {
            //     element.worbbyTask.totalPrice;
            //     element.balanceAvailable
            //     element.balanceAvailableDate
            //     element.cancellationTax
            //     element.cancellationTaxAmount
            // });
        }, error => {
            console.log(error);
        });
    }

    changePaymentType():void {
        
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