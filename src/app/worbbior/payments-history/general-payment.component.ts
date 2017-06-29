import { AppComponentBase } from "shared/common/app-component-base";
import { Component, AfterViewInit, Injector, ViewChild } from "@angular/core";
import { appModuleAnimation } from '@shared/animations/routerTransition';
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

    transferir(): void {

    }
}