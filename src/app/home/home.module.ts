import * as ngCommon from '@angular/common';
import { CommonModule } from '@shared/common/common.module';
import { AppCommonModule } from '@app/shared/common/app-common.module'
import { NgModule } from '@angular/core';
import { FormsModule, FormControl } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { ModalModule, ButtonsModule, TooltipModule } from 'ngx-bootstrap';
import { AbpModule } from '@abp/abp.module';
import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { HomeComponent } from './home.component';
import { HomePageComponent } from './home-page.component';
import { HomeRoutingModule } from './home-routing.module';
import { HomeReleaseModalComponent } from './home-release-modal.component';

@NgModule({
    imports: [
        HomeRoutingModule,
        ngCommon.CommonModule, 
        CommonModule,
        FormsModule,
        HttpModule,
        JsonpModule,
        ModalModule.forRoot(),
        ButtonsModule.forRoot(),
        TooltipModule.forRoot(),
        AbpModule,
        UtilsModule,
        ServiceProxyModule,
        AppCommonModule        
    ],
    declarations: [
        HomeComponent,
        HomePageComponent,
        HomeReleaseModalComponent
    ]
})
export class HomeModule {

}