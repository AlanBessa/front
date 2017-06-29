import { Component, Injector, AfterViewInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Router } from '@angular/router';
import { AppConsts } from '@shared/AppConsts';
import { UserMenu } from '@app/shared/layout/user-menu';
import { UserMenuItem } from '@app/shared/layout/user-menu-item';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { WorbbyTaskStatus } from '@shared/AppEnums';
import { PagedResultDtoOfWorbbyTaskDto, AddressDto, AddressServiceProxy, WorbbyTaskServiceProxy, WorbbyTaskDto,CurrentUserProfileEditDto,ProfileServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
    templateUrl: './tasks-history.component.html',
    animations: [appModuleAnimation()]
})
export class TasksHistoryWorbbiorComponent extends AppComponentBase implements AfterViewInit {

    public filter: string;
    public worbbyTasks: WorbbyTaskDto[];
    pager: any = {};
    public active: boolean = false;
    public carregado: boolean = true;
    currentRoleName: string = "";
    public countList: number;
    public user: CurrentUserProfileEditDto;
    public defaultAddress: AddressDto;
    WorbbyTaskStatus: typeof WorbbyTaskStatus = WorbbyTaskStatus;
    profilePicture: string = "/assets/common/images/default-profile-picture.png";
    public status: string = "";
    public urlImg: string = "/assets/common/images/default-profile-picture.png";

    constructor(
        injector: Injector,
        private router: Router,
        private _worbbyTaskService: WorbbyTaskServiceProxy,
        private _appSessionService: AppSessionService,
        private _profileService: ProfileServiceProxy,
         private _addressService: AddressServiceProxy
    ) {
        super(injector);
    }

    ngOnInit() {
        this.currentRoleName = this._appSessionService.userRoleName;
        //this.switchRole = this.permission.isGranted("Pages.Worbbior.SwitchToWorbbientProfile");        
    }

    ngAfterViewInit(): void {
        $("body").scrollTop(0);
        
        this._profileService.getCurrentUserProfileForEdit().subscribe((result) => {
            this.user = result
            this.getProfilePicture();
            this.getAddresDefault();
            this.gethistoryTask(1);
        });
    }

    getProfilePicture(): void {
        this._profileService.getProfilePicture().subscribe(result => {
            if (result && result.profilePicture) {
                this.profilePicture = 'data:image/jpeg;base64,' + result.profilePicture;
            }
        });
    }

    getAddresDefault(): void {
        this._addressService.getAddressDefaultByUserId(abp.session.userId).subscribe((result: AddressDto) => {
            this.defaultAddress = result;
        });
    }

    menu: UserMenu = new UserMenu("UserMenu", "UserMenu", [
        new UserMenuItem("MyWorbby", "Pages.Worbbient.MyWorbby", "Worbbient", "", "/worbbient/my-worbby"),
        new UserMenuItem("PostTask", "Pages.Worbbient.PostTask", "Worbbient", "", "/worbbient/post-task"),
        //new UserMenuItem("TasksHistory", "Pages.Worbbient.TasksHistory", "Worbbient", "", "/worbbient/tasks-history"),
        new UserMenuItem("PaymentsHistory", "Pages.Worbbient.PaymentsHistory", "Worbbient", "", "/worbbient/payments-history"),
        //new UserMenuItem("Messages", "Pages.Worbbient.Messages", "", "Worbbient", "/worbbient/messages"),
        new UserMenuItem("EditProfile", "Pages.Worbbient.EditProfile", "Worbbient", "", "/worbbient/edit-profile"),

        new UserMenuItem("MyWorbby", "Pages.Worbbior.MyWorbby", "Worbbior", "", "/worbbior/my-worbby"),
        ///new UserMenuItem("TasksHistory", "Pages.Worbbior.TasksHistory", "Worbbior", "", "/worbbior/tasks-history"),
        new UserMenuItem("PaymentsHistory", "Pages.Worbbior.PaymentsHistory", "Worbbior", "", "/worbbior/payments-history"),
        //new UserMenuItem("Messages", "Pages.Worbbior.Messages", "Worbbior", "", "/worbbior/messages"),
        new UserMenuItem("EditProfile", "Pages.Worbbior.EditProfile", "Worbbior", "", "/worbbior/edit-profile")
    ]);

    showMenuItem(menuItem): boolean {
        if (menuItem.permissionName) {
            return this.permission.isGranted(menuItem.permissionName) && menuItem.roleName == this.currentRoleName;
        }
        return true;
    }

    private gethistoryTask(page): void {
        var skipCount = AppConsts.maxResultCount * (page - 1);
        this.carregado = false;
        this._worbbyTaskService.getWorbbyTasksCloseOrCanceledByTargetUserId(abp.session.userId, AppConsts.maxResultCount, skipCount).subscribe((result: PagedResultDtoOfWorbbyTaskDto) => {
            this.carregado = true;
            this.worbbyTasks = result.items;
             this.worbbyTasks.forEach(element => {
                  if(element.worbbient.userPictureId != null)
                  {
                    this.getPictureByGuid(element.worbbient.userPictureId).then((result) => {
                        element.worbbient.userPicture = result;
                    });
                  }else{
                      element.worbbient.userPicture = this.urlImg;
                  }
                    this.status =  this.l(WorbbyTaskStatus[element.status])
                });
            this.countList = this.worbbyTasks.length;
            this.pager.totalCount = result.totalCount;
            this.pager.currentPage = page;
            this.active = true;
            this.buildPager(Math.ceil(this.pager.totalCount / AppConsts.maxResultCount));
        });
    }

    buildPager(total) {
        //Quantas casa para frente e para trás
        let range = 5;

        this.pager.totalPages = [];

        if (window.screen.width <= 500) {
            range = 1;
        }
        else if (window.screen.width <= 767) {
            range = 3;
        }

        let maxNumberPages = (range * 2) + 1;

        for (let i = 1; i <= total; i++) {

            if (1 != total && (!(i >= this.pager.currentPage + range + 1 || i <= this.pager.currentPage - range - 1) || total <= maxNumberPages)) {

                this.pager.totalPages.push(i);
            }
        }
    }
    findByTerm(): void {
        this.router.navigate(['/find-a-talents-t', this.filter]);
    }
}