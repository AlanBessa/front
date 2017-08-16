import { Directive, Input, OnInit, Injector } from '@angular/core';
import { GoogleMapsAPIWrapper } from '@agm/core';
import { Observable } from 'rxjs';
import { AppComponentBase } from "shared/common/app-component-base";

declare const google;
declare const MarkerClusterer;

@Directive({
    selector: 'marker-cluster'
})

export class MarkerClusterDirective extends AppComponentBase implements OnInit {
    @Input() public iconMarker: string;
    @Input() public iconCluster: string;

    _points: any[];
    get points(): any[] {
        return this._points;
    }
    
    @Input('points')
    set points(value: any[]) {
        this._points = value;
        this.markers = [];
        this.displayMarksInMap();
    }

    public markerCluster: any;
    public markers: any[] = [];

    constructor(
        injector: Injector,
        private gmapsApi: GoogleMapsAPIWrapper
    ) 
    { 
        super(injector);
    }

    public ngOnInit() {
    }

    public displayMarksInMap() {
        this.gmapsApi.getNativeMap().then((map) => {
            const markerIcon = {
                url: this.iconMarker, // url
                scaledSize: new google.maps.Size(60, 60)
            };          

            const options = {
                imagePath: this.iconCluster,
                gridSize: 50,
                zoomOnClick: true
            };

            Observable
                .interval(500)
                .skipWhile((s) => this._points == null || this._points.length <= 0)
                .take(1)
                .subscribe(() => {
                    if (this.markerCluster) {
                        this.markerCluster.clearMarkers();
                    }
                    if (this._points.length > 0) {
                        for (const point of this._points) {
                            const marker = new google.maps.Marker({
                                position: new google.maps.LatLng(point.profile.address.latitude, point.profile.address.longitude),
                                icon: markerIcon
                            });

                            let contentString = '<div id="info-window"><div class="box-map"><div class="text-center">' +
                                                  '<img alt="Photo Profile" class="img-circle img-profile" src="' + point.profile.userPicture + '" />' +
                                                  '</div><h6 class="cor-Tangerine">' + point.profile.displayName + '</h6><ul class="activityList">';

                            point.userActivitiesList.forEach(element => {
                                contentString += '<li>' +
                                                    '<a href="' + "/publico/atividade/" + element.id + "-" + this.changeSpecialCharacterToNormalCharacter(element.title.replace(/\s+/g, '-').toLowerCase()) + '">' + element.title + '</a>' +
                                                 '</li>';
                            });

                            contentString += '</ul></div></div>';

                            const infowindow = new google.maps.InfoWindow({
                                content: contentString
                            });

                            marker.addListener('click', function () {
                                if (infowindow) { infowindow.close(); }
                                infowindow.open(map, marker); 
                            });

                            this.markers.push(marker);
                        }
                    } else {
                        this.markers = [];
                    }
                    this.markerCluster = new MarkerClusterer(map, this.markers, options);
                });
        });
    }
}

interface style {
    url: string,
    height: number,
    width: number,
    textColor: string,
    textSize: number,
    backgroundPosition: string
}