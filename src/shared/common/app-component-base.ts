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
import { BinaryObjectServiceProxy, InterestCenterServiceProxy, ListResultDtoOfInterestCenterDto, InterestCenterDto } from '@shared/service-proxies/service-proxies';
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
    activatedRoute: ActivatedRoute;
    mediaQuery: string;
    interestCenterService: InterestCenterServiceProxy;

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
        this.interestCenterService = injector.get(InterestCenterServiceProxy);
    }

    ngOnInit() {
        let self = this;
        self.setMediaQueries();
        window.onresize = () => {
            self.setMediaQueries();
        }

        if (this.activatedRoute.snapshot.url.join('') == "seja-um-worbbior" || this.activatedRoute.snapshot.url.join('') == "become-a-worbbior") {
            $('body').attr('class', 'worbbior');
            $('.logo-topo').attr('src', '/assets/metronic/worbby/global/img/logo-worbbior-beta.svg');
        } else {
            if (this.appSession.userRoleName == "Worbbior") {
                $('body').attr('class', 'worbbior');
                $('.logo-topo').attr('src', '/assets/metronic/worbby/global/img/logo-worbbior-beta.svg');
            } else {
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


    getAverage(list: any[], propert: string) {
        if (list.length == 0)
            return 0;

        var sum: number = 0;
        var count: number = list.length;

        list.forEach(element => {
            sum = sum + Number(element[propert]);
        });

        return Math.round(sum / count);
    }

    distance(lat1, lon1, lat2, lon2): number {
        var radlat1 = Math.PI * lat1 / 180
        var radlat2 = Math.PI * lat2 / 180
        var theta = lon1 - lon2
        var radtheta = Math.PI * theta / 180
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist)
        dist = dist * 180 / Math.PI
        dist = dist * 60 * 1.1515
        //dist = dist * 1.609344 * 1000; //metros
        dist = dist * 1.609344; //kilometros
        return dist
    }

    getPictureByGuid(guid: string): Promise<string> {
        let self = this;
        var base64String = "";
        return new Promise<string>((resolve, reject) => {
            if (guid != null) {
                self.storageService.getBase64String(guid).subscribe((result) => {

                    if (result.base64String != "") {
                        base64String = "data:image/jpeg;base64,";
                    }
                    resolve(base64String + result.base64String);
                });
            } else {
                resolve(base64String);
            }

        });
    }

    toNumber(value): number {
        return Number(value);
    }

    isNullOrEmpty(value): boolean {
        return (value == null || value === '' || value == undefined);
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

        var easeInOutQuad = function (t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        var animateScroll = function () {
            currentTime += increment;
            var val = easeInOutQuad(currentTime, start, change, duration);
            window.scrollTo(0, val);

            if (currentTime < duration) {
                setTimeout(animateScroll, increment);
            }
        };

        animateScroll();
    }

    isImageFile(fileName: string): boolean {

        var fileExtension = (/[.]/.exec(fileName)) ? /[^.]+$/.exec(fileName) : undefined;

        var isValid: boolean = false;
        switch (fileExtension.toString().toLocaleLowerCase()) {
            case 'jpeg':
                isValid = true
                break;
            case 'png':
                isValid = true
                break;
            case 'jpg':
                isValid = true
                break;
            default:
        }
        return isValid;
    }

    megByteToBytes(value: number): number {
        return value * 1048576;
    }

    setTheme(): void {
        if (this.appSession.userRoleName == "Worbbior") {
            $('body').attr('class', 'worbbior');
            $('.logo-topo').attr('src', '/assets/metronic/worbby/global/img/logo-worbbior-beta.svg');
        } else {
            $('body').attr('class', 'worbbient');
            $('.logo-topo').attr('src', '/assets/metronic/worbby/global/img/logo-worbbient-beta.svg');
        }
    }

    setMediaQueries() {
        if (window.innerWidth < 768) {
            this.mediaQuery = "xs";
        } else if (window.innerWidth >= 768 && window.screen.width < 992) {
            this.mediaQuery = "sm";
        } else if (window.innerWidth >= 992 && window.screen.width < 1200) {
            this.mediaQuery = "md";
        } else if (window.innerWidth >= 1200) {
            this.mediaQuery = "lg";
        }
    }

    public getInterestCentersTopLevel(): void {
        this.interestCenterService.getInterestCentersTopLevel().subscribe((result: ListResultDtoOfInterestCenterDto) => {
            this.appSession.interestCentersTopLevel = result.items;
        });
    }

    changeSpecialCharacterToNormalCharacter(str: string): string {
        var conversions = new Object();
        conversions['ae'] = 'ä|æ|ǽ';
        conversions['oe'] = 'ö|œ';
        conversions['ue'] = 'ü';
        conversions['Ae'] = 'Ä';
        conversions['Ue'] = 'Ü';
        conversions['Oe'] = 'Ö';
        conversions['A'] = 'À|Á|Â|Ã|Ä|Å|Ǻ|Ā|Ă|Ą|Ǎ';
        conversions['a'] = 'à|á|â|ã|å|ǻ|ā|ă|ą|ǎ|ª';
        conversions['C'] = 'Ç|Ć|Ĉ|Ċ|Č';
        conversions['c'] = 'ç|ć|ĉ|ċ|č';
        conversions['D'] = 'Ð|Ď|Đ';
        conversions['d'] = 'ð|ď|đ';
        conversions['E'] = 'È|É|Ê|Ë|Ē|Ĕ|Ė|Ę|Ě';
        conversions['e'] = 'è|é|ê|ë|ē|ĕ|ė|ę|ě';
        conversions['G'] = 'Ĝ|Ğ|Ġ|Ģ';
        conversions['g'] = 'ĝ|ğ|ġ|ģ';
        conversions['H'] = 'Ĥ|Ħ';
        conversions['h'] = 'ĥ|ħ';
        conversions['I'] = 'Ì|Í|Î|Ï|Ĩ|Ī|Ĭ|Ǐ|Į|İ';
        conversions['i'] = 'ì|í|î|ï|ĩ|ī|ĭ|ǐ|į|ı';
        conversions['J'] = 'Ĵ';
        conversions['j'] = 'ĵ';
        conversions['K'] = 'Ķ';
        conversions['k'] = 'ķ';
        conversions['L'] = 'Ĺ|Ļ|Ľ|Ŀ|Ł';
        conversions['l'] = 'ĺ|ļ|ľ|ŀ|ł';
        conversions['N'] = 'Ñ|Ń|Ņ|Ň';
        conversions['n'] = 'ñ|ń|ņ|ň|ŉ';
        conversions['O'] = 'Ò|Ó|Ô|Õ|Ō|Ŏ|Ǒ|Ő|Ơ|Ø|Ǿ';
        conversions['o'] = 'ò|ó|ô|õ|ō|ŏ|ǒ|ő|ơ|ø|ǿ|º';
        conversions['R'] = 'Ŕ|Ŗ|Ř';
        conversions['r'] = 'ŕ|ŗ|ř';
        conversions['S'] = 'Ś|Ŝ|Ş|Š';
        conversions['s'] = 'ś|ŝ|ş|š|ſ';
        conversions['T'] = 'Ţ|Ť|Ŧ';
        conversions['t'] = 'ţ|ť|ŧ';
        conversions['U'] = 'Ù|Ú|Û|Ũ|Ū|Ŭ|Ů|Ű|Ų|Ư|Ǔ|Ǖ|Ǘ|Ǚ|Ǜ';
        conversions['u'] = 'ù|ú|û|ũ|ū|ŭ|ů|ű|ų|ư|ǔ|ǖ|ǘ|ǚ|ǜ';
        conversions['Y'] = 'Ý|Ÿ|Ŷ';
        conversions['y'] = 'ý|ÿ|ŷ';
        conversions['W'] = 'Ŵ';
        conversions['w'] = 'ŵ';
        conversions['Z'] = 'Ź|Ż|Ž';
        conversions['z'] = 'ź|ż|ž';
        conversions['AE'] = 'Æ|Ǽ';
        conversions['ss'] = 'ß';
        conversions['IJ'] = 'Ĳ';
        conversions['ij'] = 'ĳ';
        conversions['OE'] = 'Œ';
        conversions['f'] = 'ƒ';

        for (var i in conversions) {
            var re = new RegExp(conversions[i], "g");
            str = str.replace(re, i);
        }

        return str;
    }
}