import { NgModule } from '@angular/core';

import { FileDownloadService } from './file-download.service';
import { EqualValidator } from './validation/equal-validator.directive';
import { PasswordComplexityValidator } from './validation/password-complexity-validator.directive'
import { MinValueValidator } from './validation/min-value-validator.directive'
import { ButtonBusyDirective } from './button-busy.directive'
import { AutoFocusDirective } from './auto-focus.directive'
import { BusyIfDirective } from './busy-if.directive';
import { LocalStorageService } from './local-storage.service';
import { FriendProfilePictureComponent } from './friend-profile-picture.component';
import { MomentFormatPipe } from './moment-format.pipe';
import { CurrencyInputDirective } from './currency-input.directive';
import { GroupByPipe } from './group-by.pipe';
import { ReversePipe } from './reverse.pipe';
import { AgmCoreModule } from "@agm/core";
import { MarkerClusterDirective } from "shared/utils/marker-cluster.directive";

@NgModule({
    providers: [
        FileDownloadService,
        LocalStorageService
    ],
    declarations: [
        EqualValidator,
        PasswordComplexityValidator,
        MinValueValidator,
        ButtonBusyDirective,
        AutoFocusDirective,
        BusyIfDirective,
        FriendProfilePictureComponent,
        MomentFormatPipe,
        CurrencyInputDirective,
        GroupByPipe,
        ReversePipe,
        MarkerClusterDirective
    ],
    exports: [
        EqualValidator,
        PasswordComplexityValidator,
        MinValueValidator,
        ButtonBusyDirective,
        AutoFocusDirective,
        BusyIfDirective,
        FriendProfilePictureComponent,
        MomentFormatPipe,
        CurrencyInputDirective,
        GroupByPipe,
        ReversePipe,
        MarkerClusterDirective
    ],
    imports: [
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyDmAf99svQmS-Oi0BDl2Zpn0YtMGccRZRM' 
        })
    ]
})
export class UtilsModule { }