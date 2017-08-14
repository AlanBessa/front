import { Component, Injector, AfterViewInit, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ActivatedRoute, Router } from '@angular/router';
import { SlickSliderComponent } from '@shared/slick-slider.component';
import { UserActivityInput, ListResultDtoOfInterestCenterDto, InterestCenterServiceProxy, InterestCenterDto, ActivityServiceProxy, WorbbiorActivityDto, WorbbyPagedResultDtoOfWorbbiorActivityDto } from '@shared/service-proxies/service-proxies';
import { UnitMeasure } from '@shared/AppEnums';
import {AppConsts} from '@shared/AppConsts';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { Angulartics2 } from 'angulartics2';
import { FindTalentMapComponent } from "app/find-talent/find-talent-map/find-talent-map.component";

@Component({
    templateUrl: './talent-page.component.html',
    animations: [appModuleAnimation()]
})
export class TalentPageComponent extends AppComponentBase implements AfterViewInit {

    @ViewChild('findTalentMapComponent') findTalentMapComponent: FindTalentMapComponent;

    worbbiorActivities: WorbbiorActivityDto[] = [];
    public active: boolean = false;
    public filter: string = "";
    public address: string  = "";
    public interestCentersChidren: InterestCenterDto[] = [];
    public currentInterestCenterTopLevel: InterestCenterDto = new InterestCenterDto();
    public currentInterestCenterChild: InterestCenterDto = new InterestCenterDto();
    public UnitMeasure: typeof UnitMeasure = UnitMeasure;
    public interestCenterId: number;
    public interestCenterChildId: number;
    public orderby: string  = "";
    public orderByPrice: boolean = false;
    public orderByDistance: boolean = false;
    public tabFeaturesActive: boolean = true;
    public filtersActive: boolean = false;
    public latitude:string;
    public longitude:string;
    public carregado: boolean = false;

    public page: number = 1;
    public totalWorbbiorActivities: number = 0; 
    public showButtonMore = false;

    public isCleanFilters:boolean = true;

    public tipoDoDisplay: string = "lista";

    constructor(
        injector: Injector,
        private _activitiesService: ActivityServiceProxy,
        private _interestCenterService: InterestCenterServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _appSessionService: AppSessionService,
        private angulartics2: Angulartics2,
        private router: Router,
    ) {
        super(injector);
    }

    ngOnInit(){
        let self = this;
        self.interestCenterId = self._activatedRoute.snapshot.params['interestCenterId'];
        self.interestCenterChildId = self._activatedRoute.snapshot.params['interestCenterChildId'];
        self.filter = self._activatedRoute.snapshot.params['filter'] == undefined || self._activatedRoute.snapshot.params['filter'] == "undefined" ? "" : self._activatedRoute.snapshot.params['filter'];
        //this.tabFeaturesActive = this._activatedRoute.snapshot.params['feature'];
        
        if (self.interestCenterId || this.filter) {
            self.isCleanFilters = false;
            $('.find-talent-content a[href="#talents"]').click();
        }else if(self.tabFeaturesActive){
            $('.find-talent-content a[href="#featured"]').click();
        } 

        self.tabFeaturesActive = $("#featured").hasClass("active"); 
        
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            self.tabFeaturesActive = $("#featured").hasClass("active");
            $("body").scrollTop(0);
            if(self.tabFeaturesActive){
                //self.cleanFilters();
            }else if(self.isCleanFilters){
                self.cleanFilters();
            }         
            self.isCleanFilters = true
        })

        self.getLocation();        
    }

    ngOnDestroy(): void {
        
    }

    ngAfterViewInit(): void {
        $("body").scrollTop(0);
        $(".page-loading").hide();
        // if(!self.tabFeaturesActive){
            // this.getInterestCenters();
        // }               
    }

    checkFiltersActive():void{
        if(this.filter != "" || this.currentInterestCenterTopLevel.id != undefined || this.address != ""  || this.orderby != "" ){
            this.filtersActive = true;
            var filters = "Texto: " + this.filter + " | Centro de Interesse: " + this.currentInterestCenterTopLevel.displayName + " | Subcategoria: " + this.currentInterestCenterChild.displayName;
            this.angulartics2.eventTrack.next({ action: filters, properties: { category: 'Busca de talentos: ', label: this._appSessionService.user ? this._appSessionService.user.emailAddress : "Anonimo" }});
        }else{
            this.filtersActive = false;
        }
    }

    private getInterestCenters(): void {
        if(this.appSession.interestCentersTopLevel.length == 0){
            this.getInterestCentersTopLevel();
        }

        this.currentInterestCenterTopLevel.displayName = "Selecione";
        this.currentInterestCenterChild.displayName = "Selecione";
        this.active = true;

        if(this.interestCenterId && this.interestCenterChildId) {
            this.setSubcategory(Number(this.interestCenterId), Number(this.interestCenterChildId));
        } 
        else if (this.interestCenterId) {
            this.setInterestCenter(this.interestCenterId);
            this.interestCenterId = null;
        } else {
            this.carregado = false;
            //this.getTalents();
        }
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

    setInterestCenter(id: number): void {
        var interestCenter = this.appSession.interestCentersTopLevel.filter(x => x.id == id)[0];
        this.changeInterestCenterTopLevel(interestCenter);
        $('.find-talent-content a[href="#talents"]').click();
    }

    setSubcategory(parentId: number, id: number): void {
        this.isCleanFilters = false;
        var interestCenterTopLevel = this.appSession.interestCentersTopLevel.filter(x => x.id == parentId)[0];
        this.currentInterestCenterTopLevel = interestCenterTopLevel;
        this._interestCenterService.getInterestCentersChildrenById(parentId).subscribe((result: ListResultDtoOfInterestCenterDto) => {
            this.interestCentersChidren = result.items;
            this.currentInterestCenterChild = new InterestCenterDto();
            this.currentInterestCenterChild.displayName = "Selecione";
            var interestCenter = this.interestCentersChidren.filter(x => x.id == id)[0];
            this.changeInterestCenterChildren(interestCenter);
            $('.find-talent-content a[href="#talents"]').click();
        });
    }

    changeInterestCenterChildren(interestCenter: InterestCenterDto): void {
        if (interestCenter == null) {
            interestCenter = new InterestCenterDto();
            interestCenter.displayName = "Selecione";
        }

        this.currentInterestCenterChild = interestCenter
        this.getTalentsByFilter();
    }

    changeInterestCenterTopLevel(interestCenter: InterestCenterDto): void {
        if (interestCenter == null) {
            interestCenter = new InterestCenterDto();
            interestCenter.displayName = "Selecione";
        }

        this.currentInterestCenterTopLevel = interestCenter;
        this.getInterestCentersChidren(this.currentInterestCenterTopLevel);
        //this.getTalentsByFilter();
    }

    public getTalentsByFilter(): void {
        this.carregado = false;
        this.checkFiltersActive();
        this.worbbiorActivities = [];
        this.page = 1;
        this.totalWorbbiorActivities = 0;
        this.getTalents();
    }

    getTalents(): void {
        
        this.checkFiltersActive();
        this._activitiesService.getWorbbiorActivities(this.filter, this.currentInterestCenterTopLevel.id, this.currentInterestCenterChild.id, undefined, this.address, this.orderby, this.latitude, this.longitude, this.page).subscribe((result: WorbbyPagedResultDtoOfWorbbiorActivityDto) => {
            this.carregado = true;
            //this.worbbiorActivities = result.items;
            this.worbbiorActivities.push.apply(this.worbbiorActivities, result.items);
            result.items.length == 10 ? this.showButtonMore = true : this.showButtonMore = false;
            this.totalWorbbiorActivities = result.totalCount;

            this.worbbiorActivities.forEach(element => {
                this.getPictureByGuid(element.worbbior.userPictureId).then((result) => {
                    if(!this.isNullOrEmpty(result)){
                        element.worbbior.userPicture = result;
                    }else{
                        element.worbbior.userPicture = AppConsts.defaultProfilePicture;
                    }
                });                
            });

            if(this.tipoDoDisplay == 'mapa') {
                this.findTalentMapComponent.organizeListWorbbiorActivities(this.worbbiorActivities);
            }
        });
    }

    goActivityPage(activity:UserActivityInput):void{
        console.log(activity.id + "-" + activity.title.replace(" ","-"));
        this.router.navigate(['/publico/atividade/' + this.changeSpecialCharacterToNormalCharacter((activity.id + "-" + activity.title.split(' ').join('-')).toLocaleLowerCase())]);
    }

    loadingMore(): void {
        this.page++;
        this.getTalents();
    }

    openDisplay(): void {
        if(this.tipoDoDisplay == "lista") {
            this.tipoDoDisplay = "mapa";
        }
        else {
            this.tipoDoDisplay = "lista";
        }
    }

    orderbyTalentsPrice(): void {
        this.orderByDistance = false;
        if (this.orderByPrice == true) {
            this.orderby = "Price";
            this.getTalentsByFilter();
        }else{
            this.orderby = "";
            this.getTalentsByFilter();
        }
    }

    orderbyTalentsDistance(): void {
        this.orderByPrice = false;
        if (this.orderByDistance == true) {
            this.orderby = "Distance";
            this.getTalentsByFilter();
        }else{
            this.orderby = "";
            this.getTalentsByFilter();
        }
    }


    findByTerm(): void {
        this.isCleanFilters = false;
        $('.find-talent-content a[href="#talents"]').click();
        this.getTalentsByFilter();
    }

    showMobileFilter():void{
        $(".filter-talents-mobile").toggle();
    }


    getLocation():void  {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.latitude = position.coords.latitude.toString();
                this.longitude = position.coords.longitude.toString();
                this.getInterestCenters();
            },(error) => {
                this.getInterestCenters();
            });
        }else{
            this.getInterestCenters();
        }
    }

    cleanTermFilter():void{
        this.filter = "";
        this.getTalentsByFilter();
    }

    cleanInterestCenterTopLevelFilter():void{
        this.changeInterestCenterTopLevel(null);
    }

    cleanInterestCenterChildFilter():void{
        this.changeInterestCenterChildren(null);
    }

    cleanAddresFilter():void{
        this.address = "";
        this.getTalentsByFilter();
    }

    cleanOrderFilter():void{
        this.orderByDistance = false;
        this.orderByPrice = false;
        this.orderby = "";
        this.getTalentsByFilter();
    }

    cleanFilters():void{
        this.orderByDistance = false;
        this.orderByPrice = false;
        this.orderby = "";
        this.filter = "";
        this.address = "";
        this.changeInterestCenterTopLevel(null);
        //this.changeInterestCenterChildren(null);
    }

    onKeyUp(event: any):void{
        if (event.keyCode == 13){
            this.getTalentsByFilter();
        }
    }

    onKeyUpTerm(event: any):void {
        if (event.keyCode == 13){
            this.isCleanFilters = false;
            $('.find-talent-content a[href="#talents"]').click();
            this.getTalentsByFilter();
        }
    }

    getTalentOnBlur():void{
        //this.getTalentsByFilter();
    }
}