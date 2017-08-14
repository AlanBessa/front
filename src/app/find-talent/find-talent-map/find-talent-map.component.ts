import { Component, OnInit, Input, Injector } from '@angular/core';
import { WorbbiorActivityDto, AddressServiceProxy, AddressDto } from "shared/service-proxies/service-proxies";
import { AppComponentBase } from "shared/common/app-component-base";
import { GoogleMapsAPIWrapper, MapsAPILoader } from "@agm/core";
import { Router } from "@angular/router";

@Component({
  selector: 'find-talent-map-component',
  templateUrl: './find-talent-map.component.html',
  styleUrls: ['./find-talent-map.component.css'],
  providers: [GoogleMapsAPIWrapper]
})
export class FindTalentMapComponent extends AppComponentBase implements OnInit {

  @Input('activities') worbbiorActivities: WorbbiorActivityDto[];

  public blackAndWhiteStyle: any = '';

  public worbbior: worbbior;

  public worbbiorList: worbbior[] = [];

  public userLoginAddressCoord: any = {
    lat: -22.249802,
    lon: -44.7939593
  };

  constructor(
    injector: Injector,
    private router: Router,
    private _mapLoader: MapsAPILoader,
    private _addressService: AddressServiceProxy
  ) {
    super(injector);
  }

  ngOnInit() {
    this.applyStyleMap();
    this.getAddresDefault();
    this.organizeListWorbbiorActivities();
  }

  public organizeListWorbbiorActivities(): void {
    this.worbbiorActivities.sort(function (obj1, obj2) {
      if (obj1.worbbior.userId < obj2.worbbior.userId) {
        return -1;
      }
      else if (obj1.worbbior.userId > obj2.worbbior.userId) {
        return 1;
      }
      else {
        return 0;
      }
    });

    let userIdController = 0;

    for (let i = 0; i < this.worbbiorActivities.length; i++) {
      if (this.worbbiorActivities[i].worbbior.userId != userIdController) {

        if (i != 0) this.worbbiorList.push(this.worbbior);

        this.worbbior = <worbbior>{};
        this.worbbior.profile = this.worbbiorActivities[i].worbbior;

        this.worbbior.userActivitiesList = [];
        this.worbbior.userActivitiesList.push(this.worbbiorActivities[i].userActivity);

        userIdController = this.worbbiorActivities[i].worbbior.userId;
      }
      else {
        this.worbbior.userActivitiesList.push(this.worbbiorActivities[i].userActivity);
      }

      if (i == this.worbbiorActivities.length - 1) this.worbbiorList.push(this.worbbior);
    }
  }

  public getAddresDefault(): void {
    this._addressService.getAddressDefaultByUserId(abp.session.userId).subscribe((result: AddressDto) => {
      if (result != undefined) {
        this.userLoginAddressCoord.lat = this.toNumber(result.latitude);
        this.userLoginAddressCoord.lon = this.toNumber(result.longitude);
      }
    });
  }

  public applyStyleMap(): void {
    this.blackAndWhiteStyle = [
      { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
      { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f5' }] },
      { elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
      { elementType: 'labels.icon', stylers: [{ visibility: "off" }] },
      { featureType: 'administrative.land_parcel', elementType: 'labels.text.fill', stylers: [{ color: '#bdbdbd' }] },
      { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#eeeeee' }] },
      { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
      { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#E5E5E5' }] },
      { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#E5E5E5' }] },
      { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
      { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#FFFFFF' }] },
      { featureType: 'road.arterial', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
      { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#dadada' }] },
      { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
      { featureType: 'road.local', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
      { featureType: 'transit.line', elementType: 'geometry', stylers: [{ color: '#e5e5e5' }] },
      { featureType: 'transit.station', elementType: 'geometry', stylers: [{ color: '#eeeeee' }] },
      { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9c9c9' }] },
      { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] }
    ];
  }

  goToActivityPage(userActivityId: number, userActivityName: string): void {
    let url = userActivityId + "-" + this.changeSpecialCharacterToNormalCharacter(userActivityName.replace(/\s+/g, '-').toLowerCase());
    this.router.navigate(["/publico/atividade/", url]);
  }
}

interface worbbior {
  profile: any,
  userActivitiesList: any[]
}
