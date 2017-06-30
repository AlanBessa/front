import { Injector, OnInit } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import { LocalizationService } from '@abp/localization/localization.service';
import { PermissionCheckerService } from '@abp/auth/permission-checker.service';
import { FeatureCheckerService } from '@abp/features/feature-checker.service';
import { NotifyService } from '@abp/notify/notify.service';
import { SettingService } from '@abp/settings/setting.service';
import { MessageService } from '@abp/message/message.service';
import { AbpMultiTenancyService } from '@abp/multi-tenancy/abp-multi-tenancy.service';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { BinaryObjectServiceProxy } from '@shared/service-proxies/service-proxies';
import { Router, ActivatedRoute } from '@angular/router';

export abstract class AppComponentBase {

    localizationSourceName = AppConsts.localization.defaultLocalizationSourceName;

    localization: LocalizationService;
    permission: PermissionCheckerService;
    feature: FeatureCheckerService;
    notify: NotifyService;
    setting: SettingService;
    message: MessageService;
    multiTenancy: AbpMultiTenancyService;
    appSession: AppSessionService;
    storageService: BinaryObjectServiceProxy;
    activatedRoute:ActivatedRoute;
    mediaQuery: string;

    constructor(injector: Injector) {
        this.localization = injector.get(LocalizationService);
        this.permission = injector.get(PermissionCheckerService);
        this.feature = injector.get(FeatureCheckerService);
        this.notify = injector.get(NotifyService);
        this.setting = injector.get(SettingService);
        this.message = injector.get(MessageService);
        this.multiTenancy = injector.get(AbpMultiTenancyService);
        this.appSession = injector.get(AppSessionService);
        this.storageService = injector.get(BinaryObjectServiceProxy);
        this.activatedRoute = injector.get(ActivatedRoute);
    }

    ngOnInit() {
        let self = this;
        self.setMediaQueries();
        window.onresize = () =>{
            self.setMediaQueries();
        }
        
        if(this.activatedRoute.snapshot.url.join('') == "seja-um-worbbior" || this.activatedRoute.snapshot.url.join('') == "become-a-worbbior"){
            $('body').attr('class', 'worbbior');
            $('.logo-topo').attr('src', '/assets/metronic/worbby/global/img/logo-worbbior-beta.svg');
        }else{
            if(this.appSession.userRoleName == "Worbbior"){
                $('body').attr('class', 'worbbior');
                $('.logo-topo').attr('src', '/assets/metronic/worbby/global/img/logo-worbbior-beta.svg');
            }else{
                $('body').attr('class', 'worbbient');
                $('.logo-topo').attr('src', '/assets/metronic/worbby/global/img/logo-worbbient-beta.svg');
            }
        }        
    }

    l(key: string, ...args: any[]): string {
        let localizedText = this.localization.localize(key, this.localizationSourceName);

        if (!localizedText) {
            localizedText = key;
        }

        if (!args || !args.length) {
            return localizedText;
        }

        args.unshift(localizedText);
        return abp.utils.formatString.apply(this, args);
    }

    isGranted(permissionName: string): boolean {
        return this.permission.isGranted(permissionName);
    }


    getAverage(list:any[], propert:string){
        if(list.length == 0)
            return 0;

        var sum:number = 0;
        var count:number = list.length;

        list.forEach(element => {
            sum = sum + Number(element[propert]);
        });

        return Math.round(sum / count);
    }

    distance(lat1, lon1, lat2, lon2):number {
        var radlat1 = Math.PI * lat1/180
        var radlat2 = Math.PI * lat2/180
        var theta = lon1-lon2
        var radtheta = Math.PI * theta/180
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist)
        dist = dist * 180/Math.PI
        dist = dist * 60 * 1.1515
        dist = dist * 1.609344 * 1000;
        return dist
    }

    getPictureByGuid(guid:string):Promise<string> {
        let self = this;
        return new Promise<string>((resolve,reject) => {
            self.storageService.getBase64String(guid).subscribe((result) => {
                var base64String = "";
                if(result.base64String != ""){
                    base64String = "data:image/jpeg;base64,";
                }
                resolve(base64String + result.base64String);
                
            });  
        });
    }

    toNumber(value):number {
        return Number(value);
    }

    isEmpty(value):boolean{
        return (value == null || value === '');
    }

    goTo(location): void {
        var heightMenu = $('header').outerHeight();

        var aTag = $('#' + location);
        var scrollOffset = aTag.offset().top - heightMenu;

        if (navigator.userAgent.match(/iPad|iPhone|iPod|Android|Windows Phone/i)) {
            this.customScrollTo(scrollOffset, 1000);
        }
        else {
            $('html, body').animate({
                scrollTop: scrollOffset
            }, 500);
        }
    }

    private customScrollTo(to, duration) {
        var start = 0,
            change = to - start,
            currentTime = 0,
            increment = 20;

        var easeInOutQuad = function(t, b, c, d) {
            t /= d/2;
            if (t < 1) return c/2*t*t + b;
            t--;
            return -c/2 * (t*(t-2) - 1) + b;
        }

        var animateScroll = function(){        
            currentTime += increment;
            var val = easeInOutQuad(currentTime, start, change, duration);                        
            window.scrollTo(0,val);

            if(currentTime < duration) {
                setTimeout(animateScroll, increment);
            }
        };
        
        animateScroll();
    }    

    isImageFile(fileName: string): boolean {

        var fileExtension = (/[.]/.exec(fileName)) ? /[^.]+$/.exec(fileName) : undefined;

        var isValid:boolean = false;
        switch (fileExtension.toString()) {
            case 'jpeg':
                isValid =  true
                break;
            case 'png':
                isValid =  true
                break;
            case 'jpg':
                isValid =  true
                break;
            default:
        }
        return isValid;
    }

    megByteToBytes(value:number):number{
        return value * 1048576;
    }   

    setTheme():void{
        if(this.appSession.userRoleName == "Worbbior"){
            $('body').attr('class', 'worbbior');
            $('.logo-topo').attr('src', '/assets/metronic/worbby/global/img/logo-worbbior-beta.svg');
        }else{
            $('body').attr('class', 'worbbient');
            $('.logo-topo').attr('src', '/assets/metronic/worbby/global/img/logo-worbbient-beta.svg');
        }
    }

    setMediaQueries(){
        if(window.innerWidth < 768){
            this.mediaQuery = "xs";
        }else if(window.innerWidth >= 768 && window.screen.width < 992){
            this.mediaQuery = "sm";
        }else if(window.innerWidth >= 992 && window.screen.width < 1200){
            this.mediaQuery = "md";
        }else if(window.innerWidth >= 1200){
            this.mediaQuery = "lg";
        }
    }
}