import { Component, Injector, AfterViewInit, ViewChild, OnInit, Input } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PagedResultDtoOfEndorsementDto, ListResultDtoOfActivityEndorsementDto, ActivityEndorsementForCreateUpdate, EndorsementServiceProxy, EndorsementDto, InterestCenterServiceProxy, ListResultDtoOfInterestCenterDto, ListResultDtoOfUserActivityInput, UserActivityInput, InterestCenterDto, ActivityServiceProxy, ActivityDto } from '@shared/service-proxies/service-proxies';
import { CreateOrEditUserActivityModalComponent } from './create-or-edit-user-activity-modal.component';
import { SendEndorsementModalComponent } from './send-endorsement-modal.component';
import { ActivityState, EndorsementState, WorbbiorState } from '@shared/AppEnums';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { AppConsts } from '@shared/AppConsts';
import { MyActivitiesWorbbiorComponent } from './my-activities.component';


@Component({
    templateUrl: './my-endorsements.component.html',
    animations: [appModuleAnimation()],
    selector: 'editMyEndorsementsWorbbior',
})
export class MyEndorsementsWorbbiorComponent extends AppComponentBase implements AfterViewInit {

    @ViewChild('createOrEditUserActivityModal') createOrEditUserActivityModal: CreateOrEditUserActivityModalComponent;
    @ViewChild('sendEndorsementModal') sendEndorsementModal: SendEndorsementModalComponent;
    @Input('myActivitiesWorbbiorComponent') myActivitiesWorbbiorComponent:MyActivitiesWorbbiorComponent;

    public active: boolean = false;
    public worbbiorState: WorbbiorState;

    public suggestedActivities: UserActivityInput[];    
    ActivityState: typeof ActivityState = ActivityState;
    public endorsements: EndorsementDto[] = [];
    EndorsementState: typeof EndorsementState = EndorsementState;
    public WorbbiorState: typeof WorbbiorState = WorbbiorState;

    public tooltipEndosso: string = "O que é?<br /> Recomendação é um pedido a ser feito a pessoas que conhecem suas habilidades para que elas atestem os seus talentos que você quer oferecer na plataforma. É necessário ter no mínimo duas recomendações em uma mesma atividade para que a sua conta como worbbior seja ativada.<br /><br /> Por que é necessário recomendação para atuar na plataforma?<br /> A recomendação de terceiros, juntamente com a avaliação dos usuários, é uma forma de dar segurança ao cliente (worbbient) que vai contratar um talento por meio da plataforma.";

    // pager object
    pager: any = {};

    constructor(
        injector: Injector,
        private _interestCenterService: InterestCenterServiceProxy,
        private _activitiesService: ActivityServiceProxy,
        private _appSessionService: AppSessionService,
        private _endorsementService: EndorsementServiceProxy
    ) {
        super(injector);
    }

    ngAfterViewInit(): void {
        
        this.getSuggestedActivities();
        this.getSendEndorsements(1);
    }

    ngOnInit() {
        this.worbbiorState = this._appSessionService.worbbiorState;
    }

    private getSendEndorsements(page):void{

        var skipCount = AppConsts.maxResultCount * (page-1);

        this._endorsementService.getEndorsementsByUserId(abp.session.userId, AppConsts.maxResultCount, skipCount).subscribe((result: PagedResultDtoOfEndorsementDto) => {
            this.endorsements = result.items;
            this.pager.totalCount = result.totalCount;
            this.pager.currentPage = page;
            this.buildPager(Math.ceil(this.pager.totalCount/AppConsts.maxResultCount));            

            this.active = true;       
        });
    }

    updateWorbbiorState():void{
        this.worbbiorState = this._appSessionService.worbbiorState;         
    }


    private getSuggestedActivities():void {
        this._activitiesService.getSuggestActivitiesByUserId(abp.session.userId).subscribe((result: ListResultDtoOfUserActivityInput) => {
            this.suggestedActivities = result.items;
            this.suggestedActivities.forEach(element => {
                element.listInterestCenter.items.forEach(element => {
                    this.getPictureByGuid(element.parentPictureId).then((result) => {
                        element.parentPicture = result;
                    });                
                });               
            });  
            this.active = true; 
        });
    }

    public modalActivitySuggestResult():void {
        this.getSuggestedActivities();
        this.myActivitiesWorbbiorComponent.getMyAcitivities();        
    }

    addActivity(activityUser:UserActivityInput): void{
        var activityTemp = activityUser;
        activityTemp.activityState = ActivityState[ActivityState.Active.toString()];
        activityTemp.isSuggestActivity = false;
        this.createOrEditUserActivityModal.show(activityUser);
    }

    sendEndorsement(endorsement:EndorsementDto):void {
        if(this.myActivitiesWorbbiorComponent.myActivities.length == 0){
            this.message.error('Para solicitar uma recomendação é necessário ter pelo menos uma atividade cadastrada!', 'Solicitação de Recomendação!').done(() => {});
        }
        else{            
            var activityEndorsementForCreateUpdate = new ActivityEndorsementForCreateUpdate();
            activityEndorsementForCreateUpdate.endorsementDto = new EndorsementDto();
            activityEndorsementForCreateUpdate.endorsementDto.endorsementState = Number(EndorsementState.Awaiting);
            activityEndorsementForCreateUpdate.endorsementDto.email = "";
            activityEndorsementForCreateUpdate.endorsementDto.userId = abp.session.userId;
            activityEndorsementForCreateUpdate.activityEndorsementList = new ListResultDtoOfActivityEndorsementDto();
            activityEndorsementForCreateUpdate.questionOne = "";
            activityEndorsementForCreateUpdate.questionTwo = "";
            activityEndorsementForCreateUpdate.isSendEmailEndorsement = true;
            activityEndorsementForCreateUpdate.webAppUrl = AppConsts.appBaseUrl
            this.sendEndorsementModal.show(activityEndorsementForCreateUpdate);
        }        
    }

    addEndorsement() : void{
        var endorsamentTemp = new EndorsementDto();
        endorsamentTemp.userId = abp.session.userId;

        this.endorsements.push(endorsamentTemp);
    }

    buildPager(total) {
        //Quantas casa para frente e para trás
        let range = 5;

        this.pager.totalPages = [];

        if(window.screen.width <= 500) {
            range = 1;
        }
        else if(window.screen.width <= 767) {
            range = 3;
        }
          
        let maxNumberPages = (range * 2) + 1;

        for (let i = 1; i <= total; i++) {

            if (1 != total && (!(i >= this.pager.currentPage + range + 1 || i <= this.pager.currentPage - range - 1) || total <= maxNumberPages)) {

                this.pager.totalPages.push(i);
            }
        }
    }
}