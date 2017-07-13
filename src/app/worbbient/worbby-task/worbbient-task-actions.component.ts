import { Component, Injector, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
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

    @Output() actionReturn: EventEmitter<any> = new EventEmitter<any>();

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
            'Deseja cancelar essa tarefa?', 'Ops!',
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
            'Deseja cancelar essa tarefa?', 'Ops!',
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

    viewWorbbyTask():void{
        this._router.navigate(['/worbbient/worbby-task-details', this.worbbyTask.id]);
    }


    cancelWorbbyTaskHired():void{
        this.message.confirm(
            'Deseja cancelar essa tarefa?', 'Tem certeza que quer cancelar esta tarefa?',
            isConfirmed => {
                if (isConfirmed) {
                    this._worbbyTaskService.cancelWorbbyTaskAfterHired(new EntityDtoOfInt64(this.worbbyTask))
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
    
    editWorbbyTask(worbbyTask: WorbbyTaskDto): void {
        this._router.navigate(['/worbbient/editar-tarefa-postada', worbbyTask.id]);
    }


}