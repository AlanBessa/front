import { Component, Injector, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ActivityEndorsementForCreateUpdate, ListResultDtoOfUserActivityInput, WorbbyPagedResultDtoOfActivityDto, ListResultDtoOfInterestCenterDto, InterestCenterServiceProxy, WorbbiorServiceProxy, EndorsementServiceProxy, UserActivityInput, EndorsementDto, ActivityDto, InterestCenterDto, WorbbiorDto, ActivityServiceProxy, ActivityEndorsementDto, ListResultDtoOfActivityEndorsementDto } from '@shared/service-proxies/service-proxies';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { EndorsementState } from '@shared/AppEnums';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { AbpSessionService } from '@abp/session/abp-session.service';
import { AppConsts } from '@shared/AppConsts';
import { Angulartics2 } from 'angulartics2';
import * as _ from 'lodash';


@Component({
    templateUrl: './endorsements.component.html',
    animations: [appModuleAnimation()]
})
export class EndorsementsComponent extends AppComponentBase implements AfterViewInit {

    EndorsementState: typeof EndorsementState = EndorsementState;
    public interestCentersTopLevel: InterestCenterDto[];
    public interestCentersChidren: InterestCenterDto[];
    public currentInterestCenterTopLevel: InterestCenterDto = new InterestCenterDto();
    public currentInterestCenterChild: InterestCenterDto = new InterestCenterDto();
    public activities: ActivityDto[] = [];
    public myActivities: UserActivityInput[] = [];
    public filter:string = "";
    public page:number = 1;
    public endorsementForCreateUpdate:ActivityEndorsementForCreateUpdate;

    public endorsement:EndorsementDto;
    public originalEndorsement: EndorsementDto;
    public userId: number;
    public endorsementId: number;
    public isLogged:boolean = false;
    public register:boolean = true;
    public active: boolean = false;
    public saving: boolean = false;
    public notFound: boolean = false;
    public worbbior: WorbbiorDto;
    public worbbiorActivities:ActivityEndorsementDto[];

    public question1: string = "";
    public question1_1: string = "";
    public question2: string = "";
    public question4: string = "";
    public yourself: boolean = false;
    public notCurrentUser:boolean = false;
    public otherEndorsementExists:boolean = false;
    public worbbiorPremium: boolean;

    constructor(
        injector: Injector,
        private _endorsementService:EndorsementServiceProxy,
        private _interestCenterService: InterestCenterServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _worbbiorService: WorbbiorServiceProxy,
        private _router: Router,
        private _activitiesService: ActivityServiceProxy,
        public appSessionService: AppSessionService,
        private sessionService: AbpSessionService,
        private angulartics2: Angulartics2
    ) {
        super(injector);
    }

    ngOnInit() {
        this.worbbiorPremium = this.appSessionService.worbbiorPremium;
        if (abp.session.userId) {
            this.isLogged = true;
            if(this.appSession.endorsement){
                this.endorsementForCreateUpdate = this.appSession.endorsement;
                this.endorsement = this.appSession.endorsement.endorsementDto;
                this.getWorbbior(this.appSession.endorsement.endorsementDto.userId);

                this.worbbiorActivities = this.appSession.endorsement.activityEndorsementList.items;
                this.question1 = this.appSession.endorsement.questionOne;
                this.question1_1 = this.appSession.endorsement.textQuestioneOne;
                this.question2 = this.appSession.endorsement.questionTwo;
                this.question4 = this.appSession.endorsement.questionFour;

                this.appSession.endorsement = null;
            }else{
                this.userId = this._activatedRoute.snapshot.params['userId'];
                this.endorsementId = this._activatedRoute.snapshot.params['endorsementId'];

                this.checkRoute();

                if(this.endorsementId){
                    this.getEndorsement(this.endorsementId);            
                }else if(this.userId){
                    this.newEndorsement(this.userId);            
                }else{
                    this.notFound = true;
                }   

            }
        }else{
            this.userId = this._activatedRoute.snapshot.params['userId'];
            this.endorsementId = this._activatedRoute.snapshot.params['endorsementId'];

            this.checkRoute();

            if(this.endorsementId){
                this.getEndorsement(this.endorsementId);            
            }else if(this.userId){
                this.newEndorsement(this.userId);            
            }else{
                this.notFound = true;
            }   
        }
    }

    ngOnDestroy(): void {
        
    }

    ngAfterViewInit(): void {
        $("body").scrollTop(0);
        $(".page-loading").hide();
    }

    private checkRoute():void{
        if(this.endorsementId){
            if(this._router.url.match(/endorsement.*/)){
                this._router.navigate(['/endosso' , {'endorsementId': this.endorsementId}]);
            }         
        }else if(this.userId){
            if(this._router.url.match(/endorsement.*/)){
                this._router.navigate(['/endosso' , {'userId': this.userId}]);
            }          
        }else{
            this.notFound = true;
        }  
    }

    getEndorsement(endorsementId: number): void {
        this._endorsementService.getEndorsement(endorsementId).subscribe((result: EndorsementDto) => {
            if(result.userId != undefined){
                this.endorsement = result;
                this.endorsement.fromUserId = this.endorsement.fromUserId ? this.endorsement.fromUserId : abp.session.userId;
                this.getWorbbior(result.userId);
            }else{
                this.notFound = true;
            }
        });
    }

    getWorbbior(userId: number): void{
        this._worbbiorService.getWorbbiorByUserId(userId).subscribe((result: WorbbiorDto) => {
            if(result.userId != undefined){
                this.worbbior = result;
                this.getPictureByGuid(this.worbbior.userPictureId).then((result) =>{
                    if(!this.isNullOrEmpty(result)){
                        this.worbbior.userPicture = result;
                    }else{
                        this.worbbior.userPicture = AppConsts.defaultProfilePicture;
                    }
                });
                if(this.isLogged){
                    this.getSuggestAcitivities();
                    this.checkOtherEndorsementExists(userId);
                }

                if(this.worbbior.userId == abp.session.userId){
                    this.yourself = true;
                }else if(this.endorsement.fromUserId && this.endorsement.fromUserId != abp.session.userId){
                    this.notCurrentUser = true;                    
                }

                if(!this.worbbiorActivities){
                    this.getUserAcitivities(userId, this.endorsementId);
                }

            }else{
                this.notFound = true;
            }

            this.active = true;
        });
    }

    checkOtherEndorsementExists(userId:number):void {
        this._endorsementService.getEndorsementByUserIdAndFromUserId(userId, abp.session.userId).subscribe((res: EndorsementDto) => {
            this.originalEndorsement = res;
            if(res.id && (this.endorsement.endorsementState == Number(EndorsementState.Awaiting) && res.id != this.endorsement.id)){
                this.otherEndorsementExists = true;
            }            
        });
    }

    newEndorsement(userId: number): void {
        this.endorsement = new EndorsementDto();
        this.endorsement.userId = userId;
        this.endorsement.fromUserId = abp.session.userId;
        this.endorsement.endorsementState = Number(EndorsementState.Awaiting);
        this.endorsement.email = abp.session.userId ? this.appSessionService.user.emailAddress : "";
        this.getWorbbior(userId);
    }

    getUserAcitivities(userId: number, endorsementId:number):void {
        this._endorsementService.getUserActivitiesByUserId(userId, endorsementId).subscribe((result: ListResultDtoOfActivityEndorsementDto) => {
            this.worbbiorActivities = result.items;
        });
    }

    private getSuggestAcitivities():void {
        this._activitiesService.getSuggestActivitiesByEndorsementUserId(this.worbbior.userId, abp.session.userId).subscribe((result: ListResultDtoOfUserActivityInput) => {
            this.myActivities = result.items;
            this.active = true;
        });
    }

    public save():void {
        this.saving = true;        
        this.endorsement.questionnaire =
         "1 - Qual é sua relação com ele?" + "\n" + this.question1 + "\n" +
         "Outro: " + this.question1_1 + "\n\n\n" +
         "2 - Há quanto tempo se conhecem?" + "\n" + this.question2 + "\n\n\n" + 
         "4 - Queremos descobrir outros talentos que possam estar escondido. Você que o conhece, acha que ele (a) tem habilidades para fazer outra atividade com excelência, diferente das escolhidas por ele(a)? Quais? Por quê?" + "\n" + this.question4;
        
        var activitysEndorsement = new ListResultDtoOfActivityEndorsementDto();
        activitysEndorsement.items = this.worbbiorActivities;
        this.endorsementForCreateUpdate = new ActivityEndorsementForCreateUpdate();
        this.endorsementForCreateUpdate.questionOne = this.question1;
        this.endorsementForCreateUpdate.textQuestioneOne = this.question1_1;
        this.endorsementForCreateUpdate.questionTwo = this.question2;
        this.endorsementForCreateUpdate.questionFour = this.question4;
        this.endorsementForCreateUpdate.endorsementDto = this.endorsement;
        this.endorsementForCreateUpdate.isSendEmailEndorsement = false;
        this.endorsementForCreateUpdate.activityEndorsementList = activitysEndorsement;
        this.endorsementForCreateUpdate.webAppUrl = AppConsts.appBaseUrl;
        
        this._endorsementService.createOrUpdateEnableValidationEndorsament(this.endorsementForCreateUpdate)
            .finally(() => { 
                this.saving = false; 
            })
            .subscribe(() => {
                this.angulartics2.eventTrack.next({ 
                    action: "SUCESSO",
                    properties: { category: 'Recomendação', label: this.appSessionService.user.emailAddress + " recomendou o Worbbior " + this.worbbior.displayName }
                });
                this._router.navigate(['/endosso-sucesso']);
            },(error) => {
                this.angulartics2.eventTrack.next({ 
                    action: "ERRO",
                    properties: { category: 'Recomendação', label: this.appSessionService.user.emailAddress + " tentou recomendar o Worbbior " + this.worbbior.displayName + " - Erros: " + error.error.details }
                });
            });
    }

    showRegister():void{        
        this.register = true;
    }

    selectActivity():void{
        var activitysEndorsement = new ListResultDtoOfActivityEndorsementDto();
        activitysEndorsement.items = this.worbbiorActivities;
        this.endorsementForCreateUpdate = new ActivityEndorsementForCreateUpdate();
        this.endorsementForCreateUpdate.questionOne = this.question1;
        this.endorsementForCreateUpdate.textQuestioneOne = this.question1_1;
        this.endorsementForCreateUpdate.questionTwo = this.question2;
        this.endorsementForCreateUpdate.questionFour = this.question4;
        this.endorsementForCreateUpdate.endorsementDto = this.endorsement;
        this.endorsementForCreateUpdate.isSendEmailEndorsement = false;
        this.endorsementForCreateUpdate.activityEndorsementList = activitysEndorsement;
        this.endorsementForCreateUpdate.webAppUrl = AppConsts.appBaseUrl;

        this.appSession.endorsement = this.endorsementForCreateUpdate;

        this._router.navigate(['/sugerir-atividades']);
    }

    showLogin():void{
        this.register = false;
    }

    removeActivity(userActivitySuggest:UserActivityInput):void{
        let self = this;
        this.message.confirm(
            this.l('AreYouSureToRemoveTheActivity'), userActivitySuggest.activity.title,
            isConfirmed => {
                if (isConfirmed) {
                    setTimeout(function() {
                        self._activitiesService.removeSuggestActivityToUser(userActivitySuggest.id).subscribe(() => {
                            self.notify.info(this.l('SuccessfullyRemoved'));
                            _.remove(self.myActivities, userActivitySuggest);
                        });
                    }, 3000);
                }
            }
        );
    }
}