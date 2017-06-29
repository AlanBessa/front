import { Component, Injector, AfterViewInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { WorbbyTaskInput, EntityDtoOfInt64, WorbbyTaskServiceProxy, WorbbyTaskDto, ProfileServiceProxy, AddressServiceProxy, CurrentUserProfileEditDto, AddressDto, WorbbyOfferDto } from '@shared/service-proxies/service-proxies';
import { UserMenu } from '@app/shared/layout/user-menu';
import { UserMenuItem } from '@app/shared/layout/user-menu-item';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { AppAuthService } from '@app/shared/common/auth/app-auth.service';
import { UnitMeasure } from '@shared/AppEnums';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';

@Component({
    templateUrl: './my-worbby.component.html',
    animations: [appModuleAnimation()]
})
export class MyWorbbyWorbbiorComponent extends AppComponentBase implements AfterViewInit {

    public active: boolean = false;
    public saving: boolean = false;

    public user: CurrentUserProfileEditDto;
    profilePicture: string = "/assets/common/images/default-profile-picture.png";
    worbbientDefaultPicure: string = "/assets/common/images/default-profile-picture.png";
    currentRoleName: string = "";
    switchRole: boolean = false;
    public defaultAddress: AddressDto;

    public worbbyTasksOffersAccepted: WorbbyTaskDto[] = [];
    public worbbyTasksOffersConfirmed: WorbbyTaskDto[] = [];
    public pendingOffers: WorbbyOfferDto[] = [];
    public tasksProposed: WorbbyTaskDto[] = [];
    public tasksProposedAcceptedByWorbbior: WorbbyTaskDto[] = [];
    public worbbyTasksInProgress: WorbbyTaskDto[] = [];

    public UnitMeasure: typeof UnitMeasure = UnitMeasure;

    public filter: string;

    public worbbiorPremium: boolean;

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
        this.currentRoleName = this._appSessionService.userRoleName;
        this.switchRole = this.permission.isGranted("Pages.Worbbior.SwitchToWorbbientProfile");
        this.worbbiorPremium = this._appSessionService.worbbiorPremium;
        this._profileService.getCurrentUserProfileForEdit().subscribe((result) => {
            this.user = result;
            this.getProfilePicture();
            this.getAddresDefault();
            this.getPendingOffers();
            this.getTasksProposed();
            this.getTasksProposedAcceptedByWorbbior();
            this.getWorbbyTasksOffersAcceptedByWorbbient();
            this.getWorbbyTasksOffersConfirmedByWorbbior();
            this.getGetWorbbyTasksInProgress();
        });
    }

    ngAfterViewInit(): void {
        $("body").scrollTop(0);
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
        this._worbbyTaskService.getWorbbyTasksInProgressByTargetUserId(abp.session.userId).subscribe(result => {
            this.worbbyTasksInProgress = result.items;
            this.worbbyTasksInProgress.forEach(element => {
                if (element.worbbient.userPictureId != null) {
                    this.getPictureByGuid(element.worbbient.userPictureId).then((result) => {
                        element.worbbient.userPicture = result;
                    });
                } else {
                    element.worbbient.userPicture = this.worbbientDefaultPicure;
                }
            });
        });
    }

    getPendingOffers(): void {
        this._worbbyTaskService.getPendingOffersByUserId(abp.session.userId).subscribe(result => {
            this.pendingOffers = result.items;
            this.pendingOffers.forEach(element => {
                this.getPictureByGuid(element.worbbyTask.interestCenter.parentPictureId).then((result) => {
                    element.worbbyTask.interestCenter.parentPicture = result;
                });
            });
        });
    }

    getTasksProposed(): void {
        this._worbbyTaskService.getWorbbyTasksProposedByTargetUserId(abp.session.userId).subscribe(result => {
            this.tasksProposed = result.items;
            this.tasksProposed.forEach(element => {
                this.getPictureByGuid(element.worbbient.userPictureId).then((result) => {
                    element.worbbient.userPicture = result;
                });
            });
        });
    }

    getTasksProposedAcceptedByWorbbior(): void {
        this._worbbyTaskService.getWorbbyTasksProposedAndAcceptedByTargetUserId(abp.session.userId).subscribe(result => {
            this.tasksProposedAcceptedByWorbbior = result.items;
            this.tasksProposedAcceptedByWorbbior.forEach(element => {
                this.getPictureByGuid(element.worbbient.userPictureId).then((result) => {
                    element.worbbient.userPicture = result;
                });
            });
        });
    }

    getWorbbyTasksOffersAcceptedByWorbbient(): void {
        this._worbbyTaskService.getWorbbyTasksWithOffersAcceptedByTargetUserId(abp.session.userId).subscribe(result => {
            this.worbbyTasksOffersAccepted = result.items;
            this.worbbyTasksOffersAccepted.forEach(element => {
                this.getPictureByGuid(element.worbbient.userPictureId).then((result) => {
                    element.worbbient.userPicture = result;
                });
            });
        });
    }

    getWorbbyTasksOffersConfirmedByWorbbior(): void {
        this._worbbyTaskService.getWorbbyTasksWithOffersConfirmedByTargetUserId(abp.session.userId).subscribe(result => {
            this.worbbyTasksOffersConfirmed = result.items;
            this.worbbyTasksOffersConfirmed.forEach(element => {
                this.getPictureByGuid(element.worbbient.userPictureId).then((result) => {
                    element.worbbient.userPicture = result;
                });
            });
        });
    }


    offerAcceptClick(worbbyTask: WorbbyTaskDto): void {
        console.log('offerAcceptClick: ' + worbbyTask);
    }

    pendingOfferView(worbbyOffer: WorbbyOfferDto): void {
        this._router.navigate(['/worbbior/worbby-task-offer', worbbyOffer.id]);
        console.log('pendingOfferClick');
    }

    pendingOfferCancel(): void {
        console.log("TODO: Implementar cancelamento de oferta!!");
    }

    viewWorbbyTask(worbbyTask: WorbbyTaskDto): void {
        this._router.navigate(['/worbbior/worbby-task-details', worbbyTask.id]);
        console.log('viewWorbbyTask: ' + worbbyTask);
    }

    acceptWorbbyTaskProposed(worbbyTask: WorbbyTaskDto): void {

        this.saving = true;
        var entityDto: EntityDtoOfInt64 = new EntityDtoOfInt64();
        entityDto.id = worbbyTask.id;

        this._worbbyTaskService.worbbyTaskProposalAcceptedByWorbbior(entityDto)
            .finally(() => {
                this.saving = false;
            })
            .subscribe(() => {
                this.message.custom('', 'Proposta aceita com sucesso!', 'assets/common/images/icon-dove@2x.png').done(() => {
                });

            });
    }

    refusedWorbbyTaskProposed(worbbyTask: WorbbyTaskDto): void {
        this.saving = true;
        var entityDto: EntityDtoOfInt64 = new EntityDtoOfInt64();
        entityDto.id = worbbyTask.id;
        this.message.confirm(
            'Deseja recusar essa proposta?', 'Ops!',
            isConfirmed => {
                if (isConfirmed) {
                    this._worbbyTaskService.worbbyTaskProposalRefusedByWorbbior(new EntityDtoOfInt64(entityDto))
                        .finally(() => {
                            this.saving = false;
                        })
                        .subscribe(() => {
                            this.message.custom('', 'Proposta recusada com sucesso!', 'assets/common/images/icon-dove@2x.png').done(() => {
                            });
                        });
                }
            }
        );

    }

    confirmOfferAccepted(worbbyTask: WorbbyTaskDto): void {
        var entityDto = new EntityDtoOfInt64();
        entityDto.id = worbbyTask.id;
        this._worbbyTaskService.offerConfirmedByWorbbior(entityDto)
            .finally(() => {
                this.saving = false;
            })
            .subscribe(() => {
                this._router.navigate(['/worbbior/worbby-task-details', worbbyTask.id]);
            });
    }

    refusedOfferAccepted(worbbyTask: WorbbyTaskDto): void {
        var entityDto = new EntityDtoOfInt64();
        entityDto.id = worbbyTask.id;
        this.message.confirm(
            'Deseja recusar essa oferta?', 'Ops!',
            isConfirmed => {
                if (isConfirmed) {
                    this._worbbyTaskService.offerCanceledByWorbbior(entityDto)
                        .finally(() => {
                            this.saving = false;
                        })
                        .subscribe(() => {
                            this.getWorbbyTasksOffersAcceptedByWorbbient();
                            this.message.custom('', 'Oferta recusada com sucesso!', 'assets/common/images/icon-dove@2x.png').done(() => {
                            });
                        });
                }
            }
        );
    }
}