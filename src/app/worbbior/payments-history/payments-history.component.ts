import { Component, Injector, AfterViewInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Router, ActivatedRoute } from '@angular/router';
import { UserMenu } from "app/shared/layout/user-menu";
import { UserMenuItem } from "app/shared/layout/user-menu-item";
import { AppSessionService } from "shared/common/session/app-session.service";
import { AppAuthService } from "app/shared/common/auth/app-auth.service";
import { BalanceTransferOutput, EntityDtoOfInt64, ProfileServiceProxy, CurrentUserProfileEditDto, AddressServiceProxy, AddressDto, BalanceAvailableOutput, BalanceTransferServiceProxy, RequestBalanceTransferInput } from "shared/service-proxies/service-proxies";
import { AppConsts } from "shared/AppConsts";
import { WorbbiorState } from "shared/AppEnums";
import { GeneralPaymentWorbbiorComponent } from "app/worbbior/payments-history/general-payment.component";
import { ReceivedPaymentWorbbiorComponent } from "app/worbbior/payments-history/received-payment.component";
import { PaidPaymentWorbbiorComponent } from "app/worbbior/payments-history/paid-payment.component";

@Component({
    templateUrl: './payments-history.component.html',
    animations: [appModuleAnimation()]
})
export class PaymentsHistoryWorbbiorComponent extends AppComponentBase implements AfterViewInit {

    @ViewChild('generalPayment') generalPayment: GeneralPaymentWorbbiorComponent;
    @ViewChild('receivedPayment') receivedPayment: ReceivedPaymentWorbbiorComponent;
    @ViewChild('paidPayment') paidPayment: PaidPaymentWorbbiorComponent;

    public filter: string;
    public active: boolean = false;
    public saving: boolean = false;
    public currentRoleName: string = "";
    public worbbiorState: WorbbiorState;
    public worbbiorPremium: boolean;
    public hash: string;

    public user: CurrentUserProfileEditDto;
    public defaultAddress: AddressDto;
    public userDisplayName: string;
    public _initialTimezone: string = undefined;
    public profilePicture: string = "/assets/common/images/default-profile-picture.png";
    public canChangeUserName: boolean;
    public WorbbiorState: typeof WorbbiorState = WorbbiorState;
    public switchRole: boolean = false;
    public worbbiorStatusPerfil: string = "";

    public balanceAvailable:number;

    public generalPaymentTabActive: boolean;
    public receivedPaymentTabActive: boolean;
    public paidPaymentPageTabActive: boolean;
    public transferId:number;
    public balanceTransfers:BalanceTransferOutput[] = [];

    constructor(
        injector: Injector,
        private _appSessionService: AppSessionService,
        private _addressService: AddressServiceProxy,
        private _profileService: ProfileServiceProxy,
        private _authService: AppAuthService,
        private _activatedRoute: ActivatedRoute,
        private router: Router,
        private _balanceTransferService: BalanceTransferServiceProxy
    ) {
        super(injector);
    }

    ngOnInit() {
        this.currentRoleName = this._appSessionService.userRoleName;
        this.worbbiorState = this._appSessionService.worbbiorState;
        this.worbbiorPremium = this._appSessionService.worbbiorPremium;
        this.worbbiorStatusPerfil = this.WorbbiorState[this.worbbiorState];
        this.switchRole = this.permission.isGranted("Pages.Worbbior.SwitchToWorbbientProfile");

        this.hash = this._activatedRoute.snapshot.params['hash'];
        if (this.hash) {
            this.setActiveTab(this.hash);
        }

        this._balanceTransferService.getBalanceAvailableByUserId(abp.session.userId)
        .finally(() => { 

         })
        .subscribe(result => {
            this.balanceAvailable = result.amount;
        }, error => {
            console.log(error);
        });


        this._balanceTransferService.getBalanceTransfersByUserId(abp.session.userId)
        .finally(() => { 

         })
        .subscribe(result => {
            this.balanceTransfers = result.items;
            console.log(this.balanceTransfers);
        }, error => {
            console.log(error);
        });
        
    }

    ngAfterViewInit(): void {
        this.getWorbbior();
        this.getAddresDefault();
    }

    menu: UserMenu = new UserMenu("UserMenu", "UserMenu", [
        new UserMenuItem("MyWorbby", "Pages.Worbbient.MyWorbby", "Worbbient", "", "/worbbient/my-worbby"),
        new UserMenuItem("PostTask", "Pages.Worbbient.PostTask", "Worbbient", "", "/worbbient/post-task"),
        new UserMenuItem("TasksHistory", "Pages.Worbbient.TasksHistory", "Worbbient", "", "/worbbient/tasks-history"),
        new UserMenuItem("EditProfile", "Pages.Worbbient.EditProfile", "Worbbient", "", "/worbbient/edit-profile"),
        //new UserMenuItem("Messages", "Pages.Worbbient.Messages", "", "Worbbient", "/worbbient/messages"),

        new UserMenuItem("MyWorbby", "Pages.Worbbior.MyWorbby", "Worbbior", "", "/worbbior/my-worbby"),
        new UserMenuItem("TasksHistory", "Pages.Worbbior.TasksHistory", "Worbbior", "", "/worbbior/tasks-history"),
        new UserMenuItem("EditProfile", "Pages.Worbbior.EditProfile", "Worbbior", "", "/worbbior/edit-profile"),
        //new UserMenuItem("Messages", "Pages.Worbbior.Messages", "Worbbior", "", "/worbbior/messages"),
        //new UserMenuItem("DiscoverYourTalents", "", "Worbbior", "", "/worbbior/talent-questionnaire"),
        new UserMenuItem("ViewProfile", "", "Worbbior", "", "/worbbior/page/", this._appSessionService.worbbiorSlug ? this._appSessionService.worbbiorSlug : ""),
    ]);

    checkTabs(): void {
        this.generalPaymentTabActive = $("#generalPaymentPage").hasClass("active");
        this.receivedPaymentTabActive = $("#receivedPaymentPage").hasClass("active");
        this.paidPaymentPageTabActive = $("#paidPaymentPage").hasClass("active");
    }

    findByTerm(): void {
        this.router.navigate(['/find-a-talents-t', this.filter]);
    }

    getAddresDefault(): void {
        this._addressService.getAddressDefaultByUserId(abp.session.userId).subscribe((result: AddressDto) => {
            this.defaultAddress = result;
            this.defaultAddress.subLocality = this.defaultAddress.subLocality ? this.defaultAddress.subLocality.trim() : null;
        });
    }

    getProfilePicture(): void {
        this._profileService.getProfilePicture().subscribe(result => {
            if (result && result.profilePicture) {
                this.profilePicture = 'data:image/jpeg;base64,' + result.profilePicture;
            }
        });
    }

    getWorbbior(): void {
        this._profileService.getCurrentUserProfileForEdit().subscribe((result) => {
            this.user = result;
            this.userDisplayName = this._appSessionService.worbbiorDisplayName ? this._appSessionService.worbbiorDisplayName : this.user.name + " " + this.user.surname;
            this._initialTimezone = result.timezone;
            this.canChangeUserName = this.user.userName != AppConsts.userManagement.defaultAdminUserName;
            this.active = true;
            this.getProfilePicture();
        });
    }

    logout(): void {
        this._authService.logout();
    }

    setActiveTab(hash: string): void {
        $('.nav-pills a[href="#' + hash + '"]').trigger('click');
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

    requestBalanceAvailable():void{
        var input = new RequestBalanceTransferInput();
        input.amount = this.balanceAvailable;
        input.userId = abp.session.userId;
        input.bankAccountId = 1;

        this._balanceTransferService.requestBalanceTransfer(input)
        .finally(() => { 

         })
        .subscribe(result => {
        }, error => {
            console.log(error);
        });
    }


    testConfirmRequest():void{

        this._balanceTransferService.confirmBalanceTransfer(new EntityDtoOfInt64({id: this.transferId}))
        .finally(() => { 

         })
        .subscribe(result => {
        }, error => {
            console.log(error);
        });
    }

    testCancelRequest():void{
        this._balanceTransferService.cancelBalanceTransfer(new EntityDtoOfInt64({id: this.transferId}))
        .finally(() => { 

         })
        .subscribe(result => {
        }, error => {
            console.log(error);
        });
    }
}