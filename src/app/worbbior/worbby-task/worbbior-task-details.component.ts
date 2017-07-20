import { Component, Injector, AfterViewInit, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { WorbbyTaskServiceProxy, WorbbyTaskDto, WorbbyOfferDto, WorbbyTaskMessageDto } from '@shared/service-proxies/service-proxies';
import { Router, ActivatedRoute } from '@angular/router';
import { TimeEnum, CancellationPolicy, WorbbyTaskStatus, ScheduleDateType, UnitMeasure, WorbbyTaskMessageSide, WorbbyTaskMessageReadState } from '@shared/AppEnums';
import { AppConsts } from '@shared/AppConsts';
import { MessageSignalrService } from '@app/shared/common/message/message-signalr.service';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash';
import * as moment from "moment";

@Component({
    templateUrl: './worbbior-task-details.component.html',
    animations: [appModuleAnimation()]
})
export class WorbbiorTaskDetailsComponent extends AppComponentBase implements AfterViewInit {

    public active:boolean = false;
    public sending:boolean = false;
    public isOpenedInfo: boolean = false;
    public scheduleDateDisplay: string;
    public worbbyTaskId:number;
    public worbbyTask:WorbbyTaskDto;
    public worbbyTaskMessages:WorbbyTaskMessageDto[] = [];

    public WorbbyTaskMessageSide: typeof WorbbyTaskMessageSide = WorbbyTaskMessageSide;
    public WorbbyTaskMessageReadState: typeof WorbbyTaskMessageReadState = WorbbyTaskMessageReadState;
    public ScheduleDateType: typeof ScheduleDateType = ScheduleDateType;
    public CancellationPolicy: typeof CancellationPolicy = CancellationPolicy;
    public TimeEnum: typeof TimeEnum = TimeEnum;
    public UnitMeasure: typeof UnitMeasure = UnitMeasure;
    public AppConsts: typeof AppConsts = AppConsts;
    public WorbbyTaskStatus: typeof WorbbyTaskStatus = WorbbyTaskStatus;
    public worbbyTaskMessage:string;
    public worbbiorPremium: boolean;
    public currentLength: number = 0;
    public worbbyTaskMessageId:number;
    public ehReverso: boolean = false;
    public showButtonMore:boolean = false;
    public worbbientId: number = 0;
    public taskId: number = 0;
    public worbbyOfferSide:string = '1';

    public tooltipPoliticaCancelamento: string = "<strong>Superflexível:</strong> 100% de reembolso do valor da tarefa até 4 horas antes da hora prevista.<br /><br /> <strong>Flexível:</strong> 100% de reembolso do valor da tarefa até 24 horas antes da data prevista.<br /><br /> <strong>Moderada:</strong> 50% de reembolso do valor da tarefa até 48 horas da data prevista.<br /><br /> <strong>Rígida:</strong> 50% de reembolso do valor da tarefa até 5 dias (120 horas) antes da data prevista.";

    //private messagesTimer:any;
    //private subscriptionMessagesTimer: any;

    constructor(
        injector: Injector,
        private _activatedRoute: ActivatedRoute,
        private _worbbyTaskService: WorbbyTaskServiceProxy,
        private _appSessionService: AppSessionService,
        private _messageSignalrService: MessageSignalrService,
        private _router: Router,
    ) {
        super(injector);
    }

    ngOnInit(): void {
        if(window.screen.width < 480) {
            $('.footer').hide();
            $('.container-fluid.bg-Solititude').addClass('p-b-lg');
        }
        this.ehReverso = window.screen.width > 768 ? false : true;
        
        this.worbbyTaskId = this._activatedRoute.snapshot.params['worbbyTaskId'];
        this.worbbiorPremium = this._appSessionService.worbbiorPremium;        
    }

    ngOnDestroy():void{
        // console.log("ngOnDestroy");
        // this.subscriptionMessagesTimer.unsubscribe();
        if(window.screen.width < 480) {
            $('.footer').hide();
            $('.container-fluid.bg-Solititude').addClass('p-b-lg');
        }
    }

    ngAfterViewInit(): void {
        this.registerEvents();
        this.getWorbbyTask();
        //this.getWorbbyTaskMessages();
        // this.messagesTimer = Observable.timer(2000,30000);
        // this.subscriptionMessagesTimer = this.messagesTimer
        // .subscribe(() => {
        //     this.getWorbbyTaskMessages();
        // });   
    }

    confirmOffer():void{
        
    }

    getWorbbyTask():void{
        this._worbbyTaskService.getWorbbyTask(this.worbbyTaskId).subscribe(result => {
            this.worbbyTask = result;
            this.worbbyOfferSide = this.worbbyTask.offerDto && this.worbbyTask.offerDto.userId == abp.session.userId ? "2" : "1";
            this.scheduleDateDisplay = result.scheduledDate ? moment(result.scheduledDate).format('L') : this.scheduleDateDisplay;
            this.worbbientId = this.worbbyTask.userId;
            this.taskId = this.worbbyTask.id;

            this.getPictureByGuid(this.worbbyTask.worbbient.userPictureId).then((result) => {
                this.worbbyTask.worbbient.userPicture = result ? result : AppConsts.defaultProfilePicture;;
            });

            this.getPictureByGuid(this.worbbyTask.worbbior.userPictureId).then((result) => {
                this.worbbyTask.worbbior.userPicture = result ? result : AppConsts.defaultProfilePicture;;
            });
            
            this.active = true;
            this.getWorbbyTaskMessages();
        });
    }

    getWorbbyTaskMessages(isMore: boolean = false):void{
        this._worbbyTaskService.getWorbbyTaskMessagesByWorbbyTaskId(this.worbbyTaskId, this.currentLength, isMore, this.worbbyTaskMessageId).subscribe(result => {
            if(isMore){
                this.worbbyTaskMessages = this.worbbyTaskMessages.concat(result.worbbyTaskMessages.items);
            }else{
                this.worbbyTaskMessages = result.worbbyTaskMessages.items.concat(this.worbbyTaskMessages);
            }

            this.showButtonMore = result.worbbyTaskMessages.totalCount != this.worbbyTaskMessages.length;

            this.worbbyTaskMessageId = this.worbbyTaskMessages.length > 0 ? this.worbbyTaskMessages[0].id : undefined; 

            this.currentLength = this.worbbyTaskMessages.length;   

            this.worbbyTaskMessages.forEach(element => {
                element.side = (element.userId == abp.session.userId) ? Number(WorbbyTaskMessageSide.Sender) : Number(WorbbyTaskMessageSide.Receiver);
                this.getPictureByGuid(element.userPictureId).then((result) => {
                    element.userPicture = result ? result : AppConsts.defaultProfilePicture;
                });
            });

            if(this.ehReverso) {
                this.goTo('goToDown');
            } 
        });
    }

    loadingMore():void{
        this.getWorbbyTaskMessages(true);
    }  

    sendMessage():void {
        var msg = this.worbbyTaskMessage.replace("\n", "");
        if(!this.isNullOrEmpty(msg.trim())){
            this.sending = true;
            var worbbyMessage = new WorbbyTaskMessageDto();
            worbbyMessage.userId = abp.session.userId;
            worbbyMessage.targetUserId = this.worbbyTask.userId;
            worbbyMessage.message = this.worbbyTaskMessage;
            worbbyMessage.worbbyOfferId = this.worbbyTask.offerId;
            worbbyMessage.worbbyTaskId = this.worbbyTask.id;
            worbbyMessage.readState = 1;
            worbbyMessage.side = Number(WorbbyTaskMessageSide.Sender);

            this._worbbyTaskService.sendWorbbyTaskMassage(worbbyMessage).finally(() => {
                this.sending = false;                   
            })
            .subscribe(() => {
                this.getWorbbyTaskMessages();
                this.worbbyTaskMessage = "";
            });
        }else{
            this.worbbyTaskMessage = "";
        }
    }

    onKeyUp(event: any): void {
        if (event.keyCode == 13 && !event.shiftKey) {
            this.sendMessage();            
        }
    }

    openDetails(opened:boolean): void {
        this.isOpenedInfo = !opened;
    } 

    registerEvents(): void {
        let self = this;

        abp.event.on('app.message.messageReceived', message => {
            console.log("app.message.messageReceived");
            this.getWorbbyTaskMessages();
        });

        abp.event.on('app.message.friendshipRequestReceived', (data, isOwnRequest) => {
            console.log("app.message.friendshipRequestReceived");
        });

        abp.event.on('app.message.userConnectionStateChanged', data => {
            console.log("app.message.userConnectionStateChanged");
        });

        abp.event.on('app.message.userStateChanged', data => {
            console.log("app.message.userStateChanged");
        });

        abp.event.on('app.message.allUnreadMessagesOfUserRead', data => {
            console.log("app.message.allUnreadMessagesOfUserRead");
        });

        abp.event.on('app.message.connected', () => {
            let self = this;
            console.log("app.message.connected");
        });
    }


    actionReturn():void{
        console.log("actionReturn");
        this._router.navigate(['/worbbior/my-worbby'])
    }

    get worbbyTaskStatusString ():string {
        var statusString = "";
        if(this.isOfferAcceptedByWorbbient){
            statusString = "Aguardando sua confirmação";
        }else if(this.isOfferConfirmedByWorbbior){
            statusString = "Aguardando contratação pelo Worbbient";
        }else if(this.isWorbbyTaskProposed){
            statusString = "Aguardando o seu aceite";
        }else if(this.isWorbbyTaskProposedAccepted){
            statusString = "Aguardando contratação pelo Worbbient";
        }else if(this.isPendingOffer){
            statusString = "Aguardando Worbbient selecionar uma oferta";
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
}