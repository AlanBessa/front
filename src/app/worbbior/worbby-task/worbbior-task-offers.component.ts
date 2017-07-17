import { Component, Injector, AfterViewInit, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { WorbbyTaskServiceProxy, WorbbyTaskDto, WorbbyOfferDto } from '@shared/service-proxies/service-proxies';
import { Router, ActivatedRoute } from '@angular/router';
import { ScheduleDateType, UnitMeasure } from '@shared/AppEnums';
import { AppConsts } from '@shared/AppConsts';
import * as _ from 'lodash';
import * as moment from "moment";

@Component({
    templateUrl: './worbbior-task-offers.component.html',
    animations: [appModuleAnimation()]
})
export class WorbbiorTaskOffersComponent extends AppComponentBase implements AfterViewInit {

    public active:boolean = false;
    public worbbyTaskId: number;
    public worbbyTask:WorbbyTaskDto;
    public saving:boolean = false;
    public scheduleDateDisplay: string;

    public ScheduleDateType: typeof ScheduleDateType = ScheduleDateType;
    public UnitMeasure: typeof UnitMeasure = UnitMeasure;
    public AppConsts: typeof AppConsts = AppConsts;

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

        this._worbbyTaskService.getWorbbyTaskWithOffers(this.worbbyTaskId).subscribe(result => {
            this.worbbyTask = result;

            this.scheduleDateDisplay = result.scheduledDate ? moment(result.scheduledDate).format('L') : this.scheduleDateDisplay;

            this.worbbyTask.offersList.items.forEach(element => {
                this.getPictureByGuid(element.worbbior.userPictureId).then((result) => {
                    element.worbbior.userPicture = result;
                });
            });
            this.active = true;
        });

    }

    ngAfterViewInit(): void {
    }
}