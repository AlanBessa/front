import { Component, Injector, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ActivityEndorsementForCreateUpdate, InterestCenterForActivityDto, InterestCenterServiceProxy, WorbbyPagedResultDtoOfActivityDto, ListResultDtoOfInterestCenterDto, ListResultDtoOfUserActivityInput, UserActivityInput, InterestCenterDto, ActivityServiceProxy, ActivityDto } from '@shared/service-proxies/service-proxies';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ActivityState, WorbbiorState, UnitMeasure, CancellationPolicy } from '@shared/AppEnums';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { Angulartics2 } from 'angulartics2';
import * as _ from 'lodash';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: './endorsement-select-activity.component.html',
    animations: [appModuleAnimation()]
})
export class EndorsementSelectActivityComponent extends AppComponentBase implements AfterViewInit {

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
    public WorbbiorState: typeof WorbbiorState = WorbbiorState;
    public activityUser: UserActivityInput;
    public activity: ActivityDto;
    public page: number = 1;
    public showButtonMore = false;
    public totalActivities: number = 0;
    public carregado: boolean = false;
    public filtersActive: boolean = false;

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
        private _activatedRoute: ActivatedRoute,
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
            this.interestCentersTopLevel.forEach(element => {
                this.getPictureByGuid(element.interestCenterPictureId).then((result) => {
                    element.interestCenterPicture = result;
                });
            });
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
        this.page = 1;
        this.totalActivities = 0;
        this.getActivities();
        var filters = "Texto: " + this.filter + " | Centro de Interesse: " + this.currentInterestCenterTopLevel.displayName + " | Subcategoria: " + this.currentInterestCenterChild.displayName;
        this.angulartics2.eventTrack.next({ action: filters, properties: { category: 'Busca Atividades: Editar Perfil Worbbior', label: this._appSessionService.user.emailAddress } });
    }

    private getActivities(): void {
        this.carregado = false;
        this._activitiesService.getActivities(this.filter, this.currentInterestCenterTopLevel.id, this.currentInterestCenterChild.id, undefined, undefined, undefined, undefined, undefined, this.page).subscribe((result: WorbbyPagedResultDtoOfActivityDto) => {
            result.items.forEach(element => {
                this.carregado = true;
                element.listInterestCenter.items.forEach(element => {
                    this.getPictureByGuid(element.parentPictureId).then((result) => {
                        element.parentPicture = result;
                    });
                });
            });
            this.activities.push.apply(this.activities, result.items);
            result.parcialCount == 10 ? this.showButtonMore = true : this.showButtonMore = false;
            this.totalActivities = result.totalCount;
        });
    }

    loadingMore(): void {
        this.page++;
        this.getActivities();
    }
    checkFiltersActive(): void {
        if (this.filter != "" || this.currentInterestCenterTopLevel.id != undefined) {
            this.filtersActive = true;
        } else {
            this.filtersActive = false;
        }
    }
    changeInterestCenterChildren(interestCenter: InterestCenterDto): void {
        if (this.formActive) {
            this.formOut(() => {
                if (interestCenter == null) {
                    interestCenter = new InterestCenterDto();
                    interestCenter.displayName = "Selecione";
                }

                this.currentInterestCenterChild = interestCenter;
                this.getActivitiesByFilter();
            });
        } else {
            if (interestCenter == null) {
                interestCenter = new InterestCenterDto();
                interestCenter.displayName = "Selecione";
            }

            this.currentInterestCenterChild = interestCenter;
            this.getActivitiesByFilter();
        }
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

    selectActivity(activity: ActivityDto): void {
        this.activityUser = new UserActivityInput();
        this.activityUser.userId = this.appSession.endorsement.endorsementDto.userId;
        this.activityUser.activityId = activity.id;
        this.activityUser.activityState = ActivityState[ActivityState.Inactive.toString()];
        this.activityUser.isSuggestActivity = true;
        this.activityUser.endorsementUserId = abp.session.userId;
        this.activityUser.tenantId = abp.session.tenantId;
        this.activityUser.unitMeasure = 0;
        this.activityUser.cancellationPolicy = 0
        this.activityUser.price = 0;
        this.activityUser.title = "";
        this.activityUser.description = "";
        this.message.confirm(
            "Tem certeza que você gostaria de sugerir esta atividade ao worbbior?", activity.title,
            isConfirmed => {
                if (isConfirmed) {
                    this._activitiesService.addSuggestActivityToUser(this.activityUser)
                        .finally(() => {
                            this.saving = false;
                        })
                        .subscribe(() => {
                            this.notify.info(this.l('SavedSuccessfully'));
                            this.formActive = false;
                            if (this.appSession.endorsement.endorsementDto.id) {
                                this.router.navigate(['/endorsement', { 'endorsementId': this.appSession.endorsement.endorsementDto.id }]);
                            } else {
                                this.router.navigate(['/endorsement', { 'userId': this.appSession.endorsement.endorsementDto.userId }]);
                            }

                        });
                }
            }
        );
    }

    clearSelectedInterestCenter(): void {
        if (this.formActive) {
            this.formOut(() => {
                this.changeInterestCenterTopLevel(null);
            });
        } else {
            this.changeInterestCenterTopLevel(null);
        }
    }

    clearSelectedActivity(): void {
        this.formOut(() => {
            this.activityUser = null;
            this.formActive = false;
        })
    }

    updateWorbbiorState(): void {
        this.worbbiorState = this._appSessionService.worbbiorState;
    }

    selectInterestCenterTopLevel(): void {
        if (this.formActive) {
            this.formOut(() => {
                if (this.showInterestCentersTopLevel) {
                    this.showInterestCentersTopLevel = false;
                    return;
                }

                this.showInterestCentersTopLevel = true;
            });
        } else {
            if (this.showInterestCentersTopLevel) {
                this.showInterestCentersTopLevel = false;
                return;
            }

            this.showInterestCentersTopLevel = true;
        }
    }

    changeUnitMeasure(name: string): void {
        this.currentUnitMeasureOptions = name;
        this.activityUser.unitMeasure = UnitMeasure[name];
    }

    changeCancellationPolicy(name: string): void {
        this.currentCancellationPolicyOptions = name;
        this.activityUser.cancellationPolicy = CancellationPolicy[name];
    }

    onKeyUp(event: any): void {
        if (event.keyCode == 13) {
            if (this.formActive) {
                this.formOut(() => {
                    this.getActivitiesByFilter();
                })
            } else {
                this.getActivitiesByFilter();
            }
        }
    }

    termFilterOnblur(): void {
        if (!this.formActive) {
            this.getActivitiesByFilter();
        }
    }

    setTermFilter(): void {
        if (this.formActive) {
            this.formOut(() => {
                this.getActivitiesByFilter();
            })
        } else {
            this.getActivitiesByFilter();
        }
    }

    formOut(callback): void {
        this.message.confirm(
            'Tem certeza que deseja sair?',
            'A atividade ainda não foi gravada!!',
            isConfirmed => {
                if (isConfirmed) {
                    this.formActive = false;
                    callback();
                }
            }
        );
    }

    cleanFilters(): void {
        this.filter = "";
        this.changeInterestCenterTopLevel(null);
        this.getActivitiesByFilter();
    }


    back(): void {
        if (this.appSession.endorsement.endorsementDto.id) {
            this.router.navigate(['/endorsement', { 'endorsementId': this.appSession.endorsement.endorsementDto.id }]);
        } else {
            this.router.navigate(['/endorsement', { 'userId': this.appSession.endorsement.endorsementDto.userId }]);
        }
    }
}