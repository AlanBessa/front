import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AvailabilityServiceProxy, AvailabilityDto, AvailabilityDtoDayOfWeek } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { DayOfWeek, WorbbiorState } from '@shared/AppEnums';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { Angulartics2 } from 'angulartics2';

import * as _ from "lodash";

@Component({
    selector: 'createOrEditAvailabilityModal',
    templateUrl: './create-or-edit-availability-modal.component.html',
    styles: [
        `.user-edit-dialog-profile-image {
             margin-bottom: 20px;
        }`
    ]
})
export class CreateOrEditAvailabilityModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal') modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active: boolean = false;
    saving: boolean = false;
    availability: AvailabilityDto;
    dayOfWeekOptions: string[];
    DayOfWeek: typeof DayOfWeek = DayOfWeek;
    currentDayOfWeekOptions: string = "";
    public WorbbiorState: typeof WorbbiorState = WorbbiorState;
    public worbbiorState: WorbbiorState;

    constructor(
        injector: Injector,
        private _availabilityService: AvailabilityServiceProxy,
        private _appSessionService: AppSessionService,
        private angulartics2: Angulartics2
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.worbbiorState = this._appSessionService.worbbiorState;
    }

    show(availability: AvailabilityDto): void {
        this.availability = availability;
        this.active = true;
        this.modal.show();
        var dayOfWeekOptions = Object.keys(DayOfWeek);
        this.dayOfWeekOptions = dayOfWeekOptions.slice(dayOfWeekOptions.length / 2);

        if (availability.dayOfWeek) {
            this.currentDayOfWeekOptions = this.l(DayOfWeek[availability.dayOfWeek]);
        } else {
            this.currentDayOfWeekOptions = this.l(this.dayOfWeekOptions[DayOfWeek.Sunday]);
            this.availability.dayOfWeek = Number(DayOfWeek.Sunday);
        }
    }

    onShown(): void {
    }

    changeDayOfWeek(item: string): void {
        this.currentDayOfWeekOptions = this.l(item);
        this.availability.dayOfWeek = DayOfWeek[item];
    }

    save(): void {
        this.saving = true;
        this.availability.userId = abp.session.userId;

        this._availabilityService.createAvailability(this.availability)
            .finally(() => { this.saving = false; })
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);

                this.angulartics2.eventTrack.next({ 
                    action: "SUCESSO", 
                    properties: { category: 'Cadastro de disponibilidade', 
                    label: this._appSessionService.user.emailAddress} 
                });
            }, (error) => {
                let filters = "FALHA";
                this.angulartics2.eventTrack.next({ 
                    action: filters, 
                    properties: { category: 'Cadastro de disponibilidade', 
                    label: this._appSessionService.user.emailAddress + " | Erros: " + error.error.details  } 
                });
            });
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}

