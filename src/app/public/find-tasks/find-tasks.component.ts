import { Component, Injector, AfterViewInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ActivatedRoute } from '@angular/router';
import { FindWorbbyTaskInput, WorbbyTaskDto, InterestCenterDto, WorbbyTaskServiceProxy, InterestCenterServiceProxy, ListResultDtoOfInterestCenterDto, ListResultDtoOfWorbbyTaskDto } from '@shared/service-proxies/service-proxies';
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
        this.findWorbbyTaskInput.interestCenterTopLevelId = this._activatedRoute.snapshot.params['interestCenterTopLevelId'];
        this.findWorbbyTaskInput.interestCenterChildId = this._activatedRoute.snapshot.params['interestCenterChildId'];
        this.findWorbbyTaskInput.filter = this._activatedRoute.snapshot.params['filter'];

        $("body").scrollTop(0);

        this.getInterestCentersTopLevel();
        this.getLocation();
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
        this.getWorbbyTasks();
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

    getWorbbyTasks(): void {
        this.carregado = false;
        this.checkFiltersActive();
        this._worbbyTaskService.findWorbbyTasks(this.findWorbbyTaskInput).subscribe((result: ListResultDtoOfWorbbyTaskDto) => {
            this.carregado = true;
            this.worbbyTasks = result.items;
        });
    }

    orderbyPrice(): void {
        this.orderByDistance = false;
        if (this.orderByPrice == true) {
            this.findWorbbyTaskInput.orderBy = "Price";
            this.getWorbbyTasks();
        }else{
            this.findWorbbyTaskInput.orderBy = "";
            this.getWorbbyTasks();
        }
    }

    orderbyDistance(): void {
        this.orderByPrice = false;
        if (this.orderByDistance == true) {
            this.findWorbbyTaskInput.orderBy = "Distance";
            this.getWorbbyTasks();
        }else{
            this.findWorbbyTaskInput.orderBy = "";
            this.getWorbbyTasks();
        }
    }


    findByTerm(): void {
        this.getWorbbyTasks();
    }

    showMobileFilter():void{
        $(".filter-tasks-mobile").toggle();
    }


    getLocation():void  {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.findWorbbyTaskInput.latitude = position.coords.latitude.toString();
                this.findWorbbyTaskInput.longitude = position.coords.longitude.toString();
                this.getWorbbyTasks();
            },(error) => {
                this.getWorbbyTasks();
            });
        }else{
            this.getWorbbyTasks();
        }
    }

    cleanTermFilter():void{
        this.findWorbbyTaskInput.filter = "";
        this.getWorbbyTasks();
    }

    cleanInterestCenterTopLevelFilter():void{
        this.changeInterestCenterTopLevel(null);
    }

    cleanInterestCenterChildFilter():void{
        this.changeInterestCenterChildren(null);
    }

    cleanAddresFilter():void{
        this.findWorbbyTaskInput.address = "";
        this.getWorbbyTasks();
    }

    cleanOrderFilter():void{
        this.orderByDistance = false;
        this.orderByPrice = false;
        this.findWorbbyTaskInput.orderBy = "";
        this.getWorbbyTasks();
    }

    onKeyUp(event: any):void{
        if (event.keyCode == 13){
            this.getWorbbyTasks();
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