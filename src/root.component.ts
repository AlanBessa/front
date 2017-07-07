import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { NotificationSettingsModalCompoent } from '@app/shared/layout/notifications/notification-settings-modal.component';
import { ChangePasswordModalComponent } from '@app/shared/layout/profile/change-password-modal.component';
import { UserNotificationHelper } from '@app/shared/layout/notifications/UserNotificationHelper';
import { SignalRHelper } from 'shared/helpers/SignalRHelper';
import { MessageSignalrService } from '@app/shared/common/message/message-signalr.service'
import { Router } from '@angular/router';
import { WorbbiorState } from '@shared/AppEnums';

@Component({
    selector: 'app-root',
    templateUrl: './root.component.html'
    //template:  `<router-outlet></router-outlet>`
})
export class RootComponent extends AppComponentBase implements OnInit {

    @ViewChild('changePasswordModal') changePasswordModal: ChangePasswordModalComponent;
    @ViewChild('notificationSettingsModal') notificationSettingsModal: NotificationSettingsModalCompoent;

    public isAuthenticated:boolean = false;
    public WorbbiorState: typeof WorbbiorState = WorbbiorState;

    public constructor(
        injector: Injector,
        private _userNotificationHelper: UserNotificationHelper,
        private _messageSignalrService: MessageSignalrService,
        private router: Router) {
        super(injector);
    }

    ngOnInit(): void {

        if (this.appSession.application.features['SignalR'] && abp.session.userId) {
            SignalRHelper.initSignalR(() => { this._messageSignalrService.init(); });
        }

        if(abp.session.userId){
            this.isAuthenticated = true
            if(this.appSession.userRoleName == "Worbbient"){
                this.router.navigate(['/']);
            }else if(this.appSession.userRoleName == "Worbbior"){
                if(this.appSession.worbbiorState != WorbbiorState.Active){
                    this.router.navigate(['/worbbior/edit-profile']);
                }else{
                    this.router.navigate(['/']);
                }
            }else{
                this.router.navigate(['/']);
            }
        }

        this._userNotificationHelper.settingsModal = this.notificationSettingsModal;

        let self = this;
        //this._loginService.init();
        
        $('head').append($('<link rel="stylesheet" type="text/css" />').attr('href', '/assets/metronic/worbby/global/plugin/slick/slick.css'));
        $('head').append($('<link rel="stylesheet" type="text/css" />').attr('href', '/assets/metronic/worbby/global/plugin/ng2-image-gallery.css'));
        $('head').append($('<link rel="stylesheet" type="text/css" />').attr('href', '/assets/metronic/worbby/global/css/themes.css'));

        $(document).on('click', '.close-nav', function (e) {
            //$('.btn-navbar').click();
            $('.navbar-toggle').click();
        });

        abp.event.on("changePasswordModal", () => {
            this.changePassword();
        });

        // We can attach the `fileselect` event to all file inputs on the page
        $(document).on('change', ':file', function() {
            var input = $(this),
                label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
            var fileText = $(this).parents('.input-group').find(':text')
                fileText.val(label);
        });
    }

    changePassword(): void {
        this.changePasswordModal.show();
    }
}