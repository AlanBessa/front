import { Component, Injector, AfterViewInit, AfterContentInit, ViewChild, Inject, OnInit, HostListener, OnDestroy } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { AppConsts } from '@shared/AppConsts';
import { FileUploader, FileUploaderOptions, Headers } from '@node_modules/ng2-file-upload';
import { EntityDtoOfInt64, WorbbiorServiceProxy, AddressServiceProxy, AddressDto, ProfileServiceProxy, CurrentUserProfileEditDto, DefaultTimezoneScope, UserLoginInfoDto } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { AppTimezoneScope } from '@shared/AppEnums';
import { ChangeProfilePictureModalComponent } from '@app/shared/layout/profile/change-profile-picture-modal.component';
import { MyPersonalDataWorbbiorComponent } from './my-personal-data.component';
import { MyActivitiesWorbbiorComponent } from './my-activities.component';
import { MyDocumentsWorbbiorComponent } from './my-documents.component';
import { MyAvailabilityWorbbiorComponent } from './my-availability.component';
import { MyEndorsementsWorbbiorComponent } from './my-endorsements.component';
import { WorbbiorState } from '@shared/AppEnums';
import { UserMenu } from '@app/shared/layout/user-menu';
import { UserMenuItem } from '@app/shared/layout/user-menu-item';
import { AppAuthService } from '@app/shared/common/auth/app-auth.service';
import { Angulartics2 } from 'angulartics2';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from "rxjs/Observable";
import { AbpHttpConfiguration } from "abp-ng2-module/src/abpHttp";

@Component({
    templateUrl: './edit-profile.component.html',
    animations: [appModuleAnimation()]
})
export class EditProfileWorbbiorComponent extends AppComponentBase implements AfterViewInit  {

    @ViewChild('changeProfilePictureModal') changeProfilePictureModal: ChangeProfilePictureModalComponent;

    @ViewChild('editMyPersonalDataWorbbior') editMyPersonalDataWorbbior: MyPersonalDataWorbbiorComponent;
    @ViewChild('editMyActivitiesWorbbior') editMyActivitiesWorbbior: MyActivitiesWorbbiorComponent;
    @ViewChild('editMyDocumentsWorbbior') editMyDocumentsWorbbior: MyDocumentsWorbbiorComponent;
    @ViewChild('editMyAvailabilityWorbbior') editMyAvailabilityWorbbior: MyAvailabilityWorbbiorComponent;
    @ViewChild('editMyEndorsementsWorbbior') editMyEndorsementsWorbbior: MyEndorsementsWorbbiorComponent;

    @HostListener('window:unload', [ '$event' ])
    unloadHandler(event) {
        event.returnValue='Your data will be lost!';
    }

    @HostListener('window:beforeunload', [ '$event' ])
    beforeUnloadHander(event) {
        event.returnValue='Your data will be lost!';
    }

    // @HostListener('window:popstate', ['$event'])
    // onPopState(event) {
    //     if(confirm("Deseja sair desta página? É possível que as alterações feitas não sejam salvas.")) {
    //         this._router.navigate([this._router.url]);
    //     }
    // }

    public active: boolean = false;
    public saving: boolean = false;
    public worbbiorState: WorbbiorState;
    public worbbiorPremium: boolean;
    public hash: string;

    public user: CurrentUserProfileEditDto;
    public userDisplayName: string;
    public defaultAddress: AddressDto;
    public showTimezoneSelection: boolean = abp.clock.provider.supportsMultipleTimezone;
    public canChangeUserName: boolean;
    public defaultTimezoneScope: DefaultTimezoneScope = AppTimezoneScope.User;
    private _initialTimezone: string = undefined;
    profilePicture: string = "/assets/common/images/default-profile-picture.png";
    public WorbbiorState: typeof WorbbiorState = WorbbiorState;
    currentRoleName: string = "";
    switchRole: boolean = false;
    public worbbiorStatusPerfil: string = "";
    public documentTabActive: boolean;
    public personalDataTabActive: boolean;

    public editProfile:EditProfileWorbbiorComponent;

    constructor(
        injector: Injector,
        private _profileService: ProfileServiceProxy,
        private _appSessionService: AppSessionService,
        private _addressService: AddressServiceProxy,
        private _worbbiorService: WorbbiorServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _authService: AppAuthService,
        private angulartics2: Angulartics2,
        private _router:Router
    ) {
        super(injector);
    }

    menu: UserMenu = new UserMenu("UserMenu", "UserMenu", [
        new UserMenuItem("MyWorbby", "Pages.Worbbient.MyWorbby", "Worbbient", "", "/worbbient/my-worbby"),
        new UserMenuItem("PostTask", "Pages.Worbbient.PostTask", "Worbbient", "", "/worbbient/post-task"),
        new UserMenuItem("TasksHistory", "Pages.Worbbient.TasksHistory", "Worbbient", "", "/worbbient/tasks-history"),
        new UserMenuItem("PaymentsHistory", "Pages.Worbbient.PaymentsHistory", "Worbbient", "", "/worbbient/payments-history"),
        //new UserMenuItem("Messages", "Pages.Worbbient.Messages", "", "Worbbient", "/worbbient/messages"),

        new UserMenuItem("MyWorbby", "Pages.Worbbior.MyWorbby", "Worbbior", "", "/worbbior/my-worbby"),
        new UserMenuItem("TasksHistory", "Pages.Worbbior.TasksHistory", "Worbbior", "", "/worbbior/tasks-history"),
        new UserMenuItem("PaymentsHistory", "Pages.Worbbior.PaymentsHistory", "Worbbior", "", "/worbbior/payments-history"),
        //new UserMenuItem("Messages", "Pages.Worbbior.Messages", "Worbbior", "", "/worbbior/messages"),
        //new UserMenuItem("DiscoverYourTalents", "", "Worbbior", "", "/worbbior/talent-questionnaire"),
        new UserMenuItem("ViewProfile", "", "Worbbior", "", "/publico/worbbior/page/", this._appSessionService.worbbiorSlug ? this._appSessionService.worbbiorSlug : ""),
    ]);

    ngOnInit() {
        this.editProfile = this;

        this.currentRoleName = this._appSessionService.userRoleName;
        this.worbbiorState = this._appSessionService.worbbiorState;
        this.worbbiorPremium = this._appSessionService.worbbiorPremium;
        this.worbbiorStatusPerfil = this.WorbbiorState[this.worbbiorState];
        this.switchRole = this.permission.isGranted("Pages.Worbbior.SwitchToWorbbientProfile");
        this.getAddresDefault();
        this.hash = this._activatedRoute.snapshot.params['hash'];
        if (this.hash) {
            this.setActiveTab(this.hash);
        }
        abp.event.on("profilePictureChanged", () => {
            this.getProfilePicture();
        });

        abp.event.on("displayNameChanged", () => {
            this.updateDisplayName();
        });
    }

    ngAfterViewInit(): void {
        $("body").scrollTop(0);
        $(".page-loading").hide();
        let self = this;
        this._profileService.getCurrentUserProfileForEdit().subscribe((result) => {
            this.user = result;
            this.userDisplayName = this._appSessionService.worbbiorDisplayName ? this._appSessionService.worbbiorDisplayName : this.user.name + " " + this.user.surname;
            this._initialTimezone = result.timezone;
            this.canChangeUserName = this.user.userName != AppConsts.userManagement.defaultAdminUserName;
            this.active = true;
            this.getProfilePicture();
        });
        

        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            self.angulartics2.pageTrack.next({ path: '/worbbior/edit-profile/' + e.target.getAttribute('href'), location: location });
            self.checkTabs();
        });
    }

    ngAfterContentInit() {
        this.checkTabs();
    }

    checkTabs(): void {
        this.documentTabActive = $("#myDocuments").hasClass("active");
        this.personalDataTabActive = $("#myPersonalData").hasClass("active");
        this.editMyAvailabilityWorbbior.abaActive = $("#myAvailability").hasClass("active");
        if(this.documentTabActive){
            this.editMyDocumentsWorbbior.refreshBank();
        }
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

    requestActivation(): void {
        this.saving = true;
        var entityDto: EntityDtoOfInt64 = new EntityDtoOfInt64();
        entityDto.id = abp.session.userId;

        this.editMyPersonalDataWorbbior.save(false, (valid) => {
            this.editMyAvailabilityWorbbior.createOrUpdateAddress(false, () => {
                this.editMyDocumentsWorbbior.save(false, () => {
                    this._worbbiorService.requestActivation(entityDto)
                    .finally(() => { this.saving = false; })
                    .subscribe(result => {
                        this.saving = false;
                        this.message.success("Você receberá uma notificação assim que o seu perfil for reativado."," Ativação solicitada!")

                        let filters = "SUCESSO";
                        this.angulartics2.eventTrack.next({ 
                            action: filters, 
                            properties: { category: 'Solicitar ativação de cadastro', 
                            label: this._appSessionService.user.emailAddress } 
                        });
                        
                        if(this._appSessionService.worbbiorState == WorbbiorState.PreRegistration){
                            this._appSessionService.worbbiorState = WorbbiorState.WaitingActivation;
                        }else if(this._appSessionService.worbbiorState == WorbbiorState.WaitingEdit){
                            this._appSessionService.worbbiorState = WorbbiorState.WaitingActivEdit;
                        }

                        this.updateWorbbiorState();
                        this.editMyPersonalDataWorbbior.updateWorbbiorState();
                        this.editMyActivitiesWorbbior.updateWorbbiorState();
                        this.editMyDocumentsWorbbior.updateWorbbiorState();
                        this.editMyAvailabilityWorbbior.updateWorbbiorState();
                        this.editMyEndorsementsWorbbior.updateWorbbiorState();
                    }, error => {

                        let filters = "FALHA | Erros: " + (error.error == undefined ? "details undefined" : error.error.details);

                        this.angulartics2.eventTrack.next({ 
                            action: filters, 
                            properties: { category: 'Solicitar ativação de cadastro', 
                            label: this._appSessionService.user.emailAddress } 
                        });
                    });
                });
            });
        });
    }

    saveProfile(): void {
        this.saving = true;
        this.editMyPersonalDataWorbbior.save(false, (valid) => {
            if(valid) {
                this.editMyAvailabilityWorbbior.createOrUpdateAddress(false, () => {
                    this.editMyDocumentsWorbbior.save(false, () => {
                            this.saving = false;

                            this.notify.info(this.l('SavedSuccessfully'));
                    });
                });
            }
            else {
                this.saving = false;
            }            
        });
    }

    setActiveTab(hash: string): void {
        $('.nav-pills a[href="#' + hash + '"]').trigger('click');
    }

    nextTab(): void {
        $('.nav-pills > .active').next('li').find('a').trigger('click');
        //this.checkTabs();
    }

    backTab(): void {
        $('.nav-pills > .active').prev('li').find('a').trigger('click');
        //this.checkTabs();
    }

    updateWorbbiorState(): void {
        this.worbbiorState = this._appSessionService.worbbiorState;
    }

    showMenuItem(menuItem): boolean {
        if (menuItem.permissionName) {
            return this.permission.isGranted(menuItem.permissionName) && menuItem.roleName == this.currentRoleName;
        }

        return true;
    }

    switchToWorbbiorProfile() {
        this._appSessionService.userRoleName = "Worbbior";
        setTimeout(
            function(){ 
                location.href = "/";
            },
        500);
    }

    switchToWorbbientProfile() {
        this._appSessionService.userRoleName = "Worbbient";
        setTimeout(
            function(){ 
                location.href = "/";
            },
        500);
    }

    getAddresDefault(): void {
        this._addressService.getAddressDefaultByUserId(abp.session.userId).subscribe((result: AddressDto) => {
            this.defaultAddress = result;
            this.defaultAddress.subLocality = this.defaultAddress.subLocality ? this.defaultAddress.subLocality.trim() : null;
        });
    }

    logout(): void {
        this._authService.logout();
    }

    updateDisplayName():void {
        this.userDisplayName = this._appSessionService.worbbiorDisplayName ? this._appSessionService.worbbiorDisplayName : this.user.name + " " + this.user.surname;
    }
}