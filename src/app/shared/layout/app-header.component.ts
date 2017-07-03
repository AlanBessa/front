import { Component, OnInit, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { AbpSessionService } from '@abp/session/abp-session.service';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { AbpMultiTenancyService } from '@abp/multi-tenancy/abp-multi-tenancy.service';
import {
    ProfileServiceProxy,
    UserLinkServiceProxy,
    UserServiceProxy,
    LinkedUserDto,
    TenantLoginInfoDto,
    GetCurrentLoginInformationsOutput
} from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppAuthService } from '@app/shared/common/auth/app-auth.service';

import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
    templateUrl: './app-header.component.html',
    selector: 'app-header',
    encapsulation: ViewEncapsulation.None
})
export class AppHeaderComponent extends AppComponentBase implements OnInit {

    languages: abp.localization.ILanguageInfo[];
    currentLanguage: abp.localization.ILanguageInfo;
    isImpersonatedLogin: boolean = false;
    currentRoleName:string = "";

    isAuthenticated:boolean = false;

    shownLoginNameTitle: string = "";
    shownLoginName: string = "";
    profilePicture: string = "/assets/common/images/default-profile-picture.png";
    recentlyLinkedUsers: LinkedUserDto[];
    unreadChatMessageCount = 0;

    chatConnected = false;

    constructor(
        injector: Injector,
        public appSessionService: AppSessionService,
        private sessionService: AbpSessionService,
        private abpMultiTenancyService: AbpMultiTenancyService,
        private profileServiceProxy: ProfileServiceProxy,
        private userLinkServiceProxy: UserLinkServiceProxy,
        private userServiceProxy: UserServiceProxy,
        private _authService: AppAuthService
    ) {
        super(injector);
    }


    ngOnInit() {
        if (abp.session.userId){
            this.isAuthenticated = true;
        }
        this.currentRoleName = this.appSessionService.userRoleName;
        this.languages = this.localization.languages;
        this.currentLanguage = this.localization.currentLanguage;

        this.getCurrentLoginInformations();
        this.getProfilePicture();

        this.registerToEvents();
    }

    changeLanguage(languageName: string): void {
        abp.utils.setCookieValue("Abp.Localization.CultureName", languageName);
        location.reload();
    }

    getProfilePicture(): void {
        this.profileServiceProxy.getProfilePicture().subscribe(result => {
            if (result && result.profilePicture) {
                this.profilePicture = 'data:image/jpeg;base64,' + result.profilePicture;
            }
        });
    }

    getShownUserName(linkedUser: LinkedUserDto): string {
        if (!this.abpMultiTenancyService.isEnabled) {
            return linkedUser.username;
        }

        return (linkedUser.tenantId ? linkedUser.tenancyName : ".") + "\\" + linkedUser.username;
    }

    getCurrentLoginInformations(): void {
        this.shownLoginName = this.appSessionService.getShownLoginName();
    }

    registerToEvents() {
        abp.event.on("profilePictureChanged", () => {
            this.getProfilePicture();
        });

        abp.event.on('app.chat.unreadMessageCountChanged', messageCount => {
            this.unreadChatMessageCount = messageCount;
        });

        abp.event.on('app.chat.connected', () => {
            this.chatConnected = true;
        });
    }
}