import { Component, Injector, AfterViewInit, ViewChild, Inject } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppConsts } from '@shared/AppConsts';
import { FileUploader, FileUploaderOptions, Headers } from '@node_modules/ng2-file-upload';
import { ProfileServiceProxy, CurrentUserProfileEditDto, DefaultTimezoneScope, UserLoginInfoDto, AddressDto, AddressServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { AppTimezoneScope } from '@shared/AppEnums';
import { ChangeProfilePictureModalComponent } from '@app/shared/layout/profile/change-profile-picture-modal.component';
import { Countries, DayOfWeek, AdministrativeAreas, KeyValueItem, KeyValueAddress, WorbbiorState } from '@shared/AppEnums';

@Component({
    templateUrl: './my-address.component.html',
    selector: 'myAddressWorbbient',
    animations: [appModuleAnimation()]
})
export class MyAddressWorbbientComponent extends AppComponentBase implements AfterViewInit {

    public active: boolean = false;
    public saving: boolean = false;
    public currentCountry: KeyValueItem;
    public address: AddressDto = new AddressDto();
    public currentAdministrativeArea: KeyValueAddress;
    public administrativeAreas: AdministrativeAreas = new AdministrativeAreas();
    public AppConsts: typeof AppConsts = AppConsts;

    constructor(
        injector: Injector,
       private _addressService: AddressServiceProxy

    ) {
        super(injector);
    }

    ngAfterViewInit(): void {
    }

    ngOnInit() {
        this.administrativeAreas.items = this.administrativeAreas.items.filter(x => x.id == "RJ");
        this.getAddresDefault();
    }

    save(showNotify: boolean = true, callback: () => void): void {
        this.saving = true;
        this.address.country = "BR" ;
        this._addressService.createOrUpdateDisableValidation(this.address)
                .finally(() => {
                    callback();
                })
                .subscribe(() => {

                });
    }


    getAddresDefault(): void {
        this._addressService.getAddressDefaultByUserId(abp.session.userId).subscribe((result: AddressDto) => {
            this.address = result;

            if (this.address.administrativeArea) {
                this.currentAdministrativeArea = this.administrativeAreas.items.filter(x => x.id == this.address.administrativeArea)[0];
            } else {
                this.currentAdministrativeArea = this.administrativeAreas.items[0];
            }

            this.address.administrativeArea = this.currentAdministrativeArea.id;
            this.active = true;
            //this.getWorbbior();
        });
    }


    changeAdministativeArea(item: KeyValueAddress): void {
        this.currentAdministrativeArea = item;
        this.address.administrativeArea = item.id;
    }

}