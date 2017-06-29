import { Component, Injector, OnInit, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EndorsementDto, TokenAuthServiceProxy, AuthenticateModel, AuthenticateResultModel, AccountServiceProxy, RegisterInput, PasswordComplexitySetting, ProfileServiceProxy } from '@shared/service-proxies/service-proxies'
import { AppComponentBase } from '@shared/common/app-component-base';
import { LoginService, ExternalLoginProvider } from '../login/login.service';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AbpSessionService } from '@abp/session/abp-session.service';
import { AppConsts } from '@shared/AppConsts';
import { AdministrativeAreas, KeyValueAddress } from '@shared/AppEnums';
import { Angulartics2 } from 'angulartics2';
import { RequestWorbbiorRegisterCodeModalComponent } from './request-worbbior-register-code-modal.component';

import {SelectModule} from 'ng2-select';

@Component({
    selector: 'registerComponent',
    templateUrl: './register.component.html',
    animations: [accountModuleAnimation()]
})
export class RegisterComponent extends AppComponentBase implements OnInit {

    @Input('roleName') roleName:string = "Worbbient";
    @Input('endorse') endorse:boolean = false;
    @Input('administrativeArea') administrativeArea:string = "RJ";
    @Input('endorsement') endorsement:EndorsementDto;
    @Input('endorsementUserId') endorsementUserId:number;

    @ViewChild('requestWorbbiorRegisterCodeModal') requestWorbbiorRegisterCodeModal: RequestWorbbiorRegisterCodeModalComponent;

    model: RegisterInput = new RegisterInput();
    passwordComplexitySetting: PasswordComplexitySetting = new PasswordComplexitySetting();

    saving: boolean = false;

    public administrativeAreas: AdministrativeAreas = new AdministrativeAreas();
    public currentAdministrativeArea: Array<KeyValueAddress> = [];
    public acceptTerm:boolean = false;

    constructor(
        injector: Injector,
        private _accountService: AccountServiceProxy,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        public loginService: LoginService,
        private _profileService: ProfileServiceProxy,
        private _sessionService: AbpSessionService,
        private angulartics2: Angulartics2
    ) {
        super(injector);
        
    }

    ngOnInit() {
        this.currentAdministrativeArea.push(this.administrativeAreas.items.find(x => x.id == "RJ"));
        this._profileService.getPasswordComplexitySetting().subscribe(result => {
            this.passwordComplexitySetting = result.setting;
        });

        if(this.endorsement){
            this.model.emailAddress = this.endorsement.email;
        }
    }

    ngAfterViewInit(): void {
        $("body").scrollTop(0);
    }

    get useCaptcha(): boolean {
        return this.setting.getBoolean('App.UserManagement.UseCaptchaOnRegistration');
    }

    back(): void {
        this._router.navigate(['/login']);
    }

    save(): void {
        if (this.useCaptcha && !this.model.captchaResponse) {
            this.message.warn(this.l('CaptchaCanNotBeEmpty'));
            return;
        }

        if(!this.acceptTerm){
            this.angulartics2.eventTrack.next({ action: this.roleName + " - " + this.currentAdministrativeArea[0].text, properties: { category: 'Tentativa de Cadastro', label: this.model.emailAddress }});
            this.message.warn('Para realizar o cadastro é necessário ler e aceitar os termos de uso do Worbby.', 'Termos de uso do Worbby').done(() => {
                
            });
            return;
        }

        if(this.currentAdministrativeArea[0].id != "RJ"){
            this.angulartics2.eventTrack.next({ action: this.roleName + " - " + this.currentAdministrativeArea[0].text, properties: { category: 'Tentativa de Cadastro', label: this.model.emailAddress }});
            this.message.warn('Estamos atuando, no momento, apenas no RJ. Você será avisado quando a Worbby for lançada em seu estado.', 'O cadastro para o estado ' + this.currentAdministrativeArea[0].text + ' não está disponível').done(() => {
                
            });
        }else{
            this.saving = true;
            this.model.userName = this.model.emailAddress;
            this.model.roleName = this.roleName;
            this.model.endorsementId = this.endorsement ? this.endorsement.id : undefined;
            this.model.endorsementUserId = this.endorsementUserId;
            this.model.administrativeArea = this.currentAdministrativeArea[0].id;
            this._accountService.register(this.model)
                .finally(() => { this.saving = false; })
                .subscribe((result) => {
                    this.angulartics2.eventTrack.next({ action: this.roleName + " - " + this.currentAdministrativeArea[0].text, properties: { category: 'Cadastro', label: this.model.emailAddress }});
                    if (!result.canLogin) {
                        if(result.isEmailConfirmationRequiredSend){
                            this.message.success('Cadastro realizado com sucesso! Abra o e-mail que acabamos de enviar para você (cheque se ele não está na sua caixa de spam) e clique no botão “Confirmar e-mail”. Se você não receber esse e-mail em alguns minutos, clique no link "Ativação de e-mail" na área de cadastro do site Worbby.', 'Ativar e-mail').done(() => {
                                this._router.navigate(['/login']);
                            });
                        }else{
                            this.notify.success(this.l('SuccessfullyRegistered'));
                            this._router.navigate(['/login']);
                        }
                        
                        return;
                    }

                    //Autheticate
                    this.saving = true;
                    this.loginService.authenticateModel.userNameOrEmailAddress = this.model.userName;
                    this.loginService.authenticateModel.password = this.model.password;
                    this.loginService.authenticate(() => { this.saving = false; });
                });
        }
    }

    captchaResolved(captchaResponse: string): void {
        this.model.captchaResponse = captchaResponse; 
    }

    externalRegister(provider: ExternalLoginProvider) {
        let self = this;
        self.saving = true;
        if(!this.acceptTerm){
            this.message.warn('Para realizar o cadastro é necessário ler e aceitar os termos de uso do Worbby.', 'Termos de uso do Worbby').done(() => {
                
            });
            self.saving = false;

            let filters = "FALHA | Erros: Não aceitou os termos de uso";
            this.angulartics2.eventTrack.next({ 
                action: filters, 
                properties: { category: 'Registro: Botão Social', 
                label: provider.name } 
            });
        }else{
            this.loginService.externalAuthenticate(provider, this.roleName, this.administrativeArea, this.model.worbbiorRegisterCode, () => { 
                self.saving = false; 
            });
        }            
    }

    get multiTenancySideIsTeanant(): boolean {
        return this._sessionService.tenantId > 0;
    }

    public selected(value:any):void {
        this.currentAdministrativeArea = [];
        this.currentAdministrativeArea.push(value);
        this.administrativeArea = this.currentAdministrativeArea[0].id;
    }    

    public removed(value:any):void {
        this.currentAdministrativeArea = [];
        this.administrativeArea = '';
    }    


    getWorbbiorRegisterCode():void{
        this.requestWorbbiorRegisterCodeModal.show();
    }
}