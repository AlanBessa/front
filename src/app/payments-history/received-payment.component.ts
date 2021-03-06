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
    selector: 'receivedPaymentComponent',
    animations: [appModuleAnimation()]
})

export class ReceivedPaymentComponent extends AppComponentBase implements AfterViewInit {

    public active: boolean = false;

    pager: any = {};

    public worbbyTasksSales: WorbbyTaskSaleDto[] = [];

    public notFound: boolean = false;

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

        this._saleService.getPaymentsByTargetUserId(abp.session.userId, undefined, this.filtroDataRecebidos.start, this.filtroDataRecebidos.end, undefined, AppConsts.maxResultCount, skipCount)
        .finally(() => { 

        })
        .subscribe(result => {
            this.worbbyTasksSales = result.items;
            this.pager.totalCount = result.totalCount;
            this.pager.currentPage = page;
            this.buildPager(Math.ceil(this.pager.totalCount/AppConsts.maxResultCount));  
            this.notFound = this.worbbyTasksSales.length == 0;
        }, error => {
            console.log(error);
        });
    }

    changePaymentType():void {
        
    }

    get totalPaymentsReceived():number{
        let total = 0;
        
        this.worbbyTasksSales.forEach(element => {
            total += element.balanceAvailable;
        });
        return total;
    }


    buildPager(total) {
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