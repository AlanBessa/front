import { Component, Injector, AfterViewInit, ViewChild, Inject } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppConsts } from '@shared/AppConsts';
import { FileUploader, FileUploaderOptions, Headers } from '@node_modules/ng2-file-upload';
import { ProfileServiceProxy, CurrentUserProfileEditDto, DefaultTimezoneScope, UserLoginInfoDto } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { AppTimezoneScope } from '@shared/AppEnums';
import { ChangeProfilePictureModalComponent } from '@app/shared/layout/profile/change-profile-picture-modal.component';

@Component({
    templateUrl: './my-payment.component.html',
    selector: 'myPaymentWorbbient',
    animations: [appModuleAnimation()]
})
export class MyPaymentWorbbientComponent extends AppComponentBase implements AfterViewInit {

    public active: boolean = false;
    public saving: boolean = false;

    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    ngAfterViewInit(): void {
    }

    ngOnInit() {
    }

    save(): void {
        this.saving = true;
    }
}