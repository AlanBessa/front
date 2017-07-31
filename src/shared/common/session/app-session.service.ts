import { Injectable } from '@angular/core';
import { 
    SessionServiceProxy, 
    UserLoginInfoDto, 
    TenantLoginInfoDto, 
    ApplicationInfoDto, 
    GetCurrentLoginInformationsOutput,
    ActivityEndorsementForCreateUpdate,
    UserLoginServiceProxy,
    WorbbiorServiceProxy,
    InterestCenterDto
} from '@shared/service-proxies/service-proxies'
import { AbpMultiTenancyService } from '@abp/multi-tenancy/abp-multi-tenancy.service'
import { WorbbiorState } from '@shared/AppEnums';
import { AppAuthService } from '@app/shared/common/auth/app-auth.service';
import { UtilsService } from '@abp/utils/utils.service';

@Injectable()
export class AppSessionService {

    private _user: UserLoginInfoDto;
    private _tenant: TenantLoginInfoDto;
    private _application: ApplicationInfoDto;
    private _currentRoleName: string;
    private _defaultRoleName: string;
    private _worbbiorState: WorbbiorState;
    private _endorsement: ActivityEndorsementForCreateUpdate;
    private _worbbiorId:number;
    public _worbbiorSlug:string;
    public _worbbiorDisplayName: string;
    public _worbbiorPremium: boolean;
    public _firstAccess:boolean = true;
    public _isMobileDevice:boolean;
    
    public _interestCentersTopLevel: InterestCenterDto[] = [];

    constructor(
        private _sessionService: SessionServiceProxy,
        private _abpMultiTenancyService: AbpMultiTenancyService,
        private _utilsService: UtilsService,
        private _authService: AppAuthService,
        private _userLoginService: UserLoginServiceProxy,
        private _worbbiorService: WorbbiorServiceProxy) {
    }

    get interestCentersTopLevel():InterestCenterDto[]{
        return this._interestCentersTopLevel;
    }

    set interestCentersTopLevel(value: InterestCenterDto[]){
        this._interestCentersTopLevel = value;
    }

    get application(): ApplicationInfoDto {
        return this._application;
    }

    get user(): UserLoginInfoDto {
        return this._user;
    }

    get userId(): number {
        return this.user ? this.user.id : null;
    }

    get tenant(): TenantLoginInfoDto {
        return this._tenant;
    }

    get tenantId(): number {
        return this.tenant ? this.tenant.id : null;
    }

    get worbbiorState(): WorbbiorState{
        return this._worbbiorState;
    }

    set worbbiorState(value: WorbbiorState){
        this._worbbiorState = value;
    }

    get firstAccess(): boolean{
        return this._firstAccess;
    }

    set firstAccess(value: boolean){
        this._firstAccess = value;
        var today = new Date();
        today.setHours(today.getHours() + 24);

        this._utilsService.setCookieValue("firstAccess", value.toString(),today)
    }

    get worbbiorPremium(): boolean{
        return this._worbbiorPremium;
    }

    set worbbiorPremium(value: boolean){
        this._worbbiorPremium = value;
    }

    set worbbiorId(value:number) {
        this._worbbiorId = value;
    }

    get worbbiorId(): number{
        return this._worbbiorId;
    }

    set worbbiorSlug(value:string) {
        this._worbbiorSlug = value;
    }

    get worbbiorSlug(): string{
        return this._worbbiorSlug;
    }

    set worbbiorDisplayName(value:string) {
        this._worbbiorDisplayName = value;
    }

    get worbbiorDisplayName(): string{
        return this._worbbiorDisplayName;
    }

    get endorsement(): ActivityEndorsementForCreateUpdate {
        return this._endorsement;
    }

    set endorsement(value: ActivityEndorsementForCreateUpdate) {
        this._endorsement = value;
    }

    get userRoleName(): string {
        return this._currentRoleName;
    }
 
    set userRoleName(value: string) {
        this._currentRoleName = value;
        this._utilsService.setCookieValue("userRoleName", value);
    }

    set firstLoginUser(value:string) {
        this._utilsService.setCookieValue("firstLoginUser", value);
    }

    get firstLoginUser(): string{
        return this._utilsService.getCookieValue("firstLoginUser")
    }

    set isMobileDevice(value:boolean){
        this._isMobileDevice = value;
    }

    get isMobileDevice(): boolean{
        return this._isMobileDevice;
    }

    getShownLoginName(): string {
        let userName = this._user.userName;
        if (!this._abpMultiTenancyService.isEnabled) {
            return userName;
        }

        return (this._tenant ? this._tenant.tenancyName : ".") + "\\" + userName;
    }

    init(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this._sessionService.getCurrentLoginInformations().toPromise().then((result: GetCurrentLoginInformationsOutput) => {
                this._application = result.application;
                this._user = result.user;
                this._tenant = result.tenant;

                this._currentRoleName = result.defaultRoleName;
                this._defaultRoleName = result.defaultRoleName;

                this.isMobileDevice = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/).test(navigator.userAgent.toLowerCase());

                if (this._utilsService.getCookieValue("userRoleName")) {
                    this._currentRoleName = this._utilsService.getCookieValue("userRoleName");
                }

                if(this._utilsService.getCookieValue("firstAccess")){
                    this.firstAccess = (this._utilsService.getCookieValue("firstAccess") == "true");
                }
                
                if (abp.session.userId && this._currentRoleName == "Worbbior") {
                    this._worbbiorService.getWorbbiorByUserId(abp.session.userId).subscribe((result) => {
                        this.worbbiorState = Number(result.worbbiorState);
                        this.worbbiorId = result.id;
                        this.worbbiorSlug = result.slug;
                        this.worbbiorDisplayName = result.displayName;
                        this.worbbiorPremium = result.premium;
                        resolve(true);
                    });  

                    if(!this.firstLoginUser){
                        this._userLoginService.getRecentUserLoginAttempts().subscribe(result => {
                            let logins = result.items;
                            this.firstLoginUser = (result.items.length <= 1).toString();
                        });
                    }
                    
                }
                else {
                    resolve(true);
                }  

            }, (err) => {
                reject(err);
            });
        });
    }

    changeTenantIfNeeded(tenantId?: number): boolean {
        if (this.isCurrentTenant(tenantId)) {
            return false;
        }

        abp.multiTenancy.setTenantIdCookie(tenantId);
        location.reload();
        return true;
    }

    private isCurrentTenant(tenantId?: number) {
        if (!tenantId && this.tenant) {
            return false;
        } else if (tenantId && (!this.tenant || this.tenant.id !== tenantId)) {
            return false;
        }

        return true;
    }

    
}