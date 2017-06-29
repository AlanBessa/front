import { Component, Injector, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { WorbbiorProfileDto, UserActivityInput, ActivityServiceProxy, WorbbiorDto, WorbbiorServiceProxy, WorbbyTaskDto, WorbbyTaskInput, AddressDto, InterestCenterDto, InterestCenterServiceProxy, ListResultDtoOfInterestCenterDto, WorbbyTaskServiceProxy } from '@shared/service-proxies/service-proxies';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ScheduleDateType, Countries, AdministrativeAreas, KeyValueItem, KeyValueAddress, UnitMeasure, WorbbyTaskStatus } from '@shared/AppEnums';
import { TabsetComponent } from 'ngx-bootstrap';
import { AppConsts } from '@shared/AppConsts';
import { MapsAPILoader } from '@agm/core';
import * as _ from 'lodash';
import * as moment from "moment"; 

declare var google: any;

@Component({
    templateUrl: './post-a-task.component.html',
    animations: [appModuleAnimation()]
})
export class PostTaskComponent extends AppComponentBase implements AfterViewInit {

    @ViewChild('stepOneForm') stepOneForm;
    @ViewChild('stepTwoForm') stepTwoForm;
    @ViewChild('stepThreeForm') stepThreeForm;

    @ViewChild('btnScheduleDateType1') btnScheduleDateType1; 
    @ViewChild('btnScheduleDateType2') btnScheduleDateType2;

    public saving:boolean = false;
    public activeStep:number = 1;
    public worbbyTask:WorbbyTaskDto = new WorbbyTaskDto();
    public address:AddressDto = new AddressDto();
    public active:boolean = false;
    public showDataPicker:boolean = false;
    public showInterestCentersTopLevel:boolean = false;
    public public:boolean = true;
    public isOffer:boolean = false;
    public isUnitPrice:string = "1";
    public register:boolean = true;
    public activityUserId:number;
    public worbbiorProfile: WorbbiorProfileDto;
    public userActivity: UserActivityInput;

    public currentUnitMeasureOptions: string = "";
    public unitMeasureOptions: string[] = [];

    public stepOneValid:boolean = false;
    public stepTwoValid:boolean = false;
    public stepThreeValid:boolean = false;
    public stepFourValid:boolean = false;

    public AppConsts: typeof AppConsts = AppConsts;

    public ScheduleDateType: typeof ScheduleDateType = ScheduleDateType;
    public UnitMeasure: typeof UnitMeasure = UnitMeasure;
    public WorbbyTaskStatus: typeof WorbbyTaskStatus = WorbbyTaskStatus;
    public scheduleDateDisplay:string = "Fixa";

    public countries: Countries = new Countries();
    public currentCountry: KeyValueItem;

    public administrativeAreas: AdministrativeAreas = new AdministrativeAreas();
    public currentAdministrativeArea: KeyValueAddress;

    public interestCentersTopLevel: InterestCenterDto[] = [];
    public interestCentersChidren: InterestCenterDto[] = [];
    public currentInterestCenterTopLevel: InterestCenterDto = new InterestCenterDto();
    public currentInterestCenterChild: InterestCenterDto = new InterestCenterDto();

    public currentTime:string = "Qualquer horário";

    private completeAddress:string = "";

    constructor(
        injector: Injector,
        private _interestCenterService: InterestCenterServiceProxy,
        private _worbbyTaskService: WorbbyTaskServiceProxy,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _worbbiorService: WorbbiorServiceProxy,
        private _activitiesService: ActivityServiceProxy,
        private mapsAPILoader: MapsAPILoader
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.administrativeAreas.items = this.administrativeAreas.items.filter(x => x.id == "RJ");
        if (abp.session.userId) 
                this.public = false;

        this.activityUserId = this._activatedRoute.snapshot.params['activityUserId'];

        this.worbbyTask.scheduleDateType = Number(ScheduleDateType.WhenPossible);

        var unitMeasureOptions = Object.keys(UnitMeasure);
        this.unitMeasureOptions = unitMeasureOptions.slice(unitMeasureOptions.length / 2);
        this.currentUnitMeasureOptions = this.unitMeasureOptions[0];
        this.worbbyTask.unitMeasure = UnitMeasure[this.currentUnitMeasureOptions];
        this.worbbyTask.isUnitPrice = true;
        this.worbbyTask.unitPrice = 0;
        this.worbbyTask.amount = 0;
        this.worbbyTask.totalPrice = 0;
        this.worbbyTask.time = this.currentTime;

        if(this.activityUserId){
            this._activitiesService.getUserActivity(this.activityUserId).subscribe(result => {
                this.userActivity = result;
                this.worbbyTask.unitPrice = this.userActivity.price;
                this.worbbyTask.unitMeasure = Number(this.userActivity.unitMeasure);
                this.currentUnitMeasureOptions = UnitMeasure[this.worbbyTask.unitMeasure];
                this.isOffer = true;
                this.userActivity.listInterestCenter.items.forEach(element => {
                    this.getPictureByGuid(element.parentPictureId).then((result) => {
                        element.parentPicture = result;
                    });
                });
                this._worbbiorService.getWorbbiorProfileByUserId(result.userId).subscribe(result => {
                    this.worbbiorProfile = result;
                    this.getPictureByGuid(this.worbbiorProfile.worbbior.userPictureId).then((result) => {
                        if(!this.isEmpty(result)){
                            this.worbbiorProfile.worbbior.userPicture = result;
                        }else{
                            this.worbbiorProfile.worbbior.userPicture = AppConsts.defaultProfilePicture;
                        }
                    });   
                    this.worbbiorProfile.userActivities.items.forEach(element => {
                        element.listInterestCenter.items.forEach(element => {
                            this.getPictureByGuid(element.parentPictureId).then((result) => {
                                element.parentPicture = result;
                            });                
                        });               
                    });
                    this.getLocation();
                });
            });
        }       

        this.currentAdministrativeArea = this.administrativeAreas.items[0];
        this.address.administrativeArea = this.currentAdministrativeArea.id;
        this.currentCountry = this.countries.items[0];
        this.address.country = this.currentCountry.key;
    }

    ngAfterViewInit(): void {
        $("body").scrollTop(0);
        //this.setValidSteps();
        this.getInterestCentersTopLevel();    
    }

    private getInterestCentersTopLevel(): void {
        this._interestCenterService.getInterestCentersTopLevel().subscribe((result: ListResultDtoOfInterestCenterDto) => {
            this.interestCentersTopLevel = result.items;
            this.currentInterestCenterTopLevel.displayName = "Selecione";
            this.currentInterestCenterChild.displayName = "Selecione";
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

    selectInterestCenterTopLevel(): void {
        if (this.showInterestCentersTopLevel) {
            this.showInterestCentersTopLevel = false;
            return;
        }

        this.showInterestCentersTopLevel = true;
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
        this.scheduleDateDisplay = moment(event).format('L');
        this.showDataPicker = false;
    }

    showStep1():void{
        this.setValidSteps();
        this.activeStep = 1;
    }
    showStep2():void{
        this.setValidSteps();
        if(this.stepOneForm.form.valid){
            this.activeStep = 2;
        }
    }
    showStep3():void{
        this.setValidSteps();
        if(this.stepTwoForm.form.valid){
            this.activeStep = 3;
        }
    }
    showStep4():void{
        this.setTotalPrice();
        this.setValidSteps();
        this.completeAddress = this.address.thoroughfare + ", " + this.address.thoroughfareNumber + " - " + this.address.subLocality + " - " + this.address.locality + " - " + this.address.administrativeArea;
        this.completeAddress = this.completeAddress.replace(/undefined/gi, "");

        this.getGeolocation();
        
        if(this.stepThreeForm.form.valid){
            this.activeStep = 4;
        }
    }

    setTotalPrice():void{
        if(this.worbbyTask.isUnitPrice){
            this.worbbyTask.totalPrice = this.worbbyTask.amount * this.worbbyTask.unitPrice;
        }
    }

    save():void{
        
        this.saving = true;
        var task = new WorbbyTaskInput();
        task.address = this.address;
        task.address.userId = abp.session.userId;
        task.address.name = task.address.thoroughfare;
        task.worbbyTask = this.worbbyTask;
        task.worbbyTask.userId = abp.session.userId;
        task.worbbyTask.targetUserId = this.worbbiorProfile ? this.worbbiorProfile.worbbior.userId : null;
        task.worbbyTask.activityUserId = this.activityUserId;
        task.worbbyTask.interestCenterId = this.currentInterestCenterChild.id;
        task.worbbyTask.status = Number(WorbbyTaskStatus.Post);

        if(task.worbbyTask.targetUserId == abp.session.userId){
            this.message.error('Você não pode propor uma tarefa para si mesmo!', 'Ops! Algo deu errado.')
            .done(() => {
                this.saving = false;
            });
        }else{
            if(task.worbbyTask.activityUserId == null){
                this._worbbyTaskService.postPublicWorbbyTask(task)
                .finally(() => {
                    this.saving = false;
                })
                .subscribe(() => {                    
                    this.message.custom('Acompanhe sua tarefa na página "Meu Worbby". <strong>Você será notificado quando Worbbiors</strong> fizerem ofertas para a sua tarefa', 'Sua tarefa foi postada!', 'assets/common/images/icon-dove@2x.png').done(() => {
                        this._router.navigate(['/worbbient/my-worbby']);
                    });       
                });
            }else{
                this._worbbyTaskService.postProposedWorbbyTask(task)
                .finally(() => {
                    this.saving = false;
                })
                .subscribe(() => {
                    this.message.custom('Você será notificado quando o worbbior aceitar a sua proposta. Acompanhe em seu perfil.', 'Sua proposta foi enviada!', 'assets/common/images/icon-rocket@2x.png').done(() => {
                        this._router.navigate(['/worbbient/my-worbby']);
                    });                             
                });
            }
        }
        
    }

    setValidSteps():void{
        this.stepOneValid = this.stepOneForm.form.valid;
        this.stepTwoValid = this.stepTwoForm.form.valid;
        this.stepThreeValid = this.stepThreeForm.form.valid;
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

    changeTime(value:string):void {
        this.worbbyTask.time = value;
        this.currentTime = value;
    }

    showRegister():void{        
        this.register = true;
    }

    showLogin():void {
        this.register = false;
    }

    changeIsUnitPrice(event) :void {
        this.worbbyTask.isUnitPrice = (event == true);
    }

    getLocation():void  {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.worbbiorProfile.worbbior.distance = Math.round(this.distance(Number(this.worbbiorProfile.address.latitude), Number(this.worbbiorProfile.address.longitude),position.coords.latitude,position.coords.longitude));
            });
        }
    }

    getGeolocation():void {
        var self = this;
        this.mapsAPILoader.load().then(() => {
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({ 'address': this.completeAddress }, function (results, status) {
                if(results[0] != undefined){
                    self.address.latitude = results[0].geometry.location.lat();
                    self.address.longitude = results[0].geometry.location.lng();
                }
            });
        });
    }    
}