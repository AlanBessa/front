import { Component, OnInit, Injector,ViewChild, Input } from '@angular/core';
import { UserMenu } from './user-menu';
import { UserMenuItem } from './user-menu-item';
import {
    ProfileServiceProxy,
    UserLinkServiceProxy,
    UserServiceProxy,
    LinkedUserDto,
    ChangeUserLanguageDto,
    WorbbiorServiceProxy,
    EntityDtoOfInt64
} from '@shared/service-proxies/service-proxies';
import { AbpMultiTenancyService } from '@abp/multi-tenancy/abp-multi-tenancy.service';
import { PermissionCheckerService } from '@abp/auth/permission-checker.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { AppAuthService } from '@app/shared/common/auth/app-auth.service';
import { ChangeProfilePictureModalComponent } from '@app/shared/layout/profile/change-profile-picture-modal.component';
import { UtilsService } from '@abp/utils/utils.service';

@Component({
    templateUrl: './menu.component.html',
    selector: '[user-menu]'
})
export class MenuComponent extends AppComponentBase implements OnInit {

    @Input('changePasswordModal') changePasswordModal: ChangeProfilePictureModalComponent;

    profilePicture: string = "/assets/common/images/default-profile-picture.png";
    currentRoleName: string = "";
    switchRole: boolean = false;
    toWorbbiorRegister: boolean = false;
    userName: string;

    constructor(
        injector: Injector, 
        public permission: PermissionCheckerService,
        private appSessionService: AppSessionService,
        private profileServiceProxy: ProfileServiceProxy,
        private _authService: AppAuthService,
        private abpMultiTenancyService: AbpMultiTenancyService,
        private _worbbiorService: WorbbiorServiceProxy,
        private _utilsService: UtilsService) {
        super(injector);
    }
    
    menu: UserMenu = new UserMenu("UserMenu", "UserMenu", [
        //new UserMenuItem("Home", null, null, "icon-home", "/home"),
        new UserMenuItem("MyWorbby", "Pages.Worbbient.MyWorbby", "Worbbient", "", "/worbbient/my-worbby"),
        new UserMenuItem("PostTask", "Pages.Worbbient.PostTask", "Worbbient", "", "/post-a-task"),
        new UserMenuItem("TasksHistory", "Pages.Worbbient.TasksHistory", "Worbbient", "", "/worbbient/tasks-history"),
        new UserMenuItem("PaymentsHistory", "Pages.Worbbient.PaymentsHistory", "Worbbient", "", "/worbbient/payments-history"),
        //new UserMenuItem("Messages", "Pages.Worbbient.Messages", "", "Worbbient", "/worbbient/messages"),
        new UserMenuItem("EditProfile", "Pages.Worbbient.EditProfile", "Worbbient", "", "/worbbient/edit-profile"),

        new UserMenuItem("MyWorbby", "Pages.Worbbior.MyWorbby", "Worbbior", "", "/worbbior/my-worbby"),
        new UserMenuItem("TasksHistory", "Pages.Worbbior.TasksHistory", "Worbbior", "", "/worbbior/tasks-history"),
        new UserMenuItem("PaymentsHistory", "Pages.Worbbior.PaymentsHistory", "Worbbior", "", "/worbbior/payments-history"),
        //new UserMenuItem("Messages", "Pages.Worbbior.Messages", "Worbbior", "", "/worbbior/messages"),
        new UserMenuItem("EditProfile", "Pages.Worbbior.EditProfile", "Worbbior", "", "/worbbior/edit-profile"),
        //new UserMenuItem("DiscoverYourTalents", "Pages.Worbbior.EditProfile", "Worbbior", "", "/worbbior/talent-questionnaire"),
        new UserMenuItem("ViewProfile", "Pages.Worbbior.EditProfile", "Worbbior", "", "/worbbior/page/", this.appSessionService.worbbiorSlug ? this.appSessionService.worbbiorSlug : ""),
    ]);
    
    showMenuItem(menuItem): boolean {
        if (menuItem.permissionName) {
            return this.permission.isGranted(menuItem.permissionName) && menuItem.roleName == this.currentRoleName;
        }

        return true; 
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

    ngOnInit() {
        this.currentRoleName = this.appSessionService.userRoleName;
        this.getProfilePicture();
        this.userName = this.appSessionService.user.name;
        this.switchRole = this.permission.isGranted("Pages.Worbbior.SwitchToWorbbientProfile");
        this.toWorbbiorRegister = !this.switchRole ? true : false ;
        abp.event.on("profilePictureChanged", () => {
            this.getProfilePicture();
        });
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