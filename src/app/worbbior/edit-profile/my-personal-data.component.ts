import { Component, Injector, AfterViewInit, ViewChild, Inject, OnInit, NgModule } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppConsts } from '@shared/AppConsts';
import { FileUploader, FileUploaderOptions, Headers } from '@node_modules/ng2-file-upload';
import { ProfileServiceProxy, WorbbiorServiceProxy, WorbbiorForEditDto, DefaultTimezoneScope, UserLoginInfoDto } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { AppTimezoneScope, WorbbiorState } from '@shared/AppEnums';
import { ChangeProfilePictureModalComponent } from '@app/shared/layout/profile/change-profile-picture-modal.component';
import { InfoTutorialCadastroModalComponent } from "app/worbbior/edit-profile/info-tutorial-cadastro-modal.component";


@Component({
    templateUrl: './my-personal-data.component.html', 
    selector: 'editMyPersonalDataWorbbior',
    animations: [appModuleAnimation()]
})

export class MyPersonalDataWorbbiorComponent extends AppComponentBase implements AfterViewInit {

    @ViewChild('userDataChangeProfilePictureModal') userDataChangeProfilePictureModal: ChangeProfilePictureModalComponent;
    @ViewChild('infoTutorialModal') infoTutorialModal: InfoTutorialCadastroModalComponent;

    public AppConsts: typeof AppConsts = AppConsts;
    public WorbbiorState: typeof WorbbiorState = WorbbiorState;

    public active: boolean = false;
    public saving: boolean = false;
    public worbbiorState: WorbbiorState;

    public user: WorbbiorForEditDto;
    public showTimezoneSelection: boolean = abp.clock.provider.supportsMultipleTimezone;
    public canChangeUserName: boolean;
    public defaultTimezoneScope: DefaultTimezoneScope = AppTimezoneScope.User;
    private _initialTimezone: string = undefined;
    profilePicture: string = "/assets/common/images/default-profile-picture.png";

    public tooltipApelido: string = "O nome que você colocar aqui é o que vai ficar exposto aos outros usuários. Você deve preenchê-lo somente se tiver um nome artístico com o qual é mais conhecido ou se tem um sobrenome extenso e quiser ser chamado apenas pelo primeiro nome.";
    public tooltipSobreMim: string = "Conte-nos um pouco sobre você para que os membros da comunidade Worbby te conheçam e queiram te contratar.";

    constructor(
        injector: Injector,
        private _worbbiorService: WorbbiorServiceProxy,
        private _appSessionService: AppSessionService,
        private _profileService: ProfileServiceProxy
    ) {
        super(injector);
    }

    ngAfterViewInit(): void {
        this._worbbiorService.getWorbbiorForEdit().subscribe((result) => {
            this.user = result;
            this.user.saveRadius = false;
            this._initialTimezone = result.timezone;
            this.canChangeUserName = this.user.userName != AppConsts.userManagement.defaultAdminUserName;
            this.active = true;
            this.getProfilePicture();
        });
        
        if(this._appSessionService.firstLoginUser == "true") {
            this.callTutorialModal();
        }        
    }

    ngOnInit() {
        this.worbbiorState = this._appSessionService.worbbiorState;
        abp.event.on("profilePictureChanged", () => {
            this.getProfilePicture();
        });
    }

    callTutorialModal(): void {
        this.infoTutorialModal.show();
    }

    changeProfilePicture(): void {
        this.userDataChangeProfilePictureModal.show();
    }

    getProfilePicture(): void {
        this._profileService.getProfilePicture().subscribe(result => {
            if (result && result.profilePicture) {
                this.profilePicture = 'data:image/jpeg;base64,' + result.profilePicture;
            }
        });
    }

    save(showNotify: boolean = true, callback: (valid: boolean) => void): void {

        if (this.user.description != null && this.user.description.length > 400) {
            this.message.info("Campo Sobre mim é inválido").done(() => {
                callback(false);             
            });
        }
        else {
            this.saving = true;

            if (this.user.worbbiorState == Number(this.WorbbiorState.Active)) {
                this.updateCurrentWorbbior(showNotify, callback);
            } 
            else if (this.user.worbbiorState == Number(this.WorbbiorState.PreRegistration) || this.user.worbbiorState == Number(this.WorbbiorState.WaitingEdit) ) {
                this.updateCurrentWorbbiorDisableValidation(showNotify, callback);
            }
            
            this._appSessionService.worbbiorDisplayName = this.user.displayName ? this.user.displayName : this._appSessionService.worbbiorDisplayName;

            abp.event.trigger("displayNameChanged");
        }
    }

    updateWorbbiorState(): void {
        this.worbbiorState = this._appSessionService.worbbiorState;
    }

    updateCurrentWorbbior(showNotify: boolean = true, callback: (valid) => void): void {
        this._worbbiorService.updateCurrentWorbbior(this.user)
            .finally(() => {
                this.saving = false;
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

                callback(true);
            });
    }

    updateCurrentWorbbiorDisableValidation(showNotify: boolean = true, callback: (valid) => void): void {
        this._worbbiorService.updateCurrentWorbbiorDisableValidation(this.user)
            .finally(() => {
                this.saving = false;
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

                callback(true);
            });
    }
}