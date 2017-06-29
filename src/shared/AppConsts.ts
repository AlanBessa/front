export class AppConsts {

    static readonly tenancyNamePlaceHolderInUrl = "{TENANCY_NAME}";

    static remoteServiceBaseUrl: string;
    static remoteServiceBaseUrlFormat: string;
    static appBaseUrl: string;
    static appBaseUrlFormat: string;
    static recaptchaSiteKey: string;
    static subscriptionExpireNootifyDayCount: number;

    //Constantes novas do Worbby
    static facebookPixelId:string;
    static googleAnalyticsId:string;
    static defaultProfilePicture: string = "/assets/common/images/default-profile-picture.png";
    static defaultPdfPicture: string = "/assets/metronic/worbby/global/img/icone-pdf.png";
    static isMobile:boolean = false;
    static maxFileSizeUpload: number;
    static contactEmail: string;
    static phoneMask = ['(', /[1-9]/, /\d/, ')', ' ', /\d/ , /\d/ , /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    static rgMask =  [ /\d/ , /\d/ , /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/];
    static cpfMask =  [ /\d/ , /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/ , /\d/, /\d/, '-', /\d/, /\d/];
    static cnpjMask = [ /\d/ , /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/ , /\d/, /\d/, '/', /\d/, /\d/,/\d/, /\d/, '-', /\d/, /\d/];
    static cepMask =  [/\d/ , /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];

    static maxResultCount: number = 5;

    static readonly userManagement = {
        defaultAdminUserName: 'admin'
    };

    static readonly localization = {
        defaultLocalizationSourceName: 'Worbby'
    };

    static readonly authorization = {
        encrptedAuthTokenName: 'enc_auth_token'
    };

    static readonly grid = {
        defaultPageSize: 10
    }
}
