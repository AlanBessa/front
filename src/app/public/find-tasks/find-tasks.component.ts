import { Component, Injector, AfterViewInit, OnDestroy } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ActivatedRoute } from '@angular/router';
import { FindWorbbyTaskInput, WorbbyTaskDto, InterestCenterDto, WorbbyTaskServiceProxy, InterestCenterServiceProxy, ListResultDtoOfInterestCenterDto, ListResultDtoOfWorbbyTaskDto, WorbbyPagedResultDtoOfWorbbyTaskDto } from '@shared/service-proxies/service-proxies';
import { UnitMeasure } from '@shared/AppEnums';

@Component({
    templateUrl: './find-tasks.component.html',
    animations: [appModuleAnimation()]
})
export class FindTasksComponent extends AppComponentBase implements AfterViewInit {

    worbbyTasks: WorbbyTaskDto[] = [];
    public active: boolean = false;
    
    public interestCentersTopLevel: InterestCenterDto[] = [];
    public interestCentersChidren: InterestCenterDto[] = [];
    public currentInterestCenterTopLevel: InterestCenterDto = new InterestCenterDto();
    public currentInterestCenterChild: InterestCenterDto = new InterestCenterDto();
    public UnitMeasure: typeof UnitMeasure = UnitMeasure;
    public interestCenterId: number;
    public orderByPrice: boolean = false;
    public orderByDistance: boolean = false;
    public filtersActive: boolean = false;
    public carregado: boolean = false;

    public page: number = 1;
    public totalWorbbyTask: number = 0; 
    public showButtonMore = false;

    public findWorbbyTaskInput: FindWorbbyTaskInput = new FindWorbbyTaskInput();    

    constructor(
        injector: Injector,
        private _worbbyTaskService: WorbbyTaskServiceProxy,
        private _interestCenterService: InterestCenterServiceProxy,
        private _activatedRoute: ActivatedRoute,
    ) {
        super(injector);
    }

    ngAfterViewInit(): void {

        $("body").scrollTop(0);
        $(".page-loading").hide();

        this.findWorbbyTaskInput.interestCenterTopLevelId = this._activatedRoute.snapshot.params['interestCenterTopLevelId'];
        this.findWorbbyTaskInput.interestCenterChildId = this._activatedRoute.snapshot.params['interestCenterChildId'];
        this.findWorbbyTaskInput.filter = this._activatedRoute.snapshot.params['filter'];

        this.getInterestCentersTopLevel();
        this.getLocation();
    }

    ngOnDestroy(): void {
        
    }


    private getInterestCentersTopLevel(): void {
        this._interestCenterService.getInterestCentersTopLevel().subscribe((result: ListResultDtoOfInterestCenterDto) => {
            this.interestCentersTopLevel = result.items;
           
            this.currentInterestCenterTopLevel.displayName = "Selecione";
            this.currentInterestCenterChild.displayName = "Selecione";
            this.active = true;
            if (this.interestCenterId) {
                this.setInterestCenter(this.interestCenterId);
                this.interestCenterId = null;
            } else {
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
        });
    }

    changeInterestCenterChildren(interestCenter: InterestCenterDto): void {
        if (interestCenter == null) {
            interestCenter = new InterestCenterDto();
            interestCenter.displayName = "Selecione";
        }

        this.currentInterestCenterChild = interestCenter;
        this.findWorbbyTaskInput.interestCenterChildId = this.currentInterestCenterChild.id;
        this.getWorbbyTasksByFilter();
    }

    changeInterestCenterTopLevel(interestCenter: InterestCenterDto): void {
        if (interestCenter == null) {
            interestCenter = new InterestCenterDto();
            interestCenter.displayName = "Selecione";
        }

        this.currentInterestCenterTopLevel = interestCenter;
        this.findWorbbyTaskInput.interestCenterTopLevelId = this.currentInterestCenterTopLevel.id;
        this.getInterestCentersChidren(this.currentInterestCenterTopLevel);
    }

    public getWorbbyTasksByFilter(): void {
        this.carregado = false;
        this.checkFiltersActive();
        this.worbbyTasks = [];
        this.page = 1;
        this.totalWorbbyTask = 0;
        this.getWorbbyTasks();
    }

    getWorbbyTasks(): void { 
        
        this.findWorbbyTaskInput.page = this.page;
        this.checkFiltersActive();
        this._worbbyTaskService.findWorbbyTasks(this.findWorbbyTaskInput).subscribe((result: WorbbyPagedResultDtoOfWorbbyTaskDto) => {
            this.carregado = true;
            this.worbbyTasks.push.apply(this.worbbyTasks, result.items);
            result.items.length == 10 ? this.showButtonMore = true : this.showButtonMore = false;
            this.totalWorbbyTask = result.totalCount;
        });
    }

    loadingMore(): void {
        this.page++;
        this.getWorbbyTasks();
    }

    orderbyPrice(): void {
        this.orderByDistance = false;
        if (this.orderByPrice == true) {
            this.findWorbbyTaskInput.orderBy = "Price";
            this.getWorbbyTasksByFilter();
        }else{
            this.findWorbbyTaskInput.orderBy = "";
            this.getWorbbyTasksByFilter();
        }
    }

    orderbyDistance(): void {
        this.orderByPrice = false;
        if (this.orderByDistance == true) {
            this.findWorbbyTaskInput.orderBy = "Distance";
            this.getWorbbyTasksByFilter();
        }else{
            this.findWorbbyTaskInput.orderBy = "";
            this.getWorbbyTasksByFilter();
        }
    }


    findByTerm(): void {
        this.getWorbbyTasksByFilter();
    }

    showMobileFilter():void{
        $(".filter-tasks-mobile").toggle();
    }


    getLocation():void  {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.findWorbbyTaskInput.latitude = position.coords.latitude.toString();
                this.findWorbbyTaskInput.longitude = position.coords.longitude.toString();
                this.getWorbbyTasksByFilter();
            },(error) => {
                this.getWorbbyTasksByFilter();
            });
        }else{
            this.getWorbbyTasksByFilter();
        }
    }

    cleanTermFilter():void{
        this.findWorbbyTaskInput.filter = "";
        this.getWorbbyTasksByFilter();
    }

    cleanInterestCenterTopLevelFilter():void{
        this.changeInterestCenterTopLevel(null);
    }

    cleanInterestCenterChildFilter():void{
        this.changeInterestCenterChildren(null);
    }

    cleanAddresFilter():void{
        this.findWorbbyTaskInput.address = "";
        this.getWorbbyTasksByFilter();
    }

    cleanOrderFilter():void{
        this.orderByDistance = false;
        this.orderByPrice = false;
        this.findWorbbyTaskInput.orderBy = "";
        this.getWorbbyTasksByFilter();
    }

    onKeyUp(event: any):void{
        if (event.keyCode == 13){
            this.getWorbbyTasksByFilter();
        }
    }

    checkFiltersActive():void{
        if(!this.isNullOrEmpty(this.findWorbbyTaskInput.filter) || !this.isNullOrEmpty(this.findWorbbyTaskInput.interestCenterTopLevelId) || !this.isNullOrEmpty(this.findWorbbyTaskInput.address)  || !this.isNullOrEmpty(this.findWorbbyTaskInput.orderBy)){
            this.filtersActive = true;
        }else{
            this.filtersActive = false;
        }
    }
}