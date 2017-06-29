import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import * as _ from "lodash";
import { Observable, Subscription } from 'rxjs/Rx';

@Component({
    selector: 'homeReleaseModal',
    templateUrl: './home-release-modal.component.html',
    styles: [
        `.user-edit-dialog-profile-image {
             margin-bottom: 20px;
        }`
    ]
})
export class HomeReleaseModalComponent extends AppComponentBase {

    @ViewChild('homeReleaseModal') modal: ModalDirective;

    active: boolean = false;
    sending: boolean = false;

    public future: Date = new Date("2017-07-10T00:00:00.000Z");
    public futureString: string;
    public diff: number;
    public $counter: Observable<number>;
    public subscription: Subscription;
    public dateText: string;

    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    ngOnInit() {
        this.$counter = Observable.interval(1000).map((x) => {
            this.diff = Math.floor((this.future.getTime() - new Date().getTime()) / 1000);
            return x;
        });

        this.subscription = this.$counter.subscribe((x) => this.dateText = this.dhms(this.diff));        
    }
    

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    show(): void {
        this.active = true;
        this.modal.show();
    }


    onShown(): void {
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }

    dhms(t) {
        var days, hours, minutes, seconds;
        days = Math.floor(t / 86400);
        t -= days * 86400;
        hours = Math.floor(t / 3600) % 24;
        t -= hours * 3600;
        minutes = Math.floor(t / 60) % 60;
        t -= minutes * 60;
        seconds = t % 60;

        return [
            days + 'd',
            hours + 'h',
            minutes + 'm',
            seconds + 's'
        ].join(' ');
    }
}

