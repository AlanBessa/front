import { Component, Injector, AfterViewInit, OnInit, ElementRef } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ListResultDtoOfEvaluationValueDto, WorbbyTaskServiceProxy, EvaluationServiceProxy, EvaluationTypeServiceProxy, EvaluationTypeDto, EvaluationValueDto, EvaluationInput, WorbbyTaskDto } from '@shared/service-proxies/service-proxies';
import { Router, ActivatedRoute } from '@angular/router';
import { AppConsts } from '@shared/AppConsts';


@Component({
    templateUrl: './worbbient-evaluate-worbbior.component.html',
    animations: [appModuleAnimation()]
})
export class EvaluateWorbbiorComponent extends AppComponentBase implements AfterViewInit {

    public evaluationValues: EvaluationValueDto[] = [];

    public evaluation: EvaluationInput = new EvaluationInput();

    public saving:boolean = false;

    public active:boolean = false;

    public worbbyTask:WorbbyTaskDto;
    
    public worbbyTaskId:number;

    constructor(
        injector: Injector,
        private _evaluationService: EvaluationServiceProxy,
        private _evaluationTypeService: EvaluationTypeServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _worbbyTaskService: WorbbyTaskServiceProxy
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.worbbyTaskId = Number(this._activatedRoute.snapshot.params['worbbyTaskId']);
        this.getWorbbyTask();
    }

    ngAfterViewInit(): void {
        $("body").scrollTop(0);
        $(".page-loading").hide();    
    }

    getWorbbyTask():void{
        this._worbbyTaskService.getWorbbyTask(this.worbbyTaskId).subscribe(result => {
            this.worbbyTask = result;
            this.getPictureByGuid(this.worbbyTask.worbbior.userPictureId).then((result) => {
                if(!this.isNullOrEmpty(result)){
                    this.worbbyTask.worbbior.userPicture = result;
                }else{
                    this.worbbyTask.worbbior.userPicture = AppConsts.defaultProfilePicture;
                }
            });
            this.getEvaluationTypes();
        });
    }

    getEvaluationTypes():void{
        this._evaluationTypeService.getEvaluationTypes().subscribe(result => {
            this.evaluationValues = result.items;
            console.log(result.items);
            this.active = true;
        });
    }

    save():void{
        this.saving = true;

        this.evaluation.userId = abp.session.userId;
        this.evaluation.toUserId = this.worbbyTask.targetUserId;
        this.evaluation.listEvaluationValues = new ListResultDtoOfEvaluationValueDto();
        this.evaluation.listEvaluationValues.items = this.evaluationValues;
        this.evaluation.worbbyTaskId = this.worbbyTask.id;
        this.evaluation.userActivityId = this.worbbyTask.activityUserId;
        this._evaluationService.createEvaluation(this.evaluation)
        .finally(() => { this.saving = false; })
        .subscribe((result) => {
            //TODO: Alan - Implementar mensagem sucesso customizada
            this._router.navigate(['/worbbient/my-worbby']);
        });
    }

}