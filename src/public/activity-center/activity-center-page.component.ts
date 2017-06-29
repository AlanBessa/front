import { Component, Injector, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { InterestCenterServiceProxy, ListResultDtoOfInterestCenterDto, InterestCenterDto, ActivityServiceProxy, ListResultDtoOfWorbbiorActivityDto, WorbbiorActivityDto, WorbbyPagedResultDtoOfActivityDto, ActivityDto, EntityDtoOfInt64, WorbbiorServiceProxy, WorbbyTaskServiceProxy, ListResultDtoOfWorbbyTaskDto, FindWorbbyTaskInput, WorbbyTaskDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppSessionService } from "shared/common/session/app-session.service";

@Component({
    templateUrl: './activity-center-page.component.html',
    animations: [appModuleAnimation()]
})
export class ActivityCenterComponent extends AppComponentBase implements AfterViewInit {
    
    public interestCenterId: number;
    public isOpenedSubActivities: boolean = false;
    public interestCenter: InterestCenterDto;
    public findWorbbyTaskInput: FindWorbbyTaskInput = new FindWorbbyTaskInput(); 

    public interestCenters: InterestCenterDto[] = [];
    public subActivitiesList: InterestCenterDto[] = [];
    public worbbiorTopTalentList: WorbbiorActivityDto[] = [];
    public suggestedActivitiesList: ActivityDto[] = [];
    public completedTasksList: WorbbyTaskDto[] = [];

    public active: boolean = false;
    public carregado: boolean = false;
    public imagemBanner: string = "";
    public searchBanner: string = "";
    public hasSpecialPartner: boolean = false;
    public filter: string;
    public worbbiorPremium: boolean;
    
    constructor(
        injector: Injector,
        private router: Router,
        private _activatedRoute: ActivatedRoute,
        private _interestCenterService: InterestCenterServiceProxy,
        private _activitiesService: ActivityServiceProxy,
        private _appSessionService: AppSessionService,
        private _worbbiorService: WorbbiorServiceProxy,
        private _worbbyTaskService: WorbbyTaskServiceProxy
    ) {
        super(injector);        
    }

    ngOnInit(): void {
        this.interestCenterId = Number(this._activatedRoute.snapshot.params['interestCenterId'].slice(0, this._activatedRoute.snapshot.params['interestCenterId'].indexOf("-"))); 
        this.imagemBanner = "/assets/metronic/worbby/global/img/banner-activities/" + this.interestCenterId + ".jpg";
        this.searchBanner = "/assets/metronic/worbby/global/img/photo-team@2x.jpg";
        this.findWorbbyTaskInput.interestCenterTopLevelId = this.interestCenterId;
        this.worbbiorPremium = this._appSessionService.worbbiorPremium;
    }

    ngAfterViewInit(): void {
        $("body").scrollTop(0);

        this.loadingInfoPage();
        this.getInterestCenters();
    }

    clickRouterInterestCenter(interestCenter:InterestCenterDto){
        $("body").scrollTop(0);
        this.router.navigate(['/centro-interesse', interestCenter.slugName])
        this.interestCenterId = interestCenter.id;
        this.imagemBanner = "/assets/metronic/worbby/global/img/banner-activities/" + this.interestCenterId + ".jpg";
        this.searchBanner = "/assets/metronic/worbby/global/img/photo-team@2x.jpg";
        this.findWorbbyTaskInput.interestCenterTopLevelId = this.interestCenterId;
        this.worbbiorPremium = this._appSessionService.worbbiorPremium;
        this.loadingInfoPage();
    }

    becomeWorbbior():void{
        if(abp.session.userId){
            if(!this.permission.isGranted("Pages.Worbbior.SwitchToWorbbientProfile")){
                this.worbbientToWorbbior();
            }else{
                this.router.navigate(['/worbbior/edit-profile']);
            }
        }else{
            this.router.navigate(['/registrar/Worbbior']);
        }
    }

    findByTerm():void{
        this.router.navigate(['/find-a-talents-t', this.filter]); 
    }

    private getCompletedWorbbyTasksByInterestCenter(): void {
        this._worbbyTaskService.findWorbbyTasks(this.findWorbbyTaskInput).subscribe((result: ListResultDtoOfWorbbyTaskDto) => {
            this.completedTasksList = result.items;
            this.active = true; //Coloque no último metodo chamado
            this.carregado = true;
            this.completedTasksList.forEach(element => {
                this.getPictureByGuid(element.interestCenter.parentPictureId).then((result) => {
                    element.interestCenter.parentPicture = result;
                });
            });
        });
    }

    private getActivitiesByInterestCenter(): void {
        this._activitiesService.getActivities(undefined, this.interestCenterId, undefined, undefined, undefined, undefined, undefined, undefined, undefined).subscribe((result: WorbbyPagedResultDtoOfActivityDto) => {
            this.suggestedActivitiesList = result.items;
            this.carregado = true;
        });
    }

    private getInterestCenter(): void {
        this._interestCenterService.getInterestCenter(this.interestCenterId).subscribe((result: InterestCenterDto) => {
            this.interestCenter = result;
            this.getPictureByGuid(this.interestCenter.interestCenterPictureId).then((result) => {
                this.interestCenter.interestCenterPicture = result;
            });
        });
    }

    private getInterestCenters(): void {
        this._interestCenterService.getInterestCentersTopLevel().subscribe((result: ListResultDtoOfInterestCenterDto) => {
            this.interestCenters = result.items;
            this.interestCenters.forEach(element => {
                this.getPictureByGuid(element.interestCenterPictureId).then((result) => {
                    element.interestCenterPicture = result;
                });                
            });
        });
    }

    private getInterestCentersChidren(): void {
        this._interestCenterService.getInterestCentersChildrenById(this.interestCenterId).subscribe((result: ListResultDtoOfInterestCenterDto) => {
            this.carregado = true;
            this.subActivitiesList = result.items;
        });
    }

    private getTopWorbbiorByInterestCenter(): void {
        this.carregado = false;
        this._activitiesService.getWorbbiorActivities(undefined, this.interestCenterId, undefined, undefined, undefined, undefined, undefined, undefined, undefined).subscribe((result: ListResultDtoOfWorbbiorActivityDto) => {
            this.worbbiorTopTalentList = result.items;            
            this.carregado = true;
             this.worbbiorTopTalentList.forEach(element => {
                this.getPictureByGuid(element.worbbior.userPictureId).then((result) => {
                    if(!this.isEmpty(result)){
                        element.worbbior.userPicture = result;
                    }else{
                        element.worbbior.userPicture = AppConsts.defaultProfilePicture;
                    }
                });                
            });
        });
    }

    private loadingInfoPage(): void {
        this.getInterestCenter();        
        this.getInterestCentersChidren();
        this.getTopWorbbiorByInterestCenter();
        this.getActivitiesByInterestCenter();
        this.getCompletedWorbbyTasksByInterestCenter();
    }

    navigateToFindATalent(interestCenterId: number, interestCenterChildId: number, titulo: string): void {
        this.router.navigate(['/talentos/' + interestCenterId, { 'interestCenterChildId': interestCenterChildId, 'filter': titulo }]);
    }

    toogleSubActivity(opened:boolean) {
        this.isOpenedSubActivities = !opened;
    }

    worbbientToWorbbior():void {
        this.message.confirm(
            "Deseja tornar-se também um worbbior?", "Seja um worbbior!",
            isConfirmed => {
                if (isConfirmed) {                    
                        this._worbbiorService.worbbientToWorbbior(new EntityDtoOfInt64({ id: abp.session.userId }))
                    .finally(() => {
                    })
                    .subscribe(() => {
                        this.message.custom('Precisamos de mais algumas informações sobre você, preencha os dados na próxima página para ganhar dinheiro oferecendo suas habilidades. Mas atenção, só após completar todos os campos, o seu perfil Worbbior será ativado na plataforma.', 'Falta pouco para você ser um worbbior!', 'assets/common/images/default-profile-picture.png').done(() => {
                            this._appSessionService.userRoleName = "Worbbior";
                            location.href = "/";
                        });
                    });;
                }
            }
        );        
    }
}