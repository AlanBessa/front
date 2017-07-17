import { Component, Injector, AfterViewInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Router } from '@angular/router';
import {
    WorbbyTaskServiceProxy,
    WorbbyTaskDto,
    ProfileServiceProxy,
    AddressServiceProxy,
    CurrentUserProfileEditDto,
    AddressDto,
    EntityDtoOfInt64,
    WorbbyTaskDtoStatus,
} from '@shared/service-proxies/service-proxies';

import { UserMenu } from '@app/shared/layout/user-menu';
import { UserMenuItem } from '@app/shared/layout/user-menu-item';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { AppAuthService } from '@app/shared/common/auth/app-auth.service';
import { UnitMeasure } from '@shared/AppEnums';



@Component({
    templateUrl: './my-worbby.component.html',
    animations: [appModuleAnimation()]
})


export class MyWorbbyWorbbientComponent extends AppComponentBase implements AfterViewInit {

    public active: boolean = false;
    public saving: boolean = false;

    public user: CurrentUserProfileEditDto;
    currentRoleName: string = "";
    switchRole: boolean = false;
    public defaultAddress: AddressDto;
    public profilePicture: string;

    public worbbyTasksProposed: WorbbyTaskDto[] = [];
    public worbbyTasksProposedAccepted: WorbbyTaskDto[] = [];
    public publicWorbbyTasks: WorbbyTaskDto[] = [];
    public worbbyTasksInProgress: WorbbyTaskDto[] = [];

    public worbbyTasksOffersAccepted: WorbbyTaskDto[] = [];
    public worbbyTasksOffersConfirmed: WorbbyTaskDto[] = [];

    public UnitMeasure: typeof UnitMeasure = UnitMeasure;

    public WorbbyTaskDtoStatus: typeof WorbbyTaskDtoStatus= WorbbyTaskDtoStatus;

    public filter: string;

    public worbbiorPremium: boolean;
    public usuarioLogado: number = 0;


    constructor(
        injector: Injector,
        private _addressService: AddressServiceProxy,
        private _profileService: ProfileServiceProxy,
        private _appSessionService: AppSessionService,
        private _authService: AppAuthService,
        private _worbbyTaskService: WorbbyTaskServiceProxy,
        private _router: Router
    ) {
        super(injector);
    }

    menu: UserMenu = new UserMenu("UserMenu", "UserMenu", [
        new UserMenuItem("MyWorbby", "Pages.Worbbient.MyWorbby", "Worbbient", "", "/worbbient/my-worbby"),
        new UserMenuItem("PostTask", "Pages.Worbbient.PostTask", "Worbbient", "", "/worbbient/post-task"),
        new UserMenuItem("TasksHistory", "Pages.Worbbient.TasksHistory", "Worbbient", "", "/worbbient/tasks-history"),
        new UserMenuItem("PaymentsHistory", "Pages.Worbbient.PaymentsHistory", "Worbbient", "", "/worbbient/payments-history"),
        new UserMenuItem("Messages", "Pages.Worbbient.Messages", "", "Worbbient", "/worbbient/messages"),
        new UserMenuItem("EditProfile", "Pages.Worbbient.EditProfile", "Worbbient", "", "/worbbient/edit-profile"),

        new UserMenuItem("MyWorbby", "Pages.Worbbior.MyWorbby", "Worbbior", "", "/worbbior/my-worbby"),
        new UserMenuItem("TasksHistory", "Pages.Worbbior.TasksHistory", "Worbbior", "", "/worbbior/tasks-history"),
        new UserMenuItem("PaymentsHistory", "Pages.Worbbior.PaymentsHistory", "Worbbior", "", "/worbbior/payments-history"),
        new UserMenuItem("Messages", "Pages.Worbbior.Messages", "Worbbior", "", "/worbbior/messages"),
        new UserMenuItem("EditProfile", "Pages.Worbbior.EditProfile", "Worbbior", "", "/worbbior/edit-profile")
    ]);

    ngOnInit() {
        this.usuarioLogado = abp.session.userId;
        this.currentRoleName = this._appSessionService.userRoleName;
        this.switchRole = this.permission.isGranted("Pages.Worbbior.SwitchToWorbbientProfile");
        this.worbbiorPremium = this._appSessionService.worbbiorPremium;
        this._profileService.getCurrentUserProfileForEdit().subscribe((result) => {
            this.user = result;
            this.getProfilePicture();
            this.getAddresDefault();
            this.getPublicWorbbyTasks();
            this.getProposedWorbbyTasks();
            this.getWorbbyTasksProposedAccepted();
            this.getGetWorbbyTasksInProgress();
            this.getWorbbyTasksOffersAcceptedByWorbbient();
            this.getWorbbyTasksOffersConfirmedByWorbbior();
        });
    }

    ngAfterViewInit(): void {
        $("body").scrollTop(0);
    }

    getProfilePicture(): void {
        this._profileService.getProfilePicture().subscribe(result => {
            if (result && result.profilePicture) {

                this.profilePicture = 'data:image/jpeg;base64,' + result.profilePicture;
            } else {
                this.profilePicture = "/assets/common/images/default-profile-picture.png";
            }
        });
    }

    getAddresDefault(): void {
        this._addressService.getAddressDefaultByUserId(abp.session.userId).subscribe((result: AddressDto) => {
            this.defaultAddress = result;
            this.active = true;
        });
    }

    showMenuItem(menuItem): boolean {
        if (menuItem.permissionName) {
            return this.permission.isGranted(menuItem.permissionName) && menuItem.roleName == this.currentRoleName;
        }

        return true;
    }

    switchToWorbbiorProfile() {
        this._appSessionService.userRoleName = "Worbbior";
        location.href = "/";
    }

    switchToWorbbientProfile() {
        this._appSessionService.userRoleName = "Worbbient";
        location.href = "/";
    }

    logout(): void {
        this._authService.logout();
    }

    getGetWorbbyTasksInProgress(): void {
        this._worbbyTaskService.getWorbbyTasksInProgressByUserId(abp.session.userId).subscribe(result => {
            this.worbbyTasksInProgress = result.items;
            this.worbbyTasksInProgress.forEach(element => {
                if (element.worbbior) {
                    this.getPictureByGuid(element.worbbior.userPictureId).then((result) => {
                        element.worbbior.userPicture = result;
                    });
                }
            });
        });
    }

    getPublicWorbbyTasks(): void {
        this._worbbyTaskService.getPublicWorbbyTasksPostedByUserId(abp.session.userId).subscribe(result => {
            this.publicWorbbyTasks = result.items;
        });
    }

    getProposedWorbbyTasks(): void {
        this._worbbyTaskService.getWorbbyTasksProposedByUserId(abp.session.userId).subscribe(result => {
            this.worbbyTasksProposed = result.items;
            this.worbbyTasksProposed.forEach(element => {
                this.getPictureByGuid(element.worbbior.userPictureId).then((result) => {
                    element.worbbior.userPicture = result;
                });
            });
        });
    }

    getWorbbyTasksProposedAccepted(): void {
        this._worbbyTaskService.getWorbbyTasksProposedAndAcceptedByUserId(abp.session.userId).subscribe(result => {
            this.worbbyTasksProposedAccepted = result.items;
            this.worbbyTasksProposedAccepted.forEach(element => {
                this.getPictureByGuid(element.worbbior.userPictureId).then((result) => {
                    element.worbbior.userPicture = result;
                });
            });
        });
    }

    getWorbbyTasksOffersAcceptedByWorbbient(): void {
        this._worbbyTaskService.getWorbbyTasksWithOffersAcceptedByUserId(abp.session.userId).subscribe(result => {
            this.worbbyTasksOffersAccepted = result.items;
            this.worbbyTasksOffersAccepted.forEach(element => {
                this.getPictureByGuid(element.worbbior.userPictureId).then((result) => {
                    element.worbbior.userPicture = result;
                });
            });
        });
    }

    getWorbbyTasksOffersConfirmedByWorbbior(): void {
        this._worbbyTaskService.getWorbbyTasksWithOffersConfirmedByUserId(abp.session.userId).subscribe(result => {
            this.worbbyTasksOffersConfirmed = result.items;
            this.worbbyTasksOffersConfirmed.forEach(element => {
                this.getPictureByGuid(element.worbbior.userPictureId).then((result) => {
                    element.worbbior.userPicture = result;
                });
            });
        });
    }

    get numberOfTasksPosted():number {
        return this.worbbyTasksProposed.length + 
        this.worbbyTasksProposedAccepted.length + 
        this.publicWorbbyTasks.length + 
        this.worbbyTasksOffersAccepted.length + 
        this.worbbyTasksOffersConfirmed.length;
    }

    get numberOfTasksInProgress():number {
        return this.worbbyTasksInProgress.length;
    }

    actionReturn():void {
        console.log('actionReturn');
        this.getPublicWorbbyTasks();
        this.getProposedWorbbyTasks();
        this.getWorbbyTasksProposedAccepted();
        this.getGetWorbbyTasksInProgress();
        this.getWorbbyTasksOffersAcceptedByWorbbient();
        this.getWorbbyTasksOffersConfirmedByWorbbior();
    }
}