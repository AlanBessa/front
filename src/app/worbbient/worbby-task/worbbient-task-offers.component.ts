import { Component, Injector, AfterViewInit, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { WorbbyTaskServiceProxy, WorbbyTaskDto, WorbbyOfferDto } from '@shared/service-proxies/service-proxies';
import { Router, ActivatedRoute } from '@angular/router';
import { WorbbyTaskStatus, TimeEnum, ScheduleDateType, UnitMeasure, CancellationPolicy } from '@shared/AppEnums';
import { AppConsts } from '@shared/AppConsts';
import * as _ from 'lodash';
import * as moment from "moment";

@Component({
    templateUrl: './worbbient-task-offers.component.html',
    animations: [appModuleAnimation()]
})
export class WorbbientTaskOffersComponent extends AppComponentBase implements AfterViewInit {

    public active:boolean = false;
    public worbbyTaskId: number;
    public worbbyTask:WorbbyTaskDto;
    public saving:boolean = false;
    public scheduleDateDisplay: string;

    public ScheduleDateType: typeof ScheduleDateType = ScheduleDateType;
    public WorbbyTaskStatus: typeof WorbbyTaskStatus = WorbbyTaskStatus;
    public UnitMeasure: typeof UnitMeasure = UnitMeasure;
    public AppConsts: typeof AppConsts = AppConsts;
    public TimeEnum: typeof TimeEnum = TimeEnum;
    public CancellationPolicy: typeof CancellationPolicy = CancellationPolicy;

    public tooltipPoliticaCancelamento: string = "<strong>Superflexível:</strong> 100% de reembolso do valor da tarefa até 4 horas antes da hora prevista.<br /><br /> <strong>Flexível:</strong> 100% de reembolso do valor da tarefa até 24 horas antes da data prevista.<br /><br /> <strong>Moderada:</strong> 50% de reembolso do valor da tarefa até 48 horas da data prevista.<br /><br /> <strong>Rígida:</strong> 50% de reembolso do valor da tarefa até 5 dias (120 horas) antes da data prevista.";

    constructor(
        injector: Injector,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _worbbyTaskService: WorbbyTaskServiceProxy
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.registerToEvents();
        //this.worbbyTaskId = this._activatedRoute.snapshot.params['worbbyTaskId'];

        this._activatedRoute.params.subscribe(params => {
            this.worbbyTaskId = params['worbbyTaskId'];
            this.getWorbbyTaskWithOffers(this.worbbyTaskId); // based on new parameter this time
        });

        //this.getWorbbyTaskWithOffers(this.worbbyTaskId);
    }

    ngAfterViewInit(): void {
        $("body").scrollTop(0);
        $(".page-loading").hide();
    }

    registerToEvents() {
        abp.event.on('abp.notifications.received', userNotification => {
            console.log(userNotification);
            this.getWorbbyTaskWithOffers(this.worbbyTaskId);
        });
    }

    getWorbbyTaskWithOffers(taskId): void {
        this._worbbyTaskService.getWorbbyTaskWithOffers(taskId).subscribe(result => {
            this.worbbyTask = result;

            this.scheduleDateDisplay = result.scheduledDate ? moment(result.scheduledDate).format('L') : this.scheduleDateDisplay;

            this.worbbyTask.offersList.items.forEach(element => {
                this.getPictureByGuid(element.worbbior.userPictureId).then((result) => {
                    element.worbbior.userPicture = result;
                });
            });
            this.active = true;
        }); 
    }

    get worbbyTaskStatusString ():string {
        var statusString = "";
        if(this.isOfferAcceptedByWorbbient){
            statusString = "Aguardando confirmação do Worbbior";
        }else if(this.isOfferConfirmedByWorbbior){
            statusString = "Aguardando contratação";
        }else if(this.isWorbbyTaskProposed){
            statusString = "Aguardando aceite do Worbbior";
        }else if(this.isWorbbyTaskProposedAccepted){
            statusString = "Aguardando contratação";
        }else if(this.isPendingOffer){
            statusString = "Aguardando você selecionar uma oferta";
        }else if(this.isWorbbyTaskHired){
            statusString = "Tarefa em progresso";
        }else if(this.isWorbbyTaskDelivered){
            statusString = "Tarefa entregue, aguardando liberação do pagamento";
        }else if(this.isWorbbyTaskStart){
            statusString = "Tarefa iniciada";
        }

        return statusString;
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

    actionReturn():void{
        console.log('actionReturn');
        this._router.navigate(['/worbbient/my-worbby'])
    }
}