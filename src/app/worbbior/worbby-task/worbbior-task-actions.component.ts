import { Component, Injector, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { EntityDtoOfInt64, WorbbyTaskServiceProxy, WorbbyTaskDto, WorbbyOfferDto } from '@shared/service-proxies/service-proxies';
import { Router, ActivatedRoute } from '@angular/router';
import { WorbbyTaskStatus, ScheduleDateType } from '@shared/AppEnums';
import { SendReportModalComponent } from '@app/worbbior/page/send-report-modal.component';
import { WorbbiorScheduleDateModalComponent } from './worbbior-task-scheduledate-modal.component';

@Component({
    selector: 'worbbiorWorbbyTaskActions',
    templateUrl: './worbbior-task-actions.component.html'
})
export class WorbbiorWorbbyTaskActions extends AppComponentBase implements OnInit {

    @Input() worbbyTask: WorbbyTaskDto;
    @Input() worbbyOffer: WorbbyOfferDto;
    @Input() actionsType: string;
    @Input() pageType: string;

    @Output() actionReturn: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('sendReportModal') sendReportModal: SendReportModalComponent;
    @ViewChild('worbbiorTaskScheduleDateModal') worbbiorTaskScheduleDateModal: WorbbiorScheduleDateModalComponent;

    public ScheduleDateType: typeof ScheduleDateType = ScheduleDateType;

    public active: boolean = false;

    constructor(
        injector: Injector,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _worbbyTaskService: WorbbyTaskServiceProxy
    ) {
        super(injector);
    }

    ngOnInit(): void {
        if (this.worbbyOffer) {
            this.worbbyTask = this.worbbyOffer.worbbyTask;
        }
    }

    get isOfferAcceptedByWorbbient(): boolean {
        //console.log(this.worbbyTask);
        return (
            this.worbbyTask.status == Number(WorbbyTaskStatus.OfferAcceptedByWorbbient) &&
            !this.isNullOrEmpty(this.worbbyTask.offerId) &&
            !this.isNullOrEmpty(this.worbbyTask.targetUserId) &&
            this.isNullOrEmpty(this.worbbyTask.activityUserId)
        )
    }

    get isOfferConfirmedByWorbbior(): boolean {
        return (
            this.worbbyTask.status == Number(WorbbyTaskStatus.OfferConfirmedByWorbbior) &&
            !this.isNullOrEmpty(this.worbbyTask.offerId) &&
            !this.isNullOrEmpty(this.worbbyTask.targetUserId) &&
            this.isNullOrEmpty(this.worbbyTask.activityUserId)
        )
    }

    get isWorbbyTaskProposed(): boolean {
        return (
            this.worbbyTask.status == Number(WorbbyTaskStatus.Post) &&
            !this.isNullOrEmpty(this.worbbyTask.activityUserId)
        )
    }

    get isWorbbyTaskProposedAccepted(): boolean {
        return (
            this.worbbyTask.status == Number(WorbbyTaskStatus.WorbbyTaskProposalAcceptedByWorbbior) &&
            !this.isNullOrEmpty(this.worbbyTask.activityUserId)
        )
    }

    get isPendingOffer(): boolean {
        return (
            this.worbbyTask.status == Number(WorbbyTaskStatus.Post) &&
            this.isNullOrEmpty(this.worbbyTask.activityUserId) &&
            this.isNullOrEmpty(this.worbbyTask.offerId)
        )
    }

    get isWorbbyTaskHired() {
        return (
            this.worbbyTask.status == Number(WorbbyTaskStatus.Hired)
        )
    }

    get isWorbbyTaskDelivered() {
        return (
            this.worbbyTask.status == Number(WorbbyTaskStatus.Delivered)
        )
    }

    get isWorbbyTaskStart() {
        return (
            this.worbbyTask.status == Number(WorbbyTaskStatus.Start)
        )
    }

    confirmOfferAccepted(): void {
        let self = this;
        var entityDto = new EntityDtoOfInt64(this.worbbyTask);
        this.message.confirm(
            '', 'Deseja confirmar essa oferta aceita?',
            isConfirmed => {
                if (isConfirmed) {
                    self._worbbyTaskService.offerConfirmedByWorbbior(entityDto)
                    .finally(() => {
                    })
                    .subscribe(() => {
                        self.message.custom('', 'Oferta confirmada com sucesso!', 'assets/common/images/icon-dove@2x.png').done(() => {
                            if(self.pageType == "page"){
                                self.actionReturn.emit(null);
                            }else{
                                self._router.navigate(['/worbbior/worbby-task-details', this.worbbyTask.id]);
                            }
                        });
                    });
                }
            }
        );        
    }

    refusedOfferAccepted(): void {
        var entityDto = new EntityDtoOfInt64(this.worbbyTask);
        this.message.confirm(
            '', 'Deseja recusar essa oferta?',
            isConfirmed => {
                if (isConfirmed) {
                    this._worbbyTaskService.offerCanceledByWorbbior(entityDto)
                        .finally(() => {
                        })
                        .subscribe(() => {
                            this.message.custom('', 'Oferta recusada com sucesso!', 'assets/common/images/icon-dove@2x.png').done(() => {
                                this.actionReturn.emit(null);
                            });
                        });
                }
            }
        );
    }

    acceptWorbbyTaskProposed(): void {

        if (this.worbbyTask.scheduleDateType == Number(ScheduleDateType.WhenPossible) && this.isNullOrEmpty(this.worbbyTask.scheduledDate)) {
            this.worbbiorTaskScheduleDateModal.show(this.worbbyTask);
        }else{
            this.message.confirm(
                '', 'Deseja aceitar essa proposta?',
                isConfirmed => {
                    if (isConfirmed) {
                        this._worbbyTaskService.worbbyTaskProposalAcceptedByWorbbior(this.worbbyTask)
                        .finally(() => {
                        })
                        .subscribe(() => {
                            this.message.custom('', 'Proposta aceita com sucesso!', 'assets/common/images/icon-dove@2x.png').done(() => {
                            });
                            this.actionReturn.emit(null);
                        });
                    }
                }
            );
            
        }
    }

    refusedWorbbyTaskProposed(): void {
        var entityDto: EntityDtoOfInt64 = new EntityDtoOfInt64(this.worbbyTask);
        this.message.confirm(
            '', 'Deseja recusar essa proposta?',
            isConfirmed => {
                if (isConfirmed) {
                    this._worbbyTaskService.worbbyTaskProposalRefusedByWorbbior(new EntityDtoOfInt64(entityDto))
                        .finally(() => {
                        })
                        .subscribe(() => {
                            this.message.custom('', 'Proposta recusada com sucesso!', 'assets/common/images/icon-dove@2x.png').done(() => {
                            });
                            this.actionReturn.emit(null);
                        });
                }
            }
        );
    }

    viewWorbbyTask(): void {
        if (this.worbbyOffer) {
            this._router.navigate(['/worbbior/worbby-task-offer', this.worbbyOffer.id]);
        } else {
            this._router.navigate(['/worbbior/worbby-task-details', this.worbbyTask.id]);
        }
    }

    pendingOfferCancel(): void {
        var entityDto: EntityDtoOfInt64 = new EntityDtoOfInt64(this.worbbyOffer);
        this.message.confirm(
            '', 'Deseja cancelar essa oferta?',
            isConfirmed => {
                if (isConfirmed) {
                    this._worbbyTaskService.offerUnboundCanceledByWorbbior(new EntityDtoOfInt64(entityDto))
                        .finally(() => {
                        })
                        .subscribe(() => {
                            this.message.custom('', 'Oferta cancelada com sucesso!', 'assets/common/images/icon-dove@2x.png').done(() => {
                                this.actionReturn.emit(null);
                            });
                        });
                }
            }
        );
    }

    cancelWorbbyTaskHired(): void {
        this.message.confirm(
            '', 'Tem certeza que quer cancelar esta tarefa?',
            isConfirmed => {
                if (isConfirmed) {
                    this._worbbyTaskService.cancelWorbbyTaskAfterHiredByWorbbient(new EntityDtoOfInt64(this.worbbyTask))
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

    worbbyTaskDelivered(): void {
        this.message.confirm(
            'Você entregou esta tarefa?',
            isConfirmed => {
                if (isConfirmed) {
                    this._worbbyTaskService.worbbyTaskDelivered(new EntityDtoOfInt64(this.worbbyTask))
                        .finally(() => {
                        })
                        .subscribe(() => {
                            this.message.success("O Worbbient será notificado para que possa liberar o pagamento.", "Confirmada a entrega da tarefa!");
                            this.actionReturn.emit(null);
                        }, (error) => {
                            console.log(error);
                        });
                }
            }
        );
    }

    sendReport(): void {
        this.sendReportModal.show();
    }

    modalSave():void{
        this.actionReturn.emit(null);
    }
}