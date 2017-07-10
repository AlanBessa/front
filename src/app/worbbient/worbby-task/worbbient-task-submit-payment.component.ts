import { Component, Injector, AfterViewInit, OnInit, ElementRef } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';

import { 
    WorbbyTaskServiceProxy, 
    WorbbyTaskDto,
    CieloServiceProxy, 
    CieloSaleInput, 
    CieloSaleOutput, 
    PaymentDto, CreditCardDto  
} from '@shared/service-proxies/service-proxies';

import { Router, ActivatedRoute } from '@angular/router';
import { ScheduleDateType, UnitMeasure, WorbbyTaskMessageSide, WorbbyTaskMessageReadState } from '@shared/AppEnums';
import { MessageSignalrService } from '@app/shared/common/message/message-signalr.service';
import { AppConsts } from '@shared/AppConsts';



@Component({
    templateUrl: './worbbient-task-submit-payment.component.html',
    animations: [appModuleAnimation()]
})
export class WorbbientTaskSubmitPaymentComponent extends AppComponentBase implements AfterViewInit {

    public saving:boolean = false;

    public active:boolean = false;

    public worbbyTask:WorbbyTaskDto;
    
    public worbbyTaskId:number;

    constructor(
        injector: Injector,
        private _activatedRoute: ActivatedRoute,
        private _router:Router,
        private _worbbyTaskService: WorbbyTaskServiceProxy,
        private _cieloService: CieloServiceProxy
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.worbbyTaskId = Number(this._activatedRoute.snapshot.params['worbbyTaskId']);
        this.getWorbbyTask();
    }

    ngAfterViewInit(): void {
        $("body").scrollTop(0);      
    }

    getWorbbyTask():void{
        this._worbbyTaskService.getWorbbyTask(this.worbbyTaskId).subscribe(result => {
            this.worbbyTask = result;
            this.getPictureByGuid(this.worbbyTask.worbbior.userPictureId).then((result) => {
                if(!this.isEmpty(result)){
                    this.worbbyTask.worbbior.userPicture = result;
                }else{
                    this.worbbyTask.worbbior.userPicture = AppConsts.defaultProfilePicture;
                }
            });
            this.active = true;
        });
    }

    capturePayment():void{        
        this._cieloService.capturePaymentTransaction(this.worbbyTask.id)
        .finally(() => {
            console.log("teste");
        })
        .subscribe((result) => {
            this.message.success("Seu pagamento foi liberado com sucesso!", "Pagamento").done(() => {
                this._router.navigate(['/worbbient/evaluate-worbbior', this.worbbyTask.id]);
            });     
        });
    }

}