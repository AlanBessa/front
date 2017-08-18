import { Component, Injector, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { InterestCenterServiceProxy, WorbbyTaskServiceProxy, WorbbyTaskDto, ListResultDtoOfInterestCenterDto, InterestCenterDto, AddressDto, UserActivityInput, WorbbyTaskInput } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { TimeEnum, AdministrativeAreas, KeyValueAddress, ScheduleDateType, UnitMeasure, WorbbyTaskStatus, Countries, KeyValueItem } from "shared/AppEnums";
import { MapsAPILoader } from "@agm/core";
import * as _ from 'lodash';
import * as moment from "moment"
import 'moment/min/locales';

@Component({
    templateUrl: './worbbient-edit-worbby-task.component.html',
    animations: [appModuleAnimation()]
})
export class WorbbientEditWorbbyTaskComponent extends AppComponentBase implements AfterViewInit {
  
    @ViewChild('btnScheduleDateType1') btnScheduleDateType1;

    public active: boolean = false;
    public saving: boolean = false;
    public idWorbbyTask: number = 0;

    public worbbyTask: WorbbyTaskDto = new WorbbyTaskDto();
    public address: AddressDto = new AddressDto();

    public interestCentersChidren: InterestCenterDto[] = [];
    public currentInterestCenterTopLevel: InterestCenterDto = new InterestCenterDto();
    public currentInterestCenterChild: InterestCenterDto = new InterestCenterDto();

    public showDataPicker: boolean = false;
    public showInterestCentersTopLevel: boolean = false;
    public currentUnitMeasureOptions: string = "";
    public unitMeasureOptions: string[] = [];
    public isOffer: boolean = false;
    public isUnitPrice: string = "1";
    public userActivity: UserActivityInput;

    public AppConsts: typeof AppConsts = AppConsts;

    public ScheduleDateType: typeof ScheduleDateType = ScheduleDateType;
    public UnitMeasure: typeof UnitMeasure = UnitMeasure;
    public WorbbyTaskStatus: typeof WorbbyTaskStatus = WorbbyTaskStatus;
    public scheduleDateDisplay:string = "Fixa";

    public countries: Countries = new Countries();
    public currentCountry: KeyValueItem;

    public administrativeAreas: AdministrativeAreas = new AdministrativeAreas();
    public currentAdministrativeArea: KeyValueAddress;

    public TimeEnum: typeof TimeEnum = TimeEnum;
    public timeEnumOptions: string[];
    public currentTimeEnumOptions: string = "";
    
    constructor(
        injector: Injector,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _interestCenterService: InterestCenterServiceProxy,
        private _worbbyTaskService: WorbbyTaskServiceProxy,
        private mapsAPILoader: MapsAPILoader
    ) {
        super(injector);        
    }

    ngOnInit(): void {
        var arrayTimeEnumOptions = Object.keys(TimeEnum);
        this.timeEnumOptions = arrayTimeEnumOptions.slice(arrayTimeEnumOptions.length / 2);
        this.currentTimeEnumOptions = this.timeEnumOptions[0];


        moment.locale('pt-br');
        this.administrativeAreas.items = this.administrativeAreas.items.filter(x => x.id == "RJ");
        
        this.idWorbbyTask = this._activatedRoute.snapshot.params['worbbyTaskId'];

        this.worbbyTask.scheduleDateType = Number(ScheduleDateType.WhenPossible);

        var unitMeasureOptions = Object.keys(UnitMeasure);
        this.unitMeasureOptions = unitMeasureOptions.slice(unitMeasureOptions.length / 2);
        this.currentUnitMeasureOptions = this.unitMeasureOptions[0];
        this.worbbyTask.unitMeasure = UnitMeasure[this.currentUnitMeasureOptions];
        this.worbbyTask.isUnitPrice = true;
        this.worbbyTask.unitPrice = 0;
        this.worbbyTask.amount = 0;
        this.worbbyTask.totalPrice = 0;
        this.worbbyTask.time = TimeEnum[this.currentTimeEnumOptions];

        this.currentAdministrativeArea = this.administrativeAreas.items[0];
        this.address.administrativeArea = this.currentAdministrativeArea.id;
        this.currentCountry = this.countries.items[0];
        this.address.country = this.currentCountry.key;
        this.getInterestCenters();
        this.getWorbbyTaskDetails();
    }

    ngAfterViewInit(): void {
        $("body").scrollTop(0);
        $(".page-loading").hide();
    }

    private getInterestCenters(): void {
        if(this.appSession.interestCentersTopLevel.length == 0){
            this.getInterestCentersTopLevel();
        }
        this.currentInterestCenterTopLevel.displayName = "Selecione";
        this.currentInterestCenterChild.displayName = "Selecione";
        this.active = true; 
    }

    getWorbbyTaskDetails(): void {
        this._worbbyTaskService.getWorbbyTask(this.idWorbbyTask).subscribe(result => { 
            console.log(result.creationTime);
            this.worbbyTask = result;
            this.address = result.address;
            this.isUnitPrice = this.worbbyTask.isUnitPrice ? "1" : "0";
            this.currentUnitMeasureOptions = UnitMeasure[result.unitMeasure].toString();
            this.currentTimeEnumOptions = TimeEnum[result.time];

            if(result.scheduledDate) this.scheduleDateDisplay = result.scheduledDate.format('DD/MM/YYYY');

            if(result.userActivity != null) {
                this.isOffer = true;

                this.userActivity = result.userActivity;
            }
            else {
                this._interestCenterService.getInterestCenter(this.worbbyTask.interestCenter.parentId).subscribe(result => {
                    this.currentInterestCenterTopLevel = result;

                    this._interestCenterService.getInterestCentersChildrenById(this.currentInterestCenterTopLevel.id).subscribe((result: ListResultDtoOfInterestCenterDto) => {
                        this.interestCentersChidren = result.items;
                        this.currentInterestCenterChild.id = this.worbbyTask.interestCenter.id;
                        this.currentInterestCenterChild.displayName = this.worbbyTask.interestCenter.displayName;
                        this.currentInterestCenterChild.interestCenterPicture = this.worbbyTask.interestCenter.interestCenterPicture; 
                        
                        this.active = true;
                    });                    
                });
            }

            if(this.worbbyTask.userId != abp.session.userId) this._router.navigate(['/worbbient/my-worbby']);
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

    changeInterestCenterChildren(interestCenter: InterestCenterDto): void {        
        if (interestCenter == null) {
            interestCenter = new InterestCenterDto();
            interestCenter.displayName = "Selecione";
        }

        this.currentInterestCenterChild = interestCenter;
        this.worbbyTask.interestCenterId = interestCenter.id;
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

    changeIsUnitPrice(event) :void {
        this.worbbyTask.isUnitPrice = (event == true);
    }

    changeAdministativeArea(item: KeyValueAddress): void {
        this.currentAdministrativeArea = item;
        this.address.administrativeArea = item.id;
    }

    changeCountry(item: KeyValueItem): void {
        this.currentCountry = item;
        this.address.country = item.key;
    }

    changeUnitMeasure(name: string): void {
        this.currentUnitMeasureOptions = name;
        this.worbbyTask.unitMeasure = UnitMeasure[name];
    }

    changeTime(name:string):void {
        this.currentTimeEnumOptions = name;
        this.worbbyTask.time = TimeEnum[name];
    }

    scheduleDateWhenPossibleChange():void {
        if(this.worbbyTask.scheduleDateType != Number(ScheduleDateType.WhenPossible)){
            this.worbbyTask.scheduleDateType = Number(ScheduleDateType.WhenPossible);
        }
        this.scheduleDateDisplay = "Fixa";
        this.worbbyTask.scheduledDate = null;
    }

    scheduleDateFixeChange():void {
        if(this.worbbyTask.scheduleDateType != Number(ScheduleDateType.Fixed)){
            this.worbbyTask.scheduleDateType = Number(ScheduleDateType.Fixed);
        }
        this.showDataPicker = true;        
    }

    scheduleDateDone(event):void {
        this.scheduleDateDisplay = moment(event).format('DD/MM/YYYY');
        this.showDataPicker = false;
    }

    selectInterestCenterTopLevel(): void {
        if (this.showInterestCentersTopLevel) {
            this.showInterestCentersTopLevel = false;
            return;
        }

        this.showInterestCentersTopLevel = true;
    }

    setTotalPrice():void{
        if(this.worbbyTask.isUnitPrice){
            this.worbbyTask.totalPrice = this.worbbyTask.amount * this.worbbyTask.unitPrice;
        }
    }

    save():void{
        this.saving = true;
        let task = new WorbbyTaskInput();
        task.address = this.address;
        task.worbbyTask = this.worbbyTask;



        if(task.worbbyTask.activityUserId == null){
            this._worbbyTaskService.editPublicWorbbyTask(task)
            .finally(() => {
                this.saving = false;
            })
            .subscribe(() => {                    
                this.message.custom('Se a sua tarefa já tiver ofertas de worbbiors, eles serão notificados desta alteração.', 'Sua tarefa foi editada!', 'assets/common/images/icon-rocket@2x.png').done(() => {
                    this._router.navigate(['/worbbient/my-worbby']);
                });         
            });
        }else{
            this._worbbyTaskService.editProposedWorbbyTask(task)
            .finally(() => {
                this.saving = false;
            })
            .subscribe(() => {
                this.message.custom('O worbbior será notificados desta alteração.', 'Sua tarefa foi editada!', 'assets/common/images/icon-rocket@2x.png').done(() => {
                    this._router.navigate(['/worbbient/my-worbby']);
                });                               
            });
        }
    }
}