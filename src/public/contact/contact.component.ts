import { Component, Injector, AfterViewInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { WorbbiorServiceProxy, EntityDtoOfInt64, ContactEmailDto, EmailingServiceProxy } from '@shared/service-proxies/service-proxies';
import { ContactSubjects, KeyValueItem } from '@shared/AppEnums';
import { AppConsts } from '@shared/AppConsts';
import { Router } from '@angular/router';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { Angulartics2 } from 'angulartics2';

@Component({
    templateUrl: './contact.component.html',
    animations: [appModuleAnimation()]
})
export class ContactComponent extends AppComponentBase implements AfterViewInit {

    public active: boolean = false;
    public saving: boolean = false;
    public contactEmail: ContactEmailDto = new ContactEmailDto();
    public contactSubjects: ContactSubjects = new ContactSubjects();
    public currentcontactSubject: KeyValueItem;

    constructor(
        injector: Injector,
        public _contactEmailService: EmailingServiceProxy,
        private router: Router,
        private _worbbiorService: WorbbiorServiceProxy,
        private _appSessionService: AppSessionService,
        private angulartics2: Angulartics2
    ) {
        super(injector);
    }

    ngAfterViewInit(): void {
        this.active = true;
        this.getContactDefault();
        $("body").scrollTop(0);
    }

    getContactDefault(): void {
        this.currentcontactSubject = this.contactSubjects.items[0];
        this.contactEmail.subject = this.currentcontactSubject.value;
        this.active = true;
    }

    changeContactSubject(item: KeyValueItem): void {
        this.currentcontactSubject = item;
        this.contactEmail.subject = item.value;
    }

    save(): void {
        this.saving = true;
        this.contactEmail.emailNotification = AppConsts.contactEmail;
        this._contactEmailService.sendContactEmail(this.contactEmail)
            .finally(() => { 
                this.saving = false; 
                this.contactEmail = new ContactEmailDto();
                this.getContactDefault();
            })
            .subscribe(() => {
                this.notify.info(this.l('MessageSendSuccessfully'));

                let filters = "SUCESSO";
                this.angulartics2.eventTrack.next({ 
                    action: filters, 
                    properties: { category: 'Enviar contato: Contato', 
                    label: this._appSessionService.user ? "Usuário cadastrado: " + this._appSessionService.user.emailAddress : "Anonimo: " +  this.contactEmail.email } 
                });
            }, (error) => {
                let filters = "FALHA | Erros: " + error.error.details;
                this.angulartics2.eventTrack.next({ 
                    action: filters, 
                    properties: { category: 'Falha no enviar contato: Contato', 
                    label: this._appSessionService.user ? "Usuário cadastrado: " + this._appSessionService.user.emailAddress : "Anonimo: " +  this.contactEmail.email } 
                });
            });
    }

    becomeWorbbior():void{
        if(abp.session.userId){
            if(!this.permission.isGranted("Pages.Worbbior.SwitchToWorbbientProfile")){
                this.worbbientToWorbbior();
            }else{
                this.router.navigate(['/worbbior/edit-profile']);
            }
        }else{
            this.router.navigate(['/registrar/Worbbior']);
        }
    }

    worbbientToWorbbior():void {
        this.message.confirm(
            "Deseja tornar-se também um worbbior?", "Seja um worbbior!",
            isConfirmed => {
                if (isConfirmed) {
                    
                    this._worbbiorService.worbbientToWorbbior(new EntityDtoOfInt64({ id: abp.session.userId }))
                    .finally(() => {
                    })
                    .subscribe(() => {
                        this.message.custom('Precisamos de mais algumas informações sobre você, preencha os dados na próxima página para ganhar dinheiro oferecendo suas habilidades. Mas atenção, só após completar todos os campos, o seu perfil Worbbior será ativado na plataforma.', 'Falta pouco para você ser um worbbior!', 'assets/common/images/default-profile-picture.png').done(() => {
                            this._appSessionService.userRoleName = "Worbbior";
                            location.href = "/";
                        });
                    });;
                }
            }
        );        
    }
    
}