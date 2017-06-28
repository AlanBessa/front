import { Component, ViewChild, Injector } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import * as _ from 'lodash';
import { AppSessionService } from "shared/common/session/app-session.service";

@Component({
    selector: 'infoTutorialCadastroModal',
    templateUrl: './info-tutorial-cadastro-modal.component.html',
    styles: [
        `.user-edit-dialog-profile-image {
             margin-bottom: 20px;
        }`
    ]
})

export class InfoTutorialCadastroModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal') modal: ModalDirective;

    active: boolean = false;

    constructor(
        injector: Injector,
        private _appSessionService: AppSessionService
    ) {
        super(injector);
    }

    show(): void {
        this.active = true;
        this.modal.show();
    }

    onShown(): void {
    }

    close(): void {
        this.active = false;
        this._appSessionService.firstLoginUser = "false";
        this.modal.hide();
    }
}