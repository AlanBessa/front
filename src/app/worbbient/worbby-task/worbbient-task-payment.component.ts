import { Component, Injector, AfterViewInit, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';

import { 
    WorbbyTaskServiceProxy, 
    WorbbyTaskDto,
    CieloServiceProxy, 
    CieloSaleInput, 
    CieloSaleOutput, 
    PaymentDto, 
    CreditCardDto,
    CustomerDto
} from '@shared/service-proxies/service-proxies';

import { Router, ActivatedRoute } from '@angular/router';
import { ScheduleDateType, UnitMeasure, WorbbyTaskMessageSide, WorbbyTaskMessageReadState, KeyValueAddress } from '@shared/AppEnums';
import { MessageSignalrService } from '@app/shared/common/message/message-signalr.service';
import { AppConsts } from '@shared/AppConsts';
import * as _ from 'lodash';
import * as moment from "moment"
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CustomValidator } from '@shared/utils/validation/custom-validator.directive';
import { SelectModule } from 'ng2-select';

@Component({
    templateUrl: './worbbient-task-payment.component.html',
    animations: [appModuleAnimation()]
})

export class WorbbientTaskPaymentComponent extends AppComponentBase implements AfterViewInit {
    
    @ViewChild('btnScheduleDateType1') btnScheduleDateType1;
    @ViewChild('btnScheduleDateType2') btnScheduleDateType2;

    public saving:boolean = false;
    public active:boolean = false;

    public worbbyTask:WorbbyTaskDto;    
    public worbbyTaskId:number;

    public sale = new CieloSaleInput();

    public month:  Array<KeyValueAddress> = [];
    public year:  Array<KeyValueAddress> = [];
    public monthList: Array<KeyValueAddress> = [];
    public yearList: Array<KeyValueAddress> = [];

    public form: FormGroup;

    constructor(
        injector: Injector,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private fb: FormBuilder,
        private _worbbyTaskService: WorbbyTaskServiceProxy,
        private _cieloService: CieloServiceProxy
    ) {
        super(injector);

        this.form = this.fb.group({
            brand: ['', Validators.compose([
                Validators.required
            ])],
            cardNumber: ['', Validators.compose([
                Validators.required,
                CustomValidator.OnlyNumberValidator
            ])],
            nomeCard: ['', Validators.compose([
                Validators.minLength(6),
                Validators.required
            ])],
            securityCode: ['', Validators.compose([
                Validators.minLength(3),
                Validators.maxLength(3),
                Validators.required
            ])]
        });
    }

    ngOnInit(): void {
        this.worbbyTaskId = Number(this._activatedRoute.snapshot.params['worbbyTaskId']);        
    }

    ngAfterViewInit(): void {
        $("body").scrollTop(0);  

        this.getMonths();
        this.getYears();
        this.getWorbbyTask();
    }

    // capturePayment():void{        
    //     this._cieloService.capturePaymentTransaction(this.worbbyTask.id)
    //     .finally(() => {
    //         console.log("teste");
    //     })
    //     .subscribe((result) => {
    //         console.log(result);
    //     });
    // }
    
    getMonths(): void {
        this.monthList.push(new KeyValueAddress("01", "Janeiro"));
        this.monthList.push(new KeyValueAddress("02", "Fevereiro"));
        this.monthList.push(new KeyValueAddress("03", "Março"));
        this.monthList.push(new KeyValueAddress("04", "Abril"));
        this.monthList.push(new KeyValueAddress("05", "Maio"));
        this.monthList.push(new KeyValueAddress("06", "Junho"));
        this.monthList.push(new KeyValueAddress("07", "Julho"));
        this.monthList.push(new KeyValueAddress("08", "Agosto"));
        this.monthList.push(new KeyValueAddress("09", "Setembro"));
        this.monthList.push(new KeyValueAddress("10", "Outubro"));
        this.monthList.push(new KeyValueAddress("11", "Novembro"));
        this.monthList.push(new KeyValueAddress("12", "Dezembro"));

        this.month.push(this.monthList[0]);
    }

    // getPaymentDetails():void{        
    //     this._cieloService.getPaymentTransactionByWorbbyTaskId(this.worbbyTask.id)
    //     .finally(() => {
    //         console.log("teste");
    //     })
    //     .subscribe((result) => {
    //         console.log(result);
    //     });
    // }

    getYears(): void {
        let actualYear = moment().year();

        for(let i = actualYear; i < (actualYear + 10); i++) {
            this.yearList.push(new KeyValueAddress(i.toString(), i.toString()));
        }

        this.year.push(this.yearList[1]);
    }  

    getWorbbyTask():void{
        this._worbbyTaskService.getWorbbyTask(this.worbbyTaskId).subscribe(result => {
            this.worbbyTask = result;

            this.sale.merchantOrderId = this.worbbyTask.id.toString();
            this.sale.worbbyTaskId = this.worbbyTask.id;
            
            this.sale.payment = new PaymentDto();
            this.sale.payment.creditCard = new CreditCardDto();
            this.sale.payment.capture = false;
            this.sale.payment.authenticate = false;
            this.sale.payment.amount = this.worbbyTask.totalPrice * 100;
            this.sale.payment.type = "CreditCard";
            this.sale.payment.installments = 1;
            this.sale.payment.status = 0;
            this.sale.customer = new CustomerDto();
            this.sale.customer.email = this.appSession.user.emailAddress;
            this.sale.customer.name = this.appSession.user.name + " " + this.appSession.user.surname;
            this.active = true;

            this.getPictureByGuid(this.worbbyTask.worbbior.userPictureId).then((result) => {
                if(!this.isEmpty(result)){
                    this.worbbyTask.worbbior.userPicture = result;
                }else{
                    this.worbbyTask.worbbior.userPicture = AppConsts.defaultProfilePicture;
                }
            });
        });
    }

     selectedMonth(value:any):void {
        let actualMonth = moment().month() + 1;
        let actualYear = moment().year();

        if (this.year.length != 0 && actualYear == Number(this.year[0].id) && Number(value.id) < actualMonth) {
            this.notify.warn("O mês escolhido não pode ser inferior ao mês atual."); 

            this.month = [];
            this.month.push(this.monthList[actualMonth - 1]);
        }
        else {
            this.month = [];
            this.month.push(value);
        }
    } 

    selectedYear(value:any):void {
        let actualMonth = moment().month() + 1;
        let actualYear = moment().year();

        if (this.month.length != 0 && actualYear == Number(value.id) && Number(this.month[0].id) < actualMonth) {
            this.notify.warn("O mês escolhido não pode ser inferior ao mês atual.");

            this.year = [];
            this.year.push(this.yearList[1]);
        }
        else {
            this.year = [];
            this.year.push(value);
        }
    } 

    sendPayment():void{     
        this.saving = true;        

        this.sale.payment.creditCard.expirationDate = this.month[0].id + "/" + this.year[0].id;

        this._cieloService.createSale(this.sale)
        .finally(() => {
            this.saving = false;
        })
        .subscribe((result) => {
            this.message.success("Seu pagamento foi reservado com sucesso!", "Pagamento").done(() => {
                this._router.navigate(['/worbbient/worbby-task-details', this.worbbyTask.id]);
            });            
        }, (error) => {
            //this.message.error("Pagamento recusado, use um outro cartão").done(() => {});            
        });
    }
}