import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TokenAuthServiceProxy, AuthenticateModel, AuthenticateResultModel, ExternalLoginProviderInfoModel, ExternalAuthenticateModel, ExternalAuthenticateResultModel } from '@shared/service-proxies/service-proxies';
import { UrlHelper } from '@shared/helpers/UrlHelper';
import { AppConsts } from '@shared/AppConsts';

import { MessageService } from '@abp/message/message.service';
import { LogService } from '@abp/log/log.service';
import { TokenService } from '@abp/auth/token.service';
import { UtilsService } from '@abp/utils/utils.service';
import { Angulartics2 } from 'angulartics2';

import * as _ from 'lodash';
declare const FB: any; //Facebook API
declare const gapi: any; //Facebook API
declare const WL: any; //Microsoft API

export class ExternalLoginProvider extends ExternalLoginProviderInfoModel {

    static readonly FACEBOOK: string = 'Facebook';
    static readonly GOOGLE: string = 'Google';
    static readonly MICROSOFT: string = 'Microsoft';

    icon: string;
    initialized = false;

    constructor(providerInfo: ExternalLoginProviderInfoModel,) {
        super();

        this.name = providerInfo.name;
        this.clientId = providerInfo.clientId;
        this.icon = ExternalLoginProvider.getSocialIcon(this.name);
    }

    private static getSocialIcon(providerName: string): string {
        providerName = providerName.toLowerCase();

        if (providerName === 'google') {
            providerName = 'googleplus';
        }

        return providerName;
    }
}

@Injectable()
export class LoginService {

    static readonly twoFactorRememberClientTokenName = 'TwoFactorRememberClientToken';

    authenticateModel: AuthenticateModel;
    authenticateResult: AuthenticateResultModel;

    externalLoginProviders: ExternalLoginProvider[] = [];

    rememberMe: boolean;
    roleName:string;
    administrativeArea: string;
    worbbiorRegisterCode:string;

    constructor(
        private _tokenAuthService: TokenAuthServiceProxy,
        private _router: Router,
        private _utilsService: UtilsService,
        private _messageService: MessageService,
        private _tokenService: TokenService,
        private _logService: LogService,
        private angulartics2: Angulartics2
    ) {
        this.clear();
    }

    authenticate(finallyCallback?: () => void, redirectUrl?: string): void {
        finallyCallback = finallyCallback || (() => { });

        //We may switch to localStorage instead of cookies
        this.authenticateModel.twoFactorRememberClientToken = this._utilsService.getCookieValue(LoginService.twoFactorRememberClientTokenName);
        this.authenticateModel.singleSignIn = UrlHelper.getSingleSignIn();
        this.authenticateModel.returnUrl = UrlHelper.getReturnUrl();

        this._tokenAuthService
            .authenticate(this.authenticateModel)
            .finally(finallyCallback)
            .subscribe((result: AuthenticateResultModel) => {
                this.processAuthenticateResult(result, redirectUrl);
            });
    }

    externalAuthenticate(provider: ExternalLoginProvider, roleName: string, administrativeArea: string, worbbiorRegisterCode: string,finallyCallback?: () => void): void {
        finallyCallback = finallyCallback || (() => { });


        let self = this;
        self.roleName = roleName;
        self.administrativeArea = administrativeArea;
        self.worbbiorRegisterCode = worbbiorRegisterCode;
        //this.ensureExternalLoginProviderInitialized(provider, () => {
            if (provider.name === ExternalLoginProvider.FACEBOOK) {
                FB.login(response => {
                    self.facebookLoginStatusChangeCallback(self, response, finallyCallback);
                },{scope: 'email'});
                
            } else if (provider.name === ExternalLoginProvider.GOOGLE) {
                gapi.auth2.getAuthInstance().signIn()
                .then(() => {
                    self.googleLoginStatusChangeCallback(self, gapi.auth2.getAuthInstance().isSignedIn.get(), finallyCallback);
                 });
                
            } else if (provider.name === ExternalLoginProvider.MICROSOFT) {
                WL.login({
                    scope: ["wl.signin", "wl.basic", "wl.emails"]
                });
            }
        //});
    }

    init(): void {
        this.initExternalLoginProviders();
    }

    private processAuthenticateResult(authenticateResult: AuthenticateResultModel, redirectUrl?: string) {
        this.authenticateResult = authenticateResult;

        if (authenticateResult.shouldResetPassword) {
            //Password reset

            this._router.navigate(['account/reset-password'], {
                queryParams: {
                    userId: authenticateResult.userId,
                    tenantId: abp.session.tenantId,
                    resetCode: authenticateResult.passwordResetCode
                }
            });

            this.clear();

        } else if (authenticateResult.requiresTwoFactorVerification) {
            //Two factor authentication

            this._router.navigate(['account/send-code']);

        } else if (authenticateResult.accessToken) {
            //Successfully logged in
            if (authenticateResult.returnUrl && !redirectUrl) {
                redirectUrl = authenticateResult.returnUrl;
            }

            this.login(authenticateResult.accessToken, authenticateResult.encryptedAccessToken, authenticateResult.expireInSeconds, this.rememberMe, authenticateResult.twoFactorRememberClientToken, redirectUrl);

        } else {
            //Unexpected result!

            this._logService.warn('Unexpected authenticateResult!');
            this._router.navigate(['account/login']);

        }
    }

    private login(accessToken: string, encryptedAccessToken: string, expireInSeconds: number, rememberMe?: boolean, twoFactorRememberClientToken?: string, redirectUrl?: string): void {

        var tokenExpireDate = rememberMe ? (new Date(new Date().getTime() + 1000 * expireInSeconds)) : undefined;

        this._tokenService.setToken(
            accessToken,
            tokenExpireDate
        );

        this._utilsService.setCookieValue(
            AppConsts.authorization.encrptedAuthTokenName,
            encryptedAccessToken,
            tokenExpireDate,
            abp.appPath
        );

        if (twoFactorRememberClientToken) {
            this._utilsService.setCookieValue(
                LoginService.twoFactorRememberClientTokenName,
                twoFactorRememberClientToken,
                new Date(new Date().getTime() + 365 * 86400000), //1 year
                abp.appPath
            );
        }


        

        if (redirectUrl) {
            location.href = redirectUrl;
        } else {
            var initialUrl = decodeURIComponent(location.href);
            if (initialUrl.indexOf('/login') > 0 ||
            initialUrl.indexOf('/register') > 0 ||
            initialUrl.indexOf('/entrar') > 0 ||
            initialUrl.indexOf('/registrar') > 0) {
                initialUrl = AppConsts.appBaseUrl;
            }

            location.href = initialUrl;
        }
    }

    clear(): void {
        this.authenticateModel = new AuthenticateModel();
        this.authenticateModel.rememberClient = false;
        this.authenticateResult = null;
        this.rememberMe = false;
    }

    initExternalLoginProviders() {
        this._tokenAuthService
            .getExternalAuthenticationProviders()
            .subscribe((providers: ExternalLoginProviderInfoModel[]) => {
                this.externalLoginProviders = _.map(providers, p => new ExternalLoginProvider(p));
                this.externalLoginProviders.forEach(element => {
                    this.ensureExternalLoginProviderInitialized(element);
                });
            });
    }

    ensureExternalLoginProviderInitialized(loginProvider: ExternalLoginProvider) {
        let self = this;
        if (loginProvider.initialized) {
            //callback();
            return;
        }

        if (loginProvider.name === ExternalLoginProvider.FACEBOOK) {
            jQuery.getScript('//connect.facebook.net/en_US/sdk.js', () => {
                FB.init({
                    appId: loginProvider.clientId,
                    cookie: false,
                    xfbml: true,
                    version: 'v2.5'
                });

                //callback();
            });
        } else if (loginProvider.name === ExternalLoginProvider.GOOGLE) {
            jQuery.getScript('https://apis.google.com/js/api.js', () => {
                gapi.load('client:auth2',
                    () => {
                        gapi.client.init({
                            clientId: loginProvider.clientId,
                            scope: 'openid profile email'
                        }).then(() => {
                            //gapi.auth2.getAuthInstance().isSignedIn.listen(self.updateSigninStatus);
                            //this.googleLoginStatusChangeCallback(self, gapi.auth2.getAuthInstance().isSignedIn.get());
                        });

                        //callback();
                    });
            });
        } else if (loginProvider.name === ExternalLoginProvider.MICROSOFT) {
            jQuery.getScript('//js.live.net/v5.0/wl.js', () => {
                WL.Event.subscribe("auth.login", this.microsoftLogin);
                WL.init({
                    client_id: loginProvider.clientId,
                    scope: ["wl.signin", "wl.basic", "wl.emails"],
                    redirect_uri: AppConsts.appBaseUrl,
                    response_type: "token"
                });
            });
        }
    }

    facebookLoginStatusChangeCallback(self, resp,finallyCallback) {

        if (resp.status === 'connected') {
            var model = new ExternalAuthenticateModel();
            model.authProvider = ExternalLoginProvider.FACEBOOK;
            model.providerAccessCode = resp.authResponse.accessToken;
            model.providerKey = resp.authResponse.userID;
            model.roleName = self.roleName;
            model.administrativeArea = self.administrativeArea;
            model.worbbiorRegisterCode = self.worbbiorRegisterCode;

            this._tokenAuthService.externalAuthenticate(model)
                .finally(() => { 
                    finallyCallback();
                })
                .subscribe((result: ExternalAuthenticateResultModel) => {
                    if(model.roleName != null) { 
                        let filter = model.roleName + " - " + model.administrativeArea;

                        FB.api('/me', { fields: 'email' },
                            function(response) {

                                if (result.waitingForActivation) {
                                    this._messageService.info('Seu cadastro foi realizado com sucesso. Aguarde ativação!');

                                    self.angulartics2.eventTrack.next({ 
                                        action: filter, 
                                        properties: { category: 'Cadastro', label: 'Facebook - Esperando ativação de email: response.email' }
                                    });

                                    return;
                                }  

                                if(model.administrativeArea != 'RJ'){
                                    self.angulartics2.eventTrack.next({ 
                                        action: filter, 
                                        properties: { category: 'Tentativa de cadastro', label: 'Facebook: ' + response.email }
                                    });

                                    self._messageService.info('Estamos atuando, no momento, apenas no RJ. Você será avisado quando a Worbby for lançada em seu estado.', 'O cadastro para o estado de(a) ' + model.administrativeArea + ' não esta disponível').done(() => {});
                                    
                                    return;
                                }else{
                                    self.angulartics2.eventTrack.next({ 
                                        action: filter,
                                        properties: { category: 'Cadastro', label: 'Facebook: ' + response.email }
                                    });
                                } 

                                self.login(result.accessToken, result.expireInSeconds);                                
                            }
                        );
                    }else{
                        FB.api('/me', { fields: 'email' },
                            function(response) {
                                self.angulartics2.eventTrack.next({ action: "Facebook", properties: { category: 'Login', label: response.email }});

                                self.login(result.accessToken, result.expireInSeconds); 
                            }
                        );                        
                    }
                        
                                     
                }, (error) => {

                    let filter = model.roleName + " - " + model.administrativeArea;

                    FB.api('/me', { fields: 'email' },
                            function(response) {

                                if(model.roleName != null) {                         
                                    let filter = model.roleName + " - " + model.administrativeArea;
                                    self.angulartics2.eventTrack.next({ 
                                        action: filter, 
                                        properties: { category: 'Tentativa de cadastro', label: 'Facebook - Erro durante a autenticação: ' + response.email + " - " + error.error.details }
                                    });
                                }else{
                                    self.angulartics2.eventTrack.next({ 
                                        action: "Facebook", 
                                        properties: { category: 'Login', label: "Erro durante a autenticação: " + response.email + " | " + error.error.details }
                                    });
                                }
                            }
                        );
                });
        }
    }

    googleLoginStatusChangeCallback(self, isSignedIn,finallyCallback) {

        if (isSignedIn) {
            var model = new ExternalAuthenticateModel();
            model.authProvider = ExternalLoginProvider.GOOGLE;
            model.providerAccessCode = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
            model.providerKey = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getId();
            model.roleName = self.roleName;
            model.administrativeArea = self.administrativeArea;
            model.worbbiorRegisterCode = self.worbbiorRegisterCode;

            

            self._tokenAuthService.externalAuthenticate(model)
                .finally(() => { 
                    finallyCallback();
                })
                .subscribe((result: ExternalAuthenticateResultModel) => {
                    if(model.roleName != null) { 
                        
                        let filter = model.roleName + " - " + model.administrativeArea;

                        var userEmail = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getEmail();

                        if (result.waitingForActivation) {
                            this._messageService.info('Seu cadastro foi realizado com sucesso. Aguarde ativação!');

                            self.angulartics2.eventTrack.next({ 
                                action: filter, 
                                properties: { category: 'Cadastro', label: 'Google - Esperando ativação de e-mail: ' + userEmail }
                            });

                            return;
                        }

                        if(model.administrativeArea != 'RJ') {
                            self.angulartics2.eventTrack.next({ 
                                action: filter, 
                                properties: { category: 'Tentativa de cadastro', label: 'Google: ' + userEmail }
                            });

                            self._messageService.info('Estamos atuando, no momento, apenas no RJ. Você será avisado quando a Worbby for lançada em seu estado.', 'O cadastro para o estado de(a) ' + model.administrativeArea + ' não esta disponível').done(() => {});

                            return;
                        }else{
                            self.angulartics2.eventTrack.next({ action: filter, properties: { category: 'Cadastro', label: 'Google: ' + userEmail }});
                        } 
                    }

                    self.angulartics2.eventTrack.next({ action: "Google", properties: { category: 'Login', label: userEmail }});

                    self.login(result.accessToken, result.expireInSeconds);
                }, (error) => { 
                    var userEmail = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getEmail();
                    if(model.roleName != null) {                         
                        let filter = model.roleName + " - " + model.administrativeArea;
                        self.angulartics2.eventTrack.next({ 
                            action: filter, 
                            properties: { category: 'Tentativa de cadastro', label: 'Google - Erro durante a autenticação: ' + userEmail + " | " + error.error.details }
                        });
                    }else{
                        self.angulartics2.eventTrack.next({ 
                            action: "Google", 
                            properties: { category: 'Login', label: "Erro durante a autenticação: " + userEmail + " | " + error.error.details }
                        });
                    }
                });
        }
    }

    /**
    * Microsoft login is not completed yet, because of an error thrown by zone.js: https://github.com/angular/zone.js/issues/290
    */
    private microsoftLogin() {
        this._logService.debug(WL.getSession());
        var model = new ExternalAuthenticateModel();
        model.authProvider = ExternalLoginProvider.MICROSOFT;
        model.providerAccessCode = WL.getSession().access_token;
        model.providerKey = WL.getSession().id; //How to get id?
        model.singleSignIn = UrlHelper.getSingleSignIn();
        model.returnUrl = UrlHelper.getReturnUrl();

        this._tokenAuthService.externalAuthenticate(model)
            .subscribe((result: ExternalAuthenticateResultModel) => {
                if (result.waitingForActivation) {
                    this._messageService.info('You have successfully registered. Waiting for activation!');
                    return;
                }

                this.login(result.accessToken, result.encryptedAccessToken, result.expireInSeconds, false, '', result.returnUrl);
            });
    }
}