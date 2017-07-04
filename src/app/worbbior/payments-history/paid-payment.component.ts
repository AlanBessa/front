import { AppComponentBase } from "shared/common/app-component-base";
import { Component, AfterViewInit, Injector } from "@angular/core";
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { DateFilter } from "shared/AppEnums";
import * as moment from "moment";
import 'moment/min/locales';

@Component({
    templateUrl: './paid-payment.component.html', 
    selector: 'paidPaymentWorbbiorComponent',
    animations: [appModuleAnimation()]
})

export class PaidPaymentWorbbiorComponent extends AppComponentBase implements AfterViewInit {

    public active: boolean = false;

    public filtroDataPago: DateFilter = new DateFilter(moment().startOf("day").subtract(30, "days"), moment().endOf("day"));

    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    ngOnInit() {
        moment.locale('pt-br');
    }

    ngAfterViewInit(): void {

    }    

    changePaymentType():void {
        
    }
}