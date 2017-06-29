import { Component, Injector, AfterViewInit, ViewChild, OnInit, Host, Input } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { InterestCenterServiceProxy, ListResultDtoOfInterestCenterDto, ListResultDtoOfUserActivityInput, UserActivityInput, InterestCenterDto, ActivityServiceProxy, ActivityDto } from '@shared/service-proxies/service-proxies';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { CreateOrEditUserActivityModalComponent } from './create-or-edit-user-activity-modal.component';
import { ActivityState, WorbbiorState } from '@shared/AppEnums';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { Router } from '@angular/router';
import { EditProfileWorbbiorComponent } from './edit-profile.component';
import * as _ from 'lodash';

@Component({
    templateUrl: './my-activities.component.html',
    animations: [appModuleAnimation()],
    selector: 'editMyActivitiesWorbbior',
})
export class MyActivitiesWorbbiorComponent extends AppComponentBase implements AfterViewInit {

    @ViewChild('createOrEditUserActivityModal') createOrEditUserActivityModal: CreateOrEditUserActivityModalComponent;
    @Input('editProfile') editProfile: EditProfileWorbbiorComponent;

    public active: boolean = false;
    public worbbiorState: WorbbiorState;
    public myActivities: UserActivityInput[];
    public WorbbiorState: typeof WorbbiorState = WorbbiorState;
    public ActivityState: typeof ActivityState = ActivityState;
    public worbbiorSlug:string;

    public tooltipStatus: string = "O que é Desativar?<br />Você pode desativar e ativar uma atividade sempre que necessário. Por exemplo: você vai viajar e não poderá realizar tarefas nesse período.<br /> Nesse caso, é bom desativar as atividades cadastradas para que não recebe ofertas de worbbients (clientes) que não poderá respondê-las.";
    public tooltipStatusText: string = "O que é Inativa?<br />Uma atividade fica inativa, ou seja, não pode ser oferecida a nenhum worbbient (cliente) da plataforma quando:<br /><ul><li>Falta  um ou duas recomendações para a atividade ser ativada;</li><li>O administrador do sistema solicita ao usuário que faça alguma alteração no título ou descrição da atividade. Essa alteração é informada por e-mail (verifique sempre a sua pasta de Spam ou Promoções).</li></ul>";    

    constructor(
        injector: Injector,
        private _appSessionService: AppSessionService,
        private _activitiesService: ActivityServiceProxy,
        private _router: Router,
    ) {
        super(injector);
    }

    ngAfterViewInit(): void {
        this.getMyAcitivities();
    }

    ngOnInit(): void {
        this.worbbiorState = this._appSessionService.worbbiorState;
        this.worbbiorSlug = this._appSessionService.worbbiorSlug;
    }


    public getMyAcitivities(): void {
        this._activitiesService.getActivitiesByUserId(abp.session.userId).subscribe((result: ListResultDtoOfUserActivityInput) => {
            this.myActivities = result.items;
            this.myActivities.forEach(element => {
                element.listInterestCenter.items.forEach(element => {
                    this.getPictureByGuid(element.parentPictureId).then((result) => {
                        element.parentPicture = result;
                    });
                });
            });
            this.active = true;
        });
    }

    updateActivity(activityUser: UserActivityInput): void {
        this.createOrEditUserActivityModal.show(new UserActivityInput(JSON.parse(activityUser.toJSON())));
    }

    updateWorbbiorState(): void {
        this.worbbiorState = this._appSessionService.worbbiorState;
    }

    removeActivity(activityUser: UserActivityInput): void {
        this.message.confirm(
            this.l('AreYouSureToRemoveTheActivity'), activityUser.title,
            isConfirmed => {
                if (isConfirmed) {
                    this._activitiesService.removeActivityToUser(activityUser.id).subscribe(() => {
                        this.notify.info(this.l('SuccessfullyRemoved'));
                        _.remove(this.myActivities, activityUser);
                    });
                }
            }
        );
    }

    addActivity(): void {
        this.editProfile.editMyPersonalDataWorbbior.save(false, () => {
            this.editProfile.editMyAvailabilityWorbbior.createOrUpdateAddress(false, () => {
                this.editProfile.editMyDocumentsWorbbior.save(false, () => {
                        this._router.navigate(['/worbbior/select-activity']);
                });
            });
        });        
    }

    navigateToPage(url:string):void {
        this.editProfile.editMyPersonalDataWorbbior.save(false, () => {
            this.editProfile.editMyAvailabilityWorbbior.createOrUpdateAddress(false, () => {
                this.editProfile.editMyDocumentsWorbbior.save(false, () => {
                        this._router.navigate([url]);
                });
            });
        });        
    }

    toogleUserActivityState(activityUser: UserActivityInput): void {
        var text = "";
        var activityUserTemp = new UserActivityInput(JSON.parse(activityUser.toJSON()));
        if (activityUserTemp.activityState == Number(ActivityState.Active)) {
            activityUserTemp.activityState = Number(ActivityState.InactiveByWorbbior);
            text = "Deseja desativar essa atividade?"; 
        } else {
            activityUserTemp.activityState = Number(ActivityState.Active);
            text = "Deseja ativar essa atividade?"
        }
        this.message.confirm(
           text, activityUser.title,
            isConfirmed => {
                if (isConfirmed) {
                    this._activitiesService.setUpdateStatusActivityUser(activityUserTemp).subscribe(() => {
                        activityUser.activityState = activityUserTemp.activityState;
                    });
                }
            }
        );

    }
}