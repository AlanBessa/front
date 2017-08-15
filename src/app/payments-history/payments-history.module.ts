import * as ngCommon from '@angular/common';
import { CommonModule } from '@shared/common/common.module';
import { RouterModule } from '@angular/router';
import { AppCommonModule } from '@app/shared/common/app-common.module'
import { NgModule } from '@angular/core';
import { FormsModule, FormControl } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { ModalModule, ButtonsModule, TooltipModule, RatingModule, DatepickerModule } from 'ngx-bootstrap';
import { AbpModule } from '@abp/abp.module';
import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { GeneralPaymentComponent } from './general-payment.component';
import { PaidPaymentComponent } from './paid-payment.component';
import { ReceivedPaymentComponent } from './received-payment.component';
import { PaymentsHistoryComponent } from './payments-history.component';
import { ConfirmBalanceTransferModalComponent } from './confirm-balance-transfer-modal.component';
import { MomentModule } from "angular2-moment";
import { AppRouteGuard } from '@app/shared/common/auth/auth-route-guard';
import { LoginService } from "app/account/login/login.service";
import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
    imports: [
        ngCommon.CommonModule,
        CommonModule,
        FormsModule,
        HttpModule,
        JsonpModule,
        ModalModule.forRoot(),
        ButtonsModule.forRoot(),
        TooltipModule.forRoot(),
        DatepickerModule.forRoot(),
        AbpModule,
        UtilsModule,
        ServiceProxyModule,
        AppCommonModule,
        MomentModule,
        RouterModule,
        TextMaskModule
    ],
    declarations: [
        GeneralPaymentComponent,
        PaidPaymentComponent,
        ReceivedPaymentComponent,
        PaymentsHistoryComponent,
        ConfirmBalanceTransferModalComponent
    ],
    exports: [
        GeneralPaymentComponent,
        PaidPaymentComponent,
        ReceivedPaymentComponent,
        PaymentsHistoryComponent,
        ConfirmBalanceTransferModalComponent
    ],
    providers: [
        AppRouteGuard,
        LoginService
    ]
})
export class PaymentsHistoryModule {}