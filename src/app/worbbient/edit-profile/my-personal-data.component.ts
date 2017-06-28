import { Component, Injector, AfterViewInit, ViewChild, Inject } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppConsts } from '@shared/AppConsts';
import { FileUploader, FileUploaderOptions, Headers } from '@node_modules/ng2-file-upload';
import { ProfileServiceProxy, CurrentUserProfileEditDto, DefaultTimezoneScope, UserLoginInfoDto } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { AppTimezoneScope } from '@shared/AppEnums';
import { ChangeProfilePictureModalComponent } from '@app/shared/layout/profile/change-profile-picture-modal.component';

@Component({
    templateUrl: './my-personal-data.component.html',
    selector: 'editMyPersonalDataWorbbient',
    animations: [appModuleAnimation()]
})
export class MyPersonalDataWorbbientComponent extends AppComponentBase implements AfterViewInit {

    @ViewChild('changeProfilePictureModal') changeProfilePictureModal: ChangeProfilePictureModalComponent;

    public active: boolean = false;
    public saving: boolean = false;
    public AppConsts: typeof AppConsts = AppConsts;
    public user: CurrentUserProfileEditDto;
    public showTimezoneSelection: boolean = abp.clock.provider.supportsMultipleTimezone;
    public canChangeUserName: boolean;
    public defaultTimezoneScope: DefaultTimezoneScope = AppTimezoneScope.User;
    private _initialTimezone: string = undefined;
    profilePicture: string = "/assets/common/images/default-profile-picture.png";

    constructor(
        injector: Injector,
        private _profileService: ProfileServiceProxy,
        private _appSessionService: AppSessionService
    ) {
        super(injector);
    }

    ngAfterViewInit(): void {
        this._profileService.getCurrentUserProfileForEdit().subscribe((result) => {
            this.user = result;
            this._initialTimezone = result.timezone;
            this.canChangeUserName = this.user.userName != AppConsts.userManagement.defaultAdminUserName;
            this.active = true;
            this.getProfilePicture();
        });
    }

    ngOnInit() {
        abp.event.on("profilePictureChanged", () => {
            this.getProfilePicture();
        });
    }

    save(showNotify: boolean = true, callback: () => void): void {
        this.saving = true;
        this._profileService.updateCurrentUserProfile(this.user)
            .finally(() => {
                this.saving = false;
                callback();
            })
            .subscribe(() => {
                this._appSessionService.user.name = this.user.name;
                this._appSessionService.user.surname = this.user.surname;
                this._appSessionService.user.userName = this.user.userName;
                this._appSessionService.user.emailAddress = this.user.emailAddress;
                 
                if (showNotify) {
                    this.notify.info(this.l('SavedSuccessfully'));
                }

                if (abp.clock.provider.supportsMultipleTimezone && this._initialTimezone !== this.user.timezone) {
                    this.message.info(this.l('TimeZoneSettingChangedRefreshPageNotification')).done(() => {
                        window.location.reload();
                    });
                }
            });
    }

    getProfilePicture(): void {
        this._profileService.getProfilePicture().subscribe(result => {
            if (result && result.profilePicture) {
                this.profilePicture = 'data:image/jpeg;base64,' + result.profilePicture;
            }
        });
    }

    changeProfilePicture(): void {
        this.changeProfilePictureModal.show();
    }
}