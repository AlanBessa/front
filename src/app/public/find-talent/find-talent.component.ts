import { Component, Injector, AfterViewInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ActivatedRoute } from '@angular/router';
import { SlickSliderComponent } from '@shared/slick-slider.component';
import { ListResultDtoOfInterestCenterDto, InterestCenterServiceProxy, InterestCenterDto, ActivityServiceProxy, WorbbiorActivityDto, ListResultDtoOfWorbbiorActivityDto } from '@shared/service-proxies/service-proxies';
import { UnitMeasure } from '@shared/AppEnums';
import {AppConsts} from '@shared/AppConsts';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { Angulartics2 } from 'angulartics2';

@Component({
    templateUrl: './find-talent.component.html',
    animations: [appModuleAnimation()]
})
export class FindTalentComponent extends AppComponentBase implements AfterViewInit {

    worbbiorActivities: WorbbiorActivityDto[] = [];
    public active: boolean = false;
    public filter: string = "";
    public address: string  = "";
    public interestCentersTopLevel: InterestCenterDto[] = [];
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

    constructor(
        injector: Injector,
        private _activitiesService: ActivityServiceProxy,
        private _interestCenterService: InterestCenterServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _appSessionService: AppSessionService,
        private angulartics2: Angulartics2
    ) {
        super(injector);
    }

    ngAfterViewInit(): void {
        let self = this;
        this.interestCenterId = this._activatedRoute.snapshot.params['interestCenterId'];
        this.interestCenterChildId = this._activatedRoute.snapshot.params['interestCenterChildId'];
        this.filter = this._activatedRoute.snapshot.params['filter'] == undefined || this._activatedRoute.snapshot.params['filter'] == "undefined" ? "" : this._activatedRoute.snapshot.params['filter'];
        //this.tabFeaturesActive = this._activatedRoute.snapshot.params['feature'];
        
        if (this.interestCenterId || this.filter) {
            $('.find-talent-content a[href="#talents"]').click();
        }else if(this.tabFeaturesActive){
            $('.find-talent-content a[href="#featured"]').click();
        } 

        this.tabFeaturesActive = $("#featured").hasClass("active"); 
        
        $("body").scrollTop(0);
        
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            self.tabFeaturesActive = $("#featured").hasClass("active");
            $("body").scrollTop(0);
            if(self.tabFeaturesActive){
                self.cleanFilters();
            }else{
                self.getTalents();
            }           
            
        })

        this.getLocation();

        // if(!self.tabFeaturesActive){
        //     this.getInterestCentersTopLevel();
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

    private getInterestCentersTopLevel(): void {
        this._interestCenterService.getInterestCentersTopLevel().subscribe((result: ListResultDtoOfInterestCenterDto) => {
            this.interestCentersTopLevel = result.items;


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
                this.getTalents();
            }
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

    setInterestCenter(id: number): void {
        var interestCenter = this.interestCentersTopLevel.filter(x => x.id == id)[0];
        this.changeInterestCenterTopLevel(interestCenter);
        $('.find-talent-content a[href="#talents"]').click();
    }

    setSubcategory(parentId: number, id: number): void {
        var interestCenterTopLevel = this.interestCentersTopLevel.filter(x => x.id == parentId)[0];
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
        this.getTalents();
    }

    changeInterestCenterTopLevel(interestCenter: InterestCenterDto): void {
        if (interestCenter == null) {
            interestCenter = new InterestCenterDto();
            interestCenter.displayName = "Selecione";
        }

        this.currentInterestCenterTopLevel = interestCenter;
        this.getInterestCentersChidren(this.currentInterestCenterTopLevel);
        this.getTalents();
    }

    getTalents(): void {
        this.carregado = false;
        this.checkFiltersActive();
        this._activitiesService.getWorbbiorActivities(this.filter, this.currentInterestCenterTopLevel.id, this.currentInterestCenterChild.id, undefined, this.address, this.orderby, this.latitude, this.longitude, this.page).subscribe((result: ListResultDtoOfWorbbiorActivityDto) => {
            this.carregado = true;
            this.worbbiorActivities = result.items;
            // this.worbbiorActivities.push.apply(this.worbbiorActivities, result.items);
            // result.parcialCount == 10 ? this.showButtonMore = true : this.showButtonMore = false;
            // this.totalWorbbiorActivities = result.totalCount;

            this.worbbiorActivities.forEach(element => {
                this.getPictureByGuid(element.worbbior.userPictureId).then((result) => {
                    if(!this.isNullOrEmpty(result)){
                        element.worbbior.userPicture = result;
                    }else{
                        element.worbbior.userPicture = AppConsts.defaultProfilePicture;
                    }
                });                
            });
        });
    }

    loadingMore(): void {
        this.page++;
        this.getTalents();
    }

    orderbyTalentsPrice(): void {
        this.orderByDistance = false;
        if (this.orderByPrice == true) {
            this.orderby = "Price";
            this.getTalents();
        }else{
            this.orderby = "";
            this.getTalents();
        }
    }

    orderbyTalentsDistance(): void {
        this.orderByPrice = false;
        if (this.orderByDistance == true) {
            this.orderby = "Distance";
            this.getTalents();
        }else{
            this.orderby = "";
            this.getTalents();
        }
    }


    findByTerm(): void {
        $('.find-talent-content a[href="#talents"]').click();
        this.getTalents();
    }

    showMobileFilter():void{
        $(".filter-talents-mobile").toggle();
    }


    getLocation():void  {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.latitude = position.coords.latitude.toString();
                this.longitude = position.coords.longitude.toString();
                this.getInterestCentersTopLevel();
            },(error) => {
                this.getInterestCentersTopLevel();
            });
        }else{
            this.getInterestCentersTopLevel();
        }
    }

    cleanTermFilter():void{
        this.filter = "";
        this.getTalents();
    }

    cleanInterestCenterTopLevelFilter():void{
        this.changeInterestCenterTopLevel(null);
    }

    cleanInterestCenterChildFilter():void{
        this.changeInterestCenterChildren(null);
    }

    cleanAddresFilter():void{
        this.address = "";
        this.getTalents();
    }

    cleanOrderFilter():void{
        this.orderByDistance = false;
        this.orderByPrice = false;
        this.orderby = "";
        this.getTalents();
    }

    cleanFilters():void{
        this.orderByDistance = false;
        this.orderByPrice = false;
        this.orderby = "";
        this.filter = "";
        this.address = "";
        this.changeInterestCenterTopLevel(null);
        this.changeInterestCenterChildren(null);
    }

    onKeyUp(event: any):void{
        if (event.keyCode == 13){
            this.getTalents();
        }
    }
}