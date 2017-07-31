import { Component, Injector, OnInit, Input, ViewChild, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CieloServiceProxy, EntityDtoOfInt64, WorbbyTaskServiceProxy, WorbbyTaskDto, WorbbyOfferDto } from '@shared/service-proxies/service-proxies';
import { Router, ActivatedRoute } from '@angular/router';
import { WorbbyTaskStatus, CancellationPolicy } from '@shared/AppEnums';
import { SendReportModalComponent } from '@app/worbbior/page/send-report-modal.component';
import * as moment from 'moment';
import { CurrencyPipe } from '@angular/common';

@Component({
    selector: 'worbbientWorbbyTaskActions',
    templateUrl: './worbbient-task-actions.component.html'
})
export class WorbbientWorbbyTaskActions extends AppComponentBase implements OnInit {

    @Input() worbbyTask: WorbbyTaskDto;
    @Input() worbbyOffer: WorbbyOfferDto;
    @Input() actionsType: string;
    @Input() pageType: string;

    public CancellationPolicy: typeof CancellationPolicy = CancellationPolicy;

    @Output() actionReturn: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('sendReportModal') sendReportModal: SendReportModalComponent;

    public active:boolean = false;

    private currentDate:moment.Moment;

    private currencyPipe = new CurrencyPipe('pt-BR');

    constructor(
        injector: Injector,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _worbbyTaskService: WorbbyTaskServiceProxy,
        private _cieloService: CieloServiceProxy
    ) {
        super(injector);
    }

    ngOnInit(): void {
        if(this.worbbyOffer){
            this.worbbyTask = this.worbbyOffer.worbbyTask;
        }
    }

    ngOnChanges(changes: SimpleChanges) {
    }

    get isWorbbyTaskOfferConfirmed():boolean{
        return (
            this.worbbyTask.status == Number(WorbbyTaskStatus.OfferConfirmedByWorbbior) && 
            !this.isNullOrEmpty(this.worbbyTask.offerId) && 
            !this.isNullOrEmpty(this.worbbyTask.targetUserId) && 
            this.isNullOrEmpty(this.worbbyTask.activityUserId)
        )
    }

    get isWorbbyTasksProposedAccepted():boolean{
        return (
            this.worbbyTask.status == Number(WorbbyTaskStatus.WorbbyTaskProposalAcceptedByWorbbior) && 
            !this.isNullOrEmpty(this.worbbyTask.activityUserId)
        )
    }

    get isPublicWorbbyTasks():boolean{
        return (
            this.worbbyTask.status == Number(WorbbyTaskStatus.Post) && 
            this.isNullOrEmpty(this.worbbyTask.activityUserId)
        )
    }

    get isWorbbyTasksOffersAccepted():boolean{
        return (
            this.worbbyTask.status == Number(WorbbyTaskStatus.OfferAcceptedByWorbbient) && 
            !this.isNullOrEmpty(this.worbbyTask.offerId) && 
            !this.isNullOrEmpty(this.worbbyTask.targetUserId) && 
            this.isNullOrEmpty(this.worbbyTask.activityUserId)
        )
    }

    get isWorbbyTasksProposed():boolean{
        return (
            this.worbbyTask.status == Number(WorbbyTaskStatus.Post) && 
            !this.isNullOrEmpty(this.worbbyTask.activityUserId)
        )
    }

    get isWorbbyTaskHired(){
        return (
            this.worbbyTask.status == Number(WorbbyTaskStatus.Hired)
        )
    }

    get isWorbbyTaskDelivered(){
        return (
            this.worbbyTask.status == Number(WorbbyTaskStatus.Delivered)
        )
    }

    get isWorbbyTaskStart(){
        return (
            this.worbbyTask.status == Number(WorbbyTaskStatus.Start)
        )
    }

    cancelPublicWorbbyTask():void{
        this.message.confirm(
            '', 'Tem certeza que deseja cancelar esta tarefa?',
            isConfirmed => {
                if (isConfirmed) {
                    this._worbbyTaskService.cancelPublicWorbbyTask(new EntityDtoOfInt64(this.worbbyTask))
                    .finally(() => {
                    })
                    .subscribe(() => {
                        this.message.success("Sua tarefa foi cancelada com sucesso!");
                        this.actionReturn.emit(null);
                    }, (error) => {
                        console.log(error);
                    });
                }
            }
        );
    }

    cancelProposedWorbbyTask():void{
        this.message.confirm(
            '', 'Tem certeza que deseja cancelar esta tarefa?',
            isConfirmed => {
                if (isConfirmed) {
                    this._worbbyTaskService.cancelProposedWorbbyTask(new EntityDtoOfInt64(this.worbbyTask))
                    .finally(() => {
                    })
                    .subscribe(() => {
                        this.message.success("Sua tarefa foi cancelada com sucesso!");
                        this.actionReturn.emit(null);
                    }, (error) => {
                        console.log(error);
                    });
                }
            }
        );
    }

    removeOfferSelected(): void {
        var entityDto = new EntityDtoOfInt64();
        entityDto.id = this.worbbyTask.id;
        this.message.confirm(
            'Você tem certeza em desistir dessa oferta?', 'Ops!',
            isConfirmed => {
                if (isConfirmed) {
                    this._worbbyTaskService.offerCanceledByWorbbient(entityDto)
                        .finally(() => {
                        })
                        .subscribe(() => {
                            this.message.info('Oferta cancelada!', 'Cancelamento')
                                .done(() => {
                                });
                                this.actionReturn.emit(null);
                        });
                }
            }
        );
    }

    viewWorbbyTask():void{
        if(this.worbbyOffer){
            this._router.navigate(['/worbbient/worbby-task-offer', this.worbbyOffer.id]);
        }else{
            this._router.navigate(['/worbbient/worbby-task-details', this.worbbyTask.id]);
        }
    }


    cancelWorbbyTaskHired():void{
        this._worbbyTaskService.getCurrentDate()
        .finally(() => {
        })
        .subscribe((result) => {
            this.currentDate = result.currentDate;
            console.log(this.currentDate);
            var hours = this.worbbyTask.scheduledDate.diff(this.currentDate) / 3600000;

            var cancellationPolicyTax = this.getWorbbyTaskCancellationPolicyTax(hours);

            var cancellationPolicyMessage = "";

            if(cancellationPolicyTax == this.worbbyTask.totalPrice){
                cancellationPolicyMessage = "O cancelamento implicará na cobrança de " + this.currencyPipe.transform(cancellationPolicyTax, 'BRL', true, '1.2-2') + " em favor do worbbior que você contratou, conforme a política de cancelamento " + this.l(CancellationPolicy[this.worbbyTask.cancellationPolicy.toString()]) + " escolhida por ele anteriormente à contratação da tarefa. Esse valor será debitado automaticamente do seu cartão de crédito.";
            } else if (cancellationPolicyTax > 0 && cancellationPolicyTax < this.worbbyTask.totalPrice){
                cancellationPolicyMessage = "O cancelamento implicará na cobrança de " + this.currencyPipe.transform(cancellationPolicyTax + 10, 'BRL', true, '1.2-2') + " referente à taxa de R$ 10,00  em favor da Worbby, mais " + this.currencyPipe.transform(cancellationPolicyTax, 'BRL', true, '1.2-2') + " em favor do worbbior que você contratou, conforme a política de cancelamento " + this.l(CancellationPolicy[this.worbbyTask.cancellationPolicy.toString()]) + " escolhida por ele anteriormente à contratação da tarefa. Esse valor será debitado automaticamente do seu cartão de crédito."
            } else {
                cancellationPolicyMessage = "O cancelamento implicará na cobrança de " + this.currencyPipe.transform(10, 'BRL', true, '1.2-2') + " referente à taxa de R$ 10,00  em favor da Worbby. Esse valor será debitado automaticamente do seu cartão de crédito."
            }

            this.message.confirm(
                cancellationPolicyMessage, 'Tem certeza que quer cancelar esta tarefa?',
                isConfirmed => {
                    if (isConfirmed) {
                        this._cieloService.cancelWorbbyTaskAndCapturePaymentTransaction(this.worbbyTask.id)
                        .finally(() => {
                        })
                        .subscribe(() => {
                            this.message.success("Sua tarefa foi cancelada com sucesso!");
                            this.actionReturn.emit(null);
                        }, (error) => {
                            console.log(error);
                        });
                    }
                }
            );
        });
    }
    
    editWorbbyTask(): void {
        this._router.navigate(['/worbbient/editar-tarefa-postada', this.worbbyTask.id]);
    }


    acceptOffer():void {
        this._worbbyTaskService.offerAcceptedByWorbbient(this.worbbyOffer)
        .finally(() => {
        })
        .subscribe(() => {
            this.message.custom('Aguarde a confirmação do worbbior para você realizar a contratação.', 'Oferta aceita!', 'assets/common/images/default-profile-picture.png').done(() => {
             });
            this._router.navigate(['/worbbient/worbby-task-details', this.worbbyOffer.worbbyTaskId]);
        });
    }

    getWorbbyTaskCancellationPolicyTax(hours:number):number {
        var tax:number = 0;

        switch(this.worbbyTask.cancellationPolicy) { 
            case Number(CancellationPolicy.Flex): { 
                if(hours < 24){
                    tax = 100;
                }
                break; 
            } 
            case Number(CancellationPolicy.Moderate): { 
                if(hours < 48){
                    tax = 100;
                }else if(hours >= 48){
                    tax = 50;
                }
                break; 
            } 
            case Number(CancellationPolicy.Strict): { 
                if(hours < 120){
                    tax = 100;
                }else if(hours >= 120){
                    tax = 50;
                }
                break; 
            } 
            case Number(CancellationPolicy.SuperFlex): { 
                if(hours < 4){
                    tax = 100;
                }
                break; 
            }
        } 

        return tax > 0 ? this.worbbyTask.totalPrice * tax / 100 : 0;
    }

    getCieloSale():void{
        this._cieloService.getPaymentTransactionByWorbbyTaskId(this.worbbyTask.id)
        .finally(() => {
        })
        .subscribe((result) => {
            console.log(result);
        }, (error) => {
            console.log(error);
        });
    }
}