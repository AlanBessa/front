import { Component, Injector, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { InterestCenterForActivityDto, InterestCenterServiceProxy, WorbbyPagedResultDtoOfActivityDto, ListResultDtoOfInterestCenterDto, ListResultDtoOfUserActivityInput, UserActivityInput, InterestCenterDto, ActivityServiceProxy, ActivityDto } from '@shared/service-proxies/service-proxies';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ActivityState, WorbbiorState, UnitMeasure, CancellationPolicy } from '@shared/AppEnums';
import { CreateOrEditUserActivityModalComponent } from './create-or-edit-user-activity-modal.component';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { Angulartics2 } from 'angulartics2';
import * as _ from 'lodash';
import { Router } from '@angular/router';

@Component({
    templateUrl: './select-activity.component.html',
    animations: [appModuleAnimation()]
})
export class SelectActivityComponent extends AppComponentBase implements AfterViewInit {

    @ViewChild('createOrEditUserActivityModal') createOrEditUserActivityModal: CreateOrEditUserActivityModalComponent;

    public active: boolean = false;
    public worbbiorState: WorbbiorState;
    public formActive: boolean = false;
    public saving: boolean = false;
    public showInterestCentersTopLevel: boolean = false;

    public interestCenters: InterestCenterForActivityDto[] = [];
    public interestCentersTopLevel: InterestCenterDto[] = [];
    public interestCentersChidren: InterestCenterDto[] = [];
    public currentInterestCenterTopLevel: InterestCenterDto = new InterestCenterDto();
    public currentInterestCenterChild: InterestCenterDto = new InterestCenterDto();
    public activities: ActivityDto[] = [];
    public myActivities: UserActivityInput[];
    public filter: string = "";
    public filtersActive: boolean = false;
    public WorbbiorState: typeof WorbbiorState = WorbbiorState;
    public activityUser: UserActivityInput;
    public activity: ActivityDto;
    public page: number = 1;
    public showButtonMore = false;
    public totalActivities: number = 0; 
    public carregado: boolean = false;

    UnitMeasure: typeof UnitMeasure = UnitMeasure;
    CancellationPolicy: typeof CancellationPolicy = CancellationPolicy;
    unitMeasureOptions: string[];
    cancellationPolicyOptions: string[];
    currentUnitMeasureOptions: string = "";
    currentCancellationPolicyOptions: string = "";

    constructor(
        injector: Injector,
        private _interestCenterService: InterestCenterServiceProxy,
        private _appSessionService: AppSessionService,
        private _activitiesService: ActivityServiceProxy,
        private router: Router,
        private angulartics2: Angulartics2
    ) {
        super(injector);
    }

    ngAfterViewInit(): void {
        this.getInterestCentersTopLevel();
    }

    ngOnInit(): void {
        this.worbbiorState = this._appSessionService.worbbiorState;
    }

    private getInterestCentersTopLevel(): void {
        this._interestCenterService.getInterestCentersTopLevel().subscribe((result: ListResultDtoOfInterestCenterDto) => {
            this.interestCentersTopLevel = result.items;
            this.currentInterestCenterTopLevel.displayName = "Selecione";
            this.currentInterestCenterChild.displayName = "Selecione";
            this.getActivities();
            this.active = true;
        });
    }

    private getInterestCentersChidren(interestCenter: InterestCenterDto): void {
        this.changeInterestCenterChildren(null);
        this._interestCenterService.getInterestCentersChildrenById(interestCenter.id).subscribe((result: ListResultDtoOfInterestCenterDto) => {
            this.interestCentersChidren = result.items;
            this.currentInterestCenterChild = new InterestCenterDto();
            this.currentInterestCenterChild.displayName = "Selecione";
            this.active = true;
        });
    }

    private getActivitiesByFilter(): void {
        this.checkFiltersActive();
        this.activities = [];
        this.totalActivities = 0;
        this.page = 1;
        this.getActivities();
        var filters = "Texto: " + this.filter + " | Centro de Interesse: " + this.currentInterestCenterTopLevel.displayName + " | Subcategoria: " + this.currentInterestCenterChild.displayName;
        this.angulartics2.eventTrack.next({ action: filters, properties: { category: 'Busca Atividades: Editar Perfil Worbbior', label: this._appSessionService.user.emailAddress }});
    }

    private getActivities(): void {
        this.carregado = false;
        this._activitiesService.getActivities(this.filter, this.currentInterestCenterTopLevel.id, this.currentInterestCenterChild.id, undefined, undefined, undefined, undefined, undefined, this.page).subscribe((result: WorbbyPagedResultDtoOfActivityDto) => {
            this.carregado = true;
            this.activities.push.apply(this.activities, result.items);
            result.parcialCount == 10 ? this.showButtonMore = true : this.showButtonMore = false;
            this.totalActivities = result.totalCount;
        });
    }

    loadingMore(): void {
        this.page++;
        this.getActivities();
    }

    changeInterestCenterChildren(interestCenter: InterestCenterDto): void {        
        if (interestCenter == null) {
            interestCenter = new InterestCenterDto();
            interestCenter.displayName = "Selecione";
        }

        this.currentInterestCenterChild = interestCenter;
        this.getActivitiesByFilter();
    }

    changeInterestCenterTopLevel(interestCenter: InterestCenterDto): void {
        if (interestCenter == null) {
            interestCenter = new InterestCenterDto();
            interestCenter.displayName = "Selecione";
        }

        this.currentInterestCenterTopLevel = interestCenter;
        this.getInterestCentersChidren(this.currentInterestCenterTopLevel);
        this.showInterestCentersTopLevel = false; 
    }

    selectActivity(activityId: number):void {
        this.activityUser = new UserActivityInput();
        this.activityUser.userId = abp.session.userId;
        this.activityUser.activityId = activityId;
        this.activityUser.activityState = ActivityState[ActivityState.Active.toString()];
        this.activityUser.isSuggestActivity = false;
        
        this.createOrEditUserActivityModal.show(new UserActivityInput(this.activityUser.toJSON()));
    }

    addActivity():void {
        this.notify.info(this.l('SavedSuccessfully'));
        this.router.navigate(['/worbbior/edit-profile/myActivities']);
    }

    clearSelectedInterestCenter(): void {
        this.changeInterestCenterTopLevel(null);
    }

    updateWorbbiorState(): void {
        this.worbbiorState = this._appSessionService.worbbiorState;
    }

    selectInterestCenterTopLevel(): void {
        if (this.showInterestCentersTopLevel) {
            this.showInterestCentersTopLevel = false;
            return;
        }

        this.showInterestCentersTopLevel = true;
    }

    onKeyUp(event: any): void {
        if (event.keyCode == 13) {
            this.getActivitiesByFilter();
        }
    }

    termFilterOnblur(): void {
        if (!this.formActive) {
            this.getActivitiesByFilter();
        }
    }

    setTermFilter(): void {
        this.getActivitiesByFilter();
    }

    cleanFilters(): void {
        this.filter = "";
        this.changeInterestCenterTopLevel(null);
        this.getActivitiesByFilter();
    }

    checkFiltersActive():void{
        if(this.filter != "" || this.currentInterestCenterTopLevel.id != undefined ){
            this.filtersActive = true;
        }else{
            this.filtersActive = false;
        }
    }

    cleanTermFilter():void{
        this.filter = "";
        this.getActivitiesByFilter();
    }

    cleanInterestCenterTopLevelFilter():void{
        this.changeInterestCenterTopLevel(null);
    }

    cleanInterestCenterChildFilter():void{
        this.changeInterestCenterChildren(null);
    }

    close(): void {

    }
}