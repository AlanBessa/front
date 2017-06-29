import { Component, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ContactEmailDto, EmailingServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppConsts } from '@shared/AppConsts';
import { Angulartics2 } from 'angulartics2';
import { AppSessionService } from "shared/common/session/app-session.service";

@Component({
    selector: 'feedbackComponent',
    templateUrl: './feedback.component.html'
})
export class FeedbackComponent extends AppComponentBase {

    feedbackAberto: boolean = false;
    public saving: boolean = false;
    public contactEmail: ContactEmailDto = new ContactEmailDto();

    constructor(
        injector: Injector,
        public _contactEmailService: EmailingServiceProxy,
        private _appSessionService: AppSessionService,
        private angulartics2: Angulartics2
    ) {
        super(injector);        
    }

    toogleForm(estaAberto: boolean) {
        this.feedbackAberto = !estaAberto;
    }

    save(): void {
        this.saving = true;
        this.contactEmail.subject = "Feedback Beta";
        this.contactEmail.name = this.contactEmail.email;
        this.contactEmail.emailNotification = AppConsts.contactEmail;
        this._contactEmailService.sendContactEmail(this.contactEmail)
            .finally(() => { 
                this.saving = false; 
                this.contactEmail = new ContactEmailDto();                
            })
            .subscribe(() => {
                this.notify.info(this.l('MessageSendSuccessfully'));
                this.toogleForm(true);

                let filters = "SUCESSO";
                this.angulartics2.eventTrack.next({ 
                    action: filters, 
                    properties: { category: 'Enviar feedback: Feedback', 
                    label: this._appSessionService.user ? "Usuário cadastrado: " + this._appSessionService.user.emailAddress : "Anonimo: " +  this.contactEmail.email } 
                });
            }, (error) => {
                let filters = "FALHA | Erros: " + error.error.details;
                this.angulartics2.eventTrack.next({ 
                    action: filters, 
                    properties: { category: 'Falha no enviar feedback: Feedback', 
                    label: this._appSessionService.user ? "Usuário cadastrado: " + this._appSessionService.user.emailAddress : "Anonimo: " +  this.contactEmail.email } 
                });
            });
    }
}