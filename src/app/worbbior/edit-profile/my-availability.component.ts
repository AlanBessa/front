import { Component, Injector, AfterViewInit, ViewChild, OnInit, Input } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { WorbbiorForEditDto, WorbbiorServiceProxy, AvailabilityServiceProxy, AvailabilityDto, ListResultDtoOfAvailabilityDto, AddressDto, AddressServiceProxy } from '@shared/service-proxies/service-proxies';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { CreateOrEditAvailabilityModalComponent } from './create-or-edit-availability-modal.component';
import { Countries, DayOfWeek, AdministrativeAreas, KeyValueItem, KeyValueAddress, WorbbiorState } from '@shared/AppEnums';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { AppConsts } from '@shared/AppConsts';
import { MapsAPILoader, GoogleMapsAPIWrapper } from '@agm/core';
import * as _ from 'lodash';

declare var google: any;

@Component({
    templateUrl: './my-availability.component.html',
    animations: [appModuleAnimation()],
    selector: 'editMyAvailabilityWorbbior',
    providers: [GoogleMapsAPIWrapper]
})
export class MyAvailabilityWorbbiorComponent extends AppComponentBase implements AfterViewInit {

    @ViewChild('createOrEditAvailabilityModal') createOrEditAvailabilityModal: CreateOrEditAvailabilityModalComponent;

    public AppConsts: typeof AppConsts = AppConsts;
    public active: boolean = false;
    public saving: boolean = false;
    public worbbiorState: WorbbiorState;

    public myAvailabilities: AvailabilityDto[];
    public address: AddressDto;
    public worbbior: WorbbiorForEditDto;

    public DayOfWeek: typeof DayOfWeek = DayOfWeek;
    public WorbbiorState: typeof WorbbiorState = WorbbiorState;

    public administrativeAreas: AdministrativeAreas = new AdministrativeAreas();
    public currentAdministrativeArea: KeyValueAddress;

    public mapActive = false;
    public abaActive = false;
    public lat: number = -22.906323;
    public lng: number = -43.177599;
    public map: any;

    public tooltipRaio: string = "O que é raio de atuação?<br /> É o diâmetro de distância em Km a partir do endereço cadastrado. Por exemplo: se  você quiser realizar tarefas somente próximas ao seu bairro, coloque um número em Km bem baixo. Para visualizar melhor o mapa, use os sinais de + e -. Você pode movimentar o raio em vermelho com o mouse pressionado sobre o mapa.";

    constructor(
        injector: Injector,
        private _availabilityService: AvailabilityServiceProxy,
        private _addressService: AddressServiceProxy,
        private _appSessionService: AppSessionService,
        private _worbbiorService: WorbbiorServiceProxy,
        private _mapLoader: MapsAPILoader,
        private _mapWrapper: GoogleMapsAPIWrapper
    ) {
        super(injector);
    }

    showOnMap(): void {
        var completeAddress = this.address.thoroughfare + ", " + this.address.thoroughfareNumber + " - " + this.address.subLocality + " - " + this.address.locality + " - " + this.address.administrativeArea + " - " + this.address.country;
        var self = this;
        this._mapLoader.load().then(() => {
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({ 'address': completeAddress }, function (results, status) {
                if (results[0] != undefined) {
                    self.address.latitude = results[0].geometry.location.lat();
                    self.address.longitude = results[0].geometry.location.lng();
                }
            });
        });
    }

    updateGeolocalization(event): void {
        this.address.latitude = event.coords.lat;
        this.address.longitude = event.coords.lng;
    }

    updateRadius(r: number): void {
        this.worbbior.radius = Math.round(r / 1000);
    }


    ngOnInit(): void {
        this.administrativeAreas.items = this.administrativeAreas.items.filter(x => x.id == "RJ");
        this.worbbiorState = this._appSessionService.worbbiorState;
        this.getMyAvailabilities();
    }

    ngAfterViewInit(): void {
    }

    updateWorbbiorState(): void {
        this.worbbiorState = this._appSessionService.worbbiorState;
    }


    getMyAvailabilities(): void {
        this._availabilityService.getAvailabilitiesByUserId(abp.session.userId).subscribe((result: ListResultDtoOfAvailabilityDto) => {
            this.myAvailabilities = result.items;
            this.getAddresDefault();
        });
    }

    addAvailability(): void {
        this.createOrEditAvailabilityModal.show(new AvailabilityDto());
    }

    updateavAilability(availability: AvailabilityDto): void {
        this.createOrEditAvailabilityModal.show(new AvailabilityDto(availability));
    }

    removeAvailability(availability: AvailabilityDto): void {
        this.message.confirm(
            'Você tem certeza que deseja excluir?',
            isConfirmed => {
                if (isConfirmed) {
                    this._availabilityService.removeAvailability(availability.id).subscribe(() => {
                        this.notify.info(this.l('SuccessfullyRemoved'));
                        _.remove(this.myAvailabilities, availability);
                    });
                }
            }
        );
    }

    getAddresDefault(): void {
        this._addressService.getAddressDefaultByUserId(abp.session.userId).subscribe((result: AddressDto) => {
            this.address = result;

            if (this.address.administrativeArea) {
                this.currentAdministrativeArea = this.administrativeAreas.items.filter(x => x.id == this.address.administrativeArea)[0];
            } else {
                this.currentAdministrativeArea = this.administrativeAreas.items[0];
            }

            if (!this.address.latitude) {
                this.address.latitude = this.lat.toString();
                this.address.longitude = this.lng.toString();
            }

            this.address.administrativeArea = this.currentAdministrativeArea.id;
            this.mapActive = true;
            this.getWorbbior();
            this.showOnMap();
        });
    }

    getWorbbior(): void {
        this._worbbiorService.getWorbbiorForEdit()
            .subscribe((result: WorbbiorForEditDto) => {
                this.worbbior = result;
                this.worbbior.saveRadius = true;
                this.active = true;
            });
    }

    createOrUpdateAddress(showNotify: boolean = true, callback: () => void): void {
        this.saving = true;
        this.address.country = "BR";
        if (this.worbbior.worbbiorState == Number(this.WorbbiorState.Active)) {

            this._addressService.createOrUpdate(this.address)
                .finally(() => {
                    this.updateWorbbiorActiveRadius(showNotify);

                })
                .subscribe(() => {
                    callback();
                });

        } else if (this.worbbior.worbbiorState == Number(this.WorbbiorState.PreRegistration) 
                   || this.worbbior.worbbiorState == Number(this.WorbbiorState.WaitingEdit)) {

            this._addressService.createOrUpdateDisableValidation(this.address)
                .finally(() => {
                    this.updateWorbbiorInactiveRadius(showNotify);

                })
                .subscribe(() => {
                    callback();
                });
        }

    }

    updateWorbbiorActiveRadius(showNotify: boolean = true): void {

        this._worbbiorService.updateCurrentWorbbior(this.worbbior)
            .finally(() => {
                this.saving = false;
            })
            .subscribe(() => {
                if (showNotify) {
                    this.notify.info(this.l('SavedSuccessfully'));
                }
            });
    }

    updateWorbbiorInactiveRadius(showNotify: boolean = true): void {
        this._worbbiorService.updateCurrentWorbbiorDisableValidation(this.worbbior)
            .finally(() => {
                this.saving = false;
            })
            .subscribe(() => {
                if (showNotify) {
                    this.notify.info(this.l('SavedSuccessfully'));
                }
            });
    }
    changeAdministativeArea(item: KeyValueAddress): void {
        this.currentAdministrativeArea = item;
        this.address.administrativeArea = item.id;
    }
}


