import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { EndorsementServiceProxy, EndorsementDto, ActivityEndorsementForCreateUpdate, ListResultDtoOfActivityEndorsementDto} from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { DayOfWeek } from '@shared/AppEnums';
import { Angulartics2 } from 'angulartics2';

import * as _ from "lodash";

@Component({
    selector: 'sendEndorsementModal',
    templateUrl: './send-endorsement-modal.component.html',
    styles: [
        `.user-edit-dialog-profile-image {
             margin-bottom: 20px;
        }`
    ]
})
export class SendEndorsementModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal') modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active: boolean = false;
    saving: boolean = false;
    activityEndorsementForCreateUpdate: ActivityEndorsementForCreateUpdate

    constructor(
        injector: Injector,
        private _endorsementService: EndorsementServiceProxy,
        private _appSessionService: AppSessionService,
        private angulartics2: Angulartics2
    ) {
        super(injector);
    }

    show(activityEndorsementForCreateUpdate: ActivityEndorsementForCreateUpdate): void {
        this.activityEndorsementForCreateUpdate = activityEndorsementForCreateUpdate;
        this.active = true;
        this.modal.show();
    }


    onShown(): void {
    }
   
    save(): void {  

        let labelText = "Usuário cadastrado: " + this._appSessionService.user.emailAddress + ", E-mail do recomendador: " + this.activityEndorsementForCreateUpdate.endorsementDto.email;

        if(this.activityEndorsementForCreateUpdate.endorsementDto.email == this._appSessionService.user.emailAddress){
            this.message.error('Você não pode utilizar seu próprio e-mail para solicitar uma recomendação!', 'Solicitação de Recomendação!').done(() => {});

            this.angulartics2.eventTrack.next({ 
                action: "FALHA | Erros: Usar seu próprio email para solicitar uma recomendação", 
                properties: { category: 'Falha ao tentar enviar recomendação: Editar Perfil - Endosso/Recomendação', 
                label: labelText } 
            });
        }
        else {
            this.saving = true;
            this._endorsementService.createOrUpdateEndorsament(this.activityEndorsementForCreateUpdate)
                .finally(() => { this.saving = false; })
                .subscribe((result: ActivityEndorsementForCreateUpdate) => {  
                    this.notify.info(this.l('SendEndorsementSuccessfully'));
                    this.close();
                    this.modalSave.emit(null);

                    this.angulartics2.eventTrack.next({ 
                        action: "SUCESSO", 
                        properties: { category: 'Enviar recomendação: Editar Perfil - Endosso/Recomendação', 
                        label: labelText} 
                    });
                }, (error) => {
                    let filters = "FALHA | Erros: " + error.error.details;
                    this.angulartics2.eventTrack.next({ 
                        action: filters, 
                        properties: { category: 'Falha ao tentar enviar recomendação: Editar Perfil - Endosso/Recomendação', 
                        label: labelText } 
                    });
                }
            );
        }        
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}

