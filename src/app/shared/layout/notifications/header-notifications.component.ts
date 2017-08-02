import { Component, OnInit, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { NotificationServiceProxy, GetNotificationsOutput, UserNotification } from '@shared/service-proxies/service-proxies';
import { UserNotificationHelper, IFormattedUserNotification } from './UserNotificationHelper';
import { Router } from '@angular/router';

@Component({
    templateUrl: './header-notifications.component.html',
    selector: '[headerNotifications]',
    encapsulation: ViewEncapsulation.None
})
export class HeaderNotificationsComponent extends AppComponentBase implements OnInit {

    notifications: IFormattedUserNotification[] = [];
    unreadNotificationCount: number = 0;
    notificationOpen: string = "";

    constructor(
        injector: Injector,
        private _notificationService: NotificationServiceProxy,
        private _userNotificationHelper: UserNotificationHelper,
        private _router: Router
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.loadNotifications();
        this.registerToEvents();
    }

    showHideNotifications(): void {
        if (this.notificationOpen == "") {
            this.notificationOpen = "open";
        } else {
            this.notificationOpen = "";
        }
    }

    loadNotifications(): void {
        this._notificationService.getUserNotifications(undefined, 3, undefined).subscribe(result => {
            this.unreadNotificationCount = result.unreadCount;
            this.notifications = [];
            $.each(result.items, (index, item: UserNotification) => {
                this.notifications.push(this._userNotificationHelper.format(<any>item));
            });
        });
    }

    registerToEvents() {
        abp.event.on('abp.notifications.received', userNotification => {
            this._userNotificationHelper.show(userNotification);
            this.loadNotifications();
        });

        abp.event.on('app.notifications.refresh', () => {
            this.loadNotifications();
        });

        abp.event.on('app.notifications.read', userNotificationId => {
            for (var i = 0; i < this.notifications.length; i++) {
                if (this.notifications[i].userNotificationId === userNotificationId) {
                    this.notifications[i].state = 'READ';
                }
            }

            this.unreadNotificationCount -= 1;
        });
    }

    setAllNotificationsAsRead(): void {
        this._userNotificationHelper.setAllAsRead();
    }

    openNotificationSettingsModal(): void {
        this._userNotificationHelper.openSettingsModal();
    }

    setNotificationAsRead(userNotification: IFormattedUserNotification): void {
        this._userNotificationHelper.setAsRead(userNotification.userNotificationId);
    }

    gotoUrl(url): void {
        if (url) {
            this._router.navigate([url]);
            this.showHideNotifications();
            //location.href = url;
        }
    }
}