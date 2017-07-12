import { Component, Injector, OnInit, Input, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { EntityDtoOfInt64, WorbbyTaskServiceProxy, WorbbyTaskDto, WorbbyOfferDto } from '@shared/service-proxies/service-proxies';
import { Router, ActivatedRoute } from '@angular/router';
import { WorbbyTaskStatus } from '@shared/AppEnums';
import { SendReportModalComponent } from '@app/worbbior/page/send-report-modal.component';

@Component({
    selector: 'worbbientWorbbyTaskActions',
    templateUrl: './worbbient-task-actions.component.html'
})
export class WorbbientWorbbyTaskActions extends AppComponentBase implements OnInit {

    @Input() worbbyTask: WorbbyTaskDto;
    @Input() worbbyOffer: WorbbyOfferDto;
    @Input() actionsType: string;
    @Input() pageType: string;

    @ViewChild('sendReportModal') sendReportModal: SendReportModalComponent;

    public active:boolean = false;

    constructor(
        injector: Injector,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _worbbyTaskService: WorbbyTaskServiceProxy
    ) {
        super(injector);
    }

    ngOnInit(): void {
        if(this.worbbyOffer){
            this.worbbyTask = this.worbbyOffer.worbbyTask;
        }
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

    cancelPublicWorbbyTask():void{
        this.message.confirm(
            'Deseja cancelar essa tarefa?', 'Ops!',
            isConfirmed => {
                if (isConfirmed) {
                    this._worbbyTaskService.cancelPublicWorbbyTask(new EntityDtoOfInt64(this.worbbyTask))
                    .finally(() => {
                    })
                    .subscribe(() => {
                        this.message.success("Sua tarefa foi cancelada com sucesso!");
                    }, (error) => {
                        console.log(error);
                    });
                }
            }
        );
    }

    cancelProposedWorbbyTask():void{
        this.message.confirm(
            'Deseja cancelar essa tarefa?', 'Ops!',
            isConfirmed => {
                if (isConfirmed) {
                    this._worbbyTaskService.cancelProposedWorbbyTask(new EntityDtoOfInt64(this.worbbyTask))
                    .finally(() => {
                    })
                    .subscribe(() => {
                        this.message.success("Sua tarefa foi cancelada com sucesso!");
                    }, (error) => {
                        console.log(error);
                    });
                }
            }
        );
    }

    viewWorbbyTask():void{
        this._router.navigate(['/worbbient/worbby-task-details', this.worbbyTask.id]);
    }



    //get isOfferConfirmedByWorbbior():boolean{
    //     return (
    //         this.worbbyTask.status == Number(WorbbyTaskStatus.OfferConfirmedByWorbbior) && 
    //         !this.isNullOrEmpty(this.worbbyTask.offerId) && 
    //         !this.isNullOrEmpty(this.worbbyTask.targetUserId) && 
    //         this.isNullOrEmpty(this.worbbyTask.activityUserId)
    //     )
    // }

    // get isWorbbyTaskProposed():boolean{
    //     return (
    //         this.worbbyTask.status == Number(WorbbyTaskStatus.Post) && 
    //         !this.isNullOrEmpty(this.worbbyTask.activityUserId)
    //     )
    // }

    // get isWorbbyTaskProposedAccepted():boolean {
    //     return (
    //         this.worbbyTask.status == Number(WorbbyTaskStatus.WorbbyTaskProposalAcceptedByWorbbior) && 
    //         !this.isNullOrEmpty(this.worbbyTask.activityUserId)
    //     )
    // }

    // get isPendingOffer():boolean{
    //     return (
    //         this.worbbyTask.status == Number(WorbbyTaskStatus.Post) && 
    //         this.isNullOrEmpty(this.worbbyTask.activityUserId) &&
    //         this.isNullOrEmpty(this.worbbyTask.offerId)
    //     )
    // }

    // confirmOfferAccepted(worbbyTask: WorbbyTaskDto): void {
    //     var entityDto = new EntityDtoOfInt64();
    //     entityDto.id = worbbyTask.id;
    //     this._worbbyTaskService.offerConfirmedByWorbbior(entityDto)
    //         .finally(() => {
    //         })
    //         .subscribe(() => {
    //             this.message.custom('', 'Oferta confirmada com sucesso!', 'assets/common/images/icon-dove@2x.png').done(() => {
    //                 this._router.navigate(['/worbbior/worbby-task-details', worbbyTask.id]);
    //             });
    //         });
    // }    

    // refusedOfferAccepted(worbbyTask: WorbbyTaskDto): void {
    //     var entityDto = new EntityDtoOfInt64();
    //     entityDto.id = worbbyTask.id;
    //     this.message.confirm(
    //         'Deseja recusar essa oferta?', 'Ops!',
    //         isConfirmed => {
    //             if (isConfirmed) {
    //                 this._worbbyTaskService.offerCanceledByWorbbior(entityDto)
    //                     .finally(() => {
    //                     })
    //                     .subscribe(() => {
    //                         this.message.custom('', 'Oferta recusada com sucesso!', 'assets/common/images/icon-dove@2x.png').done(() => {
    //                         });
    //                     });
    //             }
    //         }
    //     );
    // }

    // acceptWorbbyTaskProposed(): void {
    //     var entityDto: EntityDtoOfInt64 = new EntityDtoOfInt64(this.worbbyTask);

    //     this._worbbyTaskService.worbbyTaskProposalAcceptedByWorbbior(entityDto)
    //         .finally(() => {
    //         })
    //         .subscribe(() => {
    //             this.message.custom('', 'Proposta aceita com sucesso!', 'assets/common/images/icon-dove@2x.png').done(() => {
    //             });
    //         });
    // }

    // refusedWorbbyTaskProposed(): void {
    //     var entityDto: EntityDtoOfInt64 = new EntityDtoOfInt64(this.worbbyTask);
    //     this.message.confirm(
    //         'Deseja recusar essa proposta?', 'Ops!',
    //         isConfirmed => {
    //             if (isConfirmed) {
    //                 this._worbbyTaskService.worbbyTaskProposalRefusedByWorbbior(new EntityDtoOfInt64(entityDto))
    //                     .finally(() => {
    //                     })
    //                     .subscribe(() => {
    //                         this.message.custom('', 'Proposta recusada com sucesso!', 'assets/common/images/icon-dove@2x.png').done(() => {
    //                         });
    //                     });
    //             }
    //         }
    //     );
    // }

    // viewWorbbyTask(): void {
    //     if(this.worbbyOffer){
    //         this._router.navigate(['/worbbior/worbby-task-offer', this.worbbyOffer.id]);
    //     }else{
    //         this._router.navigate(['/worbbior/worbby-task-details', this.worbbyTask.id]);
    //     }
    // }

    // pendingOfferCancel(): void {
    //     console.log("TODO: Implementar cancelamento de oferta!!");
    // }

    // sendReport(): void {
    //     this.sendReportModal.show();
    // }
}