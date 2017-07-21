import { Component, OnInit, Injector, ViewEncapsulation, ViewChild, Input } from '@angular/core';
import { AbpSessionService } from '@abp/session/abp-session.service';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { AbpMultiTenancyService } from '@abp/multi-tenancy/abp-multi-tenancy.service';
import {
    ProfileServiceProxy,
    UserLinkServiceProxy,
    UserServiceProxy,
    LinkedUserDto,
    TenantLoginInfoDto,
    GetCurrentLoginInformationsOutput,
    EntityDtoOfInt64,
    WorbbiorServiceProxy
} from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppAuthService } from '@app/shared/common/auth/app-auth.service';
import { MenuComponent } from '@app/shared/layout/menu.component';
import { ChangePasswordModalComponent } from './profile/change-password-modal.component';
import { Router, ActivatedRoute } from '@angular/router';

import * as _ from 'lodash';
import * as moment from 'moment';
import { ChangeProfilePictureModalComponent } from "app/shared/layout/profile/change-profile-picture-modal.component";
import { UserMenu } from "app/shared/layout/user-menu";
import { UserMenuItem } from "app/shared/layout/user-menu-item";
import { UtilsService } from "abp-ng2-module/src/utils/utils.service";

@Component({
    templateUrl: './app-header.component.html',
    selector: '[app-header]',
    encapsulation: ViewEncapsulation.None
})
export class AppHeaderComponent extends AppComponentBase implements OnInit {

    @Input('changePasswordModal') changePasswordModal: ChangeProfilePictureModalComponent;

    profilePicture: string = "/assets/common/images/default-profile-picture.png";
    currentRoleName: string = "";
    switchRole: boolean = false;
    toWorbbiorRegister: boolean = false;
    userName: string;

    languages: abp.localization.ILanguageInfo[];
    currentLanguage: abp.localization.ILanguageInfo;
    isImpersonatedLogin: boolean = false;

    isAuthenticated:boolean = false;

    shownLoginNameTitle: string = "";
    shownLoginName: string = "";
    recentlyLinkedUsers: LinkedUserDto[];
    unreadChatMessageCount = 0;

    chatConnected = false;

    public isWorbbior: boolean = false;
    public isMobile: boolean = false;
    public menuOpen:string = "";

    constructor(
        injector: Injector,
        public appSessionService: AppSessionService,
        private sessionService: AbpSessionService,
        private abpMultiTenancyService: AbpMultiTenancyService,
        private profileServiceProxy: ProfileServiceProxy,
        private userLinkServiceProxy: UserLinkServiceProxy,
        private userServiceProxy: UserServiceProxy,
        private router: Router,
        private _authService: AppAuthService,
        private _worbbiorService: WorbbiorServiceProxy,
        private _utilsService: UtilsService
    ) {
        super(injector);
    }


    ngOnInit() {
        if (abp.session.userId){
            this.isAuthenticated = true;
        }
        this.currentRoleName = this.appSessionService.userRoleName;
        this.languages = this.localization.languages;
        this.currentLanguage = this.localization.currentLanguage;

        this.getCurrentLoginInformations();
        this.getProfilePicture();

        this.registerToEvents();

        this.isWorbbior = this.appSession.userRoleName == "Worbbior";
        this.isMobile = window.screen.width < 768;

        this.userName = this.appSessionService.user.name;
        this.switchRole = this.permission.isGranted("Pages.Worbbior.SwitchToWorbbientProfile");
        this.toWorbbiorRegister = !this.switchRole ? true : false ;
    }

    changeLanguage(languageName: string): void {
        abp.utils.setCookieValue("Abp.Localization.CultureName", languageName);
        location.reload();
    }

    getProfilePicture(): void {
        this.profileServiceProxy.getProfilePicture().subscribe(result => {
            if (result && result.profilePicture) {
                this.profilePicture = 'data:image/jpeg;base64,' + result.profilePicture;
            }
        });
    }

    getShownUserName(linkedUser: LinkedUserDto): string {
        if (!this.abpMultiTenancyService.isEnabled) {
            return linkedUser.username;
        }

        return (linkedUser.tenantId ? linkedUser.tenancyName : ".") + "\\" + linkedUser.username;
    }

    getCurrentLoginInformations(): void {
        this.shownLoginName = this.appSessionService.getShownLoginName();
    }

    registerToEvents() {
        abp.event.on("profilePictureChanged", () => {
            this.getProfilePicture();
        });

        abp.event.on('app.chat.unreadMessageCountChanged', messageCount => {
            this.unreadChatMessageCount = messageCount;
        });

        abp.event.on('app.chat.connected', () => {
            this.chatConnected = true;
        });
    }

    postWorbbyTask() {
        if(this.currentRoleName == 'Worbbior')
        {
            this.message.confirm(
            "", "Deseja  alterar o seu prefil para o worbbient?",
            isConfirmed => {
                if (isConfirmed) {
                    this.appSessionService.userRoleName = "Worbbient";
                    setTimeout(
                        function(){ 
                            location.href = "/post-a-task";
                        },
                    500);                
                }
            });

        }else if(this.currentRoleName == 'Worbbient'){
             this.appSessionService.userRoleName = "Worbbient";
            this.router.navigate(['/post-a-task']);
        }
    }

    showHideMenu(): void {
        if (this.menuOpen == "") {
            this.menuOpen = "open";
        } else {
            this.menuOpen = "";
        }
    }

    menu: UserMenu = new UserMenu("UserMenu", "UserMenu", [
        new UserMenuItem("MyWorbby", "Pages.Worbbient.MyWorbby", "Worbbient", "", "/worbbient/my-worbby"),
        new UserMenuItem("TasksHistory", "Pages.Worbbient.TasksHistory", "Worbbient", "", "/worbbient/tasks-history"),
        new UserMenuItem("PaymentsHistory", "Pages.Worbbient.PaymentsHistory", "Worbbient", "", "/worbbient/payments-history"),
        new UserMenuItem("EditProfile", "Pages.Worbbient.EditProfile", "Worbbient", "", "/worbbient/edit-profile"),

        new UserMenuItem("MyWorbby", "Pages.Worbbior.MyWorbby", "Worbbior", "", "/worbbior/my-worbby"),
        new UserMenuItem("TasksHistory", "Pages.Worbbior.TasksHistory", "Worbbior", "", "/worbbior/tasks-history"),
        new UserMenuItem("PaymentsHistory", "Pages.Worbbior.PaymentsHistory", "Worbbior", "", "/worbbior/payments-history"),
        new UserMenuItem("EditProfile", "Pages.Worbbior.EditProfile", "Worbbior", "", "/worbbior/edit-profile"),
        new UserMenuItem("ViewProfile", "Pages.Worbbior.EditProfile", "Worbbior", "", "/worbbior/page/", this.appSessionService.worbbiorSlug ? this.appSessionService.worbbiorSlug : ""),
    ]);
    
    showMenuItem(menuItem): boolean {
        if (menuItem.permissionName) {
            return this.permission.isGranted(menuItem.permissionName) && menuItem.roleName == this.currentRoleName;
        }

        return true; 
    }
 
    switchToWorbbiorProfile(){
        this.appSessionService.userRoleName = "Worbbior";
        setTimeout(
            function(){ 
                location.href = "/";
            },
        500);        
    }

    switchToWorbbientProfile() {
        this.appSessionService.userRoleName = "Worbbient";
        setTimeout(
            function(){ 
                location.href = "/";
            },
        500);
    }

    worbbientToWorbbior():void {
        this.message.confirm(
            "Deseja tornar-se também um Worbbior?", "Seja um Worbbior!",
            isConfirmed => {
                if (isConfirmed) {
                    
                    this._worbbiorService.worbbientToWorbbior(new EntityDtoOfInt64({ id: abp.session.userId }))
                    .finally(() => {
                    })
                    .subscribe(() => {
                        this.message.custom('Precisamos de mais algumas informações sobre você, preencha os dados na próxima página para ganhar dinheiro oferecendo suas habilidades. Mas atenção, só após completar todos os campos, o seu perfil Worbbior será ativado na plataforma.', 'Falta pouco para você ser um worbbior!', 'assets/common/images/default-profile-picture.png').done(() => {
                            this.appSessionService.userRoleName = "Worbbior";
                            location.href = "/";
                        });
                    });;
                }
            }
        );        
    }

    logout(): void {
        this._utilsService.deleteCookie("userRoleName");
        this._utilsService.deleteCookie("firstLoginUser");
        this._authService.logout();        
    }

    changePassword():void{
        abp.event.trigger("changePasswordModal");
    }
}