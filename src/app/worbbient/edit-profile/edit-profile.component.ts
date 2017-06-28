import { Component, Injector, AfterViewInit, ViewChild, Inject } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppConsts } from '@shared/AppConsts';
import { FileUploader, FileUploaderOptions, Headers } from '@node_modules/ng2-file-upload';
import { ProfileServiceProxy, CurrentUserProfileEditDto, AddressDto, AddressServiceProxy, DefaultTimezoneScope, UserLoginInfoDto } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { AppTimezoneScope } from '@shared/AppEnums';
import { ChangeProfilePictureModalComponent } from '@app/shared/layout/profile/change-profile-picture-modal.component';
import { MyPersonalDataWorbbientComponent } from './my-personal-data.component';
import { MyPaymentWorbbientComponent } from './my-payment.component';
import { MyAddressWorbbientComponent } from './my-address.component';
import { UserMenu } from '@app/shared/layout/user-menu';
import { UserMenuItem } from '@app/shared/layout/user-menu-item';
import { AppAuthService } from '@app/shared/common/auth/app-auth.service';

@Component({
    templateUrl: './edit-profile.component.html',
    animations: [appModuleAnimation()]
})
export class EditProfileWorbbientComponent extends AppComponentBase implements AfterViewInit {

    @ViewChild('changeProfilePictureModal') changeProfilePictureModal: ChangeProfilePictureModalComponent;

    @ViewChild('editMyPersonalDataWorbbient') editMyPersonalDataWorbbient: MyPersonalDataWorbbientComponent;

    @ViewChild('myPaymentWorbbient') myPaymentWorbbient: MyPaymentWorbbientComponent;

    @ViewChild('myAddressWorbbient') myAddressWorbbient: MyAddressWorbbientComponent; 


    public active: boolean = false;
    public saving: boolean = false;

    public user: CurrentUserProfileEditDto;
    public showTimezoneSelection: boolean = abp.clock.provider.supportsMultipleTimezone;
    public canChangeUserName: boolean;
    public defaultTimezoneScope: DefaultTimezoneScope = AppTimezoneScope.User;
    private _initialTimezone: string = undefined;
    profilePicture: string = "/assets/common/images/default-profile-picture.png";
    currentRoleName: string = "";
    switchRole: boolean = false;
    public defaultAddress: AddressDto;
    public worbbiorPremium: boolean;

    constructor(
        injector: Injector,
        private _profileService: ProfileServiceProxy,
        private _appSessionService: AppSessionService,
        private _addressService: AddressServiceProxy,
        private _authService: AppAuthService
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

    ngAfterViewInit(): void {
        this._profileService.getCurrentUserProfileForEdit().subscribe((result) => {
            this.user = result;
            this._initialTimezone = result.timezone;
            this.canChangeUserName = this.user.userName != AppConsts.userManagement.defaultAdminUserName;
            this.worbbiorPremium = this._appSessionService.worbbiorPremium;
            this.getProfilePicture();
            this.getAddresDefault();
        });
    }

    getProfilePicture(): void {
        this._profileService.getProfilePicture().subscribe(result => {
            if (result && result.profilePicture) {
                this.profilePicture = 'data:image/jpeg;base64,' + result.profilePicture;
            }
        });
    }
    save(): void {
        this.editMyPersonalDataWorbbient.save(true, () => {
            this.myAddressWorbbient.save(false, () => {
            });
        });
    }
    getAddresDefault(): void {
        this._addressService.getAddressDefaultByUserId(abp.session.userId).subscribe((result: AddressDto) => {
            this.defaultAddress = result;
            this.active = true;
        });
    }

    changeProfilePicture(): void {
        this.changeProfilePictureModal.show();
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

    ngOnInit() {
        this.currentRoleName = this._appSessionService.userRoleName;
        this.switchRole = this.permission.isGranted("Pages.Worbbior.SwitchToWorbbientProfile");
        abp.event.on("profilePictureChanged", () => {
            this.getProfilePicture();
        });
    }
        
    logout(): void {
        this._authService.logout();
    }
}