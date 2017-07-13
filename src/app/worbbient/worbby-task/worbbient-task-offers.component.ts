import { Component, Injector, AfterViewInit, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { WorbbyTaskServiceProxy, WorbbyTaskDto, WorbbyOfferDto } from '@shared/service-proxies/service-proxies';
import { Router, ActivatedRoute } from '@angular/router';
import { ScheduleDateType, UnitMeasure, CancellationPolicy } from '@shared/AppEnums';
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
    public UnitMeasure: typeof UnitMeasure = UnitMeasure;
    public AppConsts: typeof AppConsts = AppConsts;
    public CancellationPolicy: typeof CancellationPolicy = CancellationPolicy;

    public tooltipPoliticaCancelamento: string = "Você é quem decide qual será o valor a ser devolvido ao cliente (worbbient) caso a tarefa contratada seja cancelada por ele. Escolha uma das opções:<br /><br /> <strong>Superflexível:</strong> 100% de reembolso do valor da tarefa até 4 horas antes da hora prevista.<br /><br /> <strong>Flexível:</strong> 100% de reembolso do valor da tarefa até 24 horas antes da data prevista.<br /><br /> <strong>Moderada:</strong> 50% de reembolso do valor da tarefa até 48 horas da data prevista.<br /><br /> <strong>Rígida:</strong> 50% de reembolso do valor da tarefa até 5 dias (120 horas) antes da data prevista.";

    constructor(
        injector: Injector,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _worbbyTaskService: WorbbyTaskServiceProxy
    ) {
        super(injector);
    }

    ngOnInit(): void {

        this.worbbyTaskId = this._activatedRoute.snapshot.params['worbbyTaskId'];

        this.getWorbbyTaskWithOffers(this.worbbyTaskId);
    }

    ngAfterViewInit(): void {
    }

    getWorbbyTaskWithOffers(taskId): void {
        this._worbbyTaskService.getWorbbyTaskWithOffers(taskId).subscribe(result => {
            this.worbbyTask = result;

            this.scheduleDateDisplay = moment(result.creationTime).format('L');

            this.worbbyTask.offersList.items.forEach(element => {
                this.getPictureByGuid(element.worbbior.userPictureId).then((result) => {
                    element.worbbior.userPicture = result;
                });
            });
            this.active = true;
        }); 
    }

    acceptOffer(offer:WorbbyOfferDto):void {
        this.saving = true;

        this._worbbyTaskService.offerAcceptedByWorbbient(offer)
        .finally(() => {
            this.saving = false;
        })
        .subscribe(() => {
            this.message.custom('Oferta aceita.', 'Sucesso!', 'assets/common/images/default-profile-picture.png').done(() => {
             });
            this._router.navigate(['/worbbient/worbby-task-details', offer.worbbyTaskId]);
        });
    }
}