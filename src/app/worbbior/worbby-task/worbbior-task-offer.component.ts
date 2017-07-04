import { Component, Injector, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { UserLoginInfoDto, WorbbyTaskServiceProxy, WorbbyTaskDto, WorbbyOfferDto, WorbbyTaskMessageDto } from '@shared/service-proxies/service-proxies';
import { Router, ActivatedRoute } from '@angular/router';
import { ScheduleDateType, UnitMeasure, WorbbyTaskMessageSide, WorbbyTaskMessageReadState } from '@shared/AppEnums';
import { AppConsts } from '@shared/AppConsts';
import { MessageSignalrService } from '@app/shared/common/message/message-signalr.service';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash';
import * as moment from "moment";

@Component({
    templateUrl: './worbbior-task-offer.component.html',
    animations: [appModuleAnimation()]
})
export class WorbbiorTaskOfferComponent extends AppComponentBase implements AfterViewInit {

    public active:boolean = false;
    public sending:boolean = false;
    public isOpenedInfo: boolean = true;
    public scheduleDateDisplay: string;
    public worbbyOfferId:number;
    public worbbyOffer:WorbbyOfferDto;
    public worbbyTaskMessages:WorbbyTaskMessageDto[] = [];

    public WorbbyTaskMessageSide: typeof WorbbyTaskMessageSide = WorbbyTaskMessageSide;
    public WorbbyTaskMessageReadState: typeof WorbbyTaskMessageReadState = WorbbyTaskMessageReadState;
    public ScheduleDateType: typeof ScheduleDateType = ScheduleDateType;
    public UnitMeasure: typeof UnitMeasure = UnitMeasure;
    public AppConsts: typeof AppConsts = AppConsts;
    public worbbyTaskMessage:string;
    public worbbiorPremium: boolean;
    public ehReverso: boolean = false;
    public currentLength: number = 0;
    public worbbyTaskMessageId:number;
    public showButtonMore:boolean = false;

    private messagesTimer:any;
    private subscriptionMessagesTimer: any;

    constructor(
        injector: Injector,
        private _activatedRoute: ActivatedRoute,
        private _worbbyTaskService: WorbbyTaskServiceProxy,
        private _appSessionService: AppSessionService,
        private _messageSignalrService: MessageSignalrService,
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.ehReverso = window.screen.width > 768 ? false : true;

        this.worbbyOfferId = this._activatedRoute.snapshot.params['worbbyOfferId'];
        this.worbbiorPremium = this._appSessionService.worbbiorPremium;        
    }

    ngOnDestroy():void{
        console.log("ngOnDestroy");
        this.subscriptionMessagesTimer.unsubscribe();
    }

    ngAfterViewInit(): void {
        this.registerEvents();
        this.getWorbbyOffer();
        //this.getWorbbyTaskMessages();  
        this.messagesTimer = Observable.timer(2000,30000);
        this.subscriptionMessagesTimer = this.messagesTimer
        .subscribe(() => {
            this.getWorbbyTaskMessages();
        });         
    }

    getWorbbyOffer():void{
        this._worbbyTaskService.getWorbbyOffer(this.worbbyOfferId).subscribe(result => {
            this.worbbyOffer = result;

            this.scheduleDateDisplay = moment(result.worbbyTask.creationTime).format('L');

            this.getPictureByGuid(this.worbbyOffer.worbbyTask.interestCenter.parentPictureId).then((res) => {
                this.worbbyOffer.worbbyTask.interestCenter.parentPicture = res;
            });

            this.getPictureByGuid(this.worbbyOffer.worbbyTask.worbbient.userPictureId).then((result) => {
                this.worbbyOffer.worbbyTask.worbbient.userPicture = result ? result : AppConsts.defaultProfilePicture;;
            });

            this.getPictureByGuid(this.worbbyOffer.worbbior.userPictureId).then((result) => {
                this.worbbyOffer.worbbior.userPicture = result ? result : AppConsts.defaultProfilePicture;;
            });
            
            this.active = true;
        });
    }

    getWorbbyTaskMessages(isMore:boolean = false):void{
        this._worbbyTaskService.getWorbbyTaskMessagesByOfferId(this.worbbyOfferId, this.currentLength, isMore, this.worbbyTaskMessageId).subscribe(result => {
            if(isMore) {
                this.worbbyTaskMessages = this.worbbyTaskMessages.concat(result.worbbyTaskMessages.items);                
            }
            else {
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

    sendMessage():void {
        var msg = this.worbbyTaskMessage.replace("\n", "");
        if(!this.isEmpty(msg.trim())){
            this.sending = true;
            var worbbyMessage = new WorbbyTaskMessageDto();
            worbbyMessage.userId = abp.session.userId;
            worbbyMessage.targetUserId = this.worbbyOffer.worbbyTask.userId;
            worbbyMessage.message = this.worbbyTaskMessage;
            worbbyMessage.worbbyOfferId = this.worbbyOffer.id;
            worbbyMessage.worbbyTaskId = this.worbbyOffer.worbbyTaskId
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

    loadingMore():void{
        this.getWorbbyTaskMessages(true);
    }
}