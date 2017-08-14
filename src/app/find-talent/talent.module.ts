import * as ngCommon from '@angular/common';
import { CommonModule } from '@shared/common/common.module';
import { AppCommonModule } from '@app/shared/common/app-common.module'
import { NgModule } from '@angular/core';
import { FormsModule, FormControl } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { ModalModule, ButtonsModule, TooltipModule, RatingModule } from 'ngx-bootstrap';
import { AbpModule } from '@abp/abp.module';
import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { TalentComponent } from './talent.component';
import { TalentPageComponent } from './talent-page.component';
import { TalentRoutingModule } from './talent-routing.module';
import { FindTalentMapComponent } from './find-talent-map/find-talent-map.component';

@NgModule({
    imports: [
        TalentRoutingModule,
        ngCommon.CommonModule,
        CommonModule,
        FormsModule,
        HttpModule,
        JsonpModule,
        ModalModule.forRoot(),
        ButtonsModule.forRoot(),
        TooltipModule.forRoot(),
        RatingModule.forRoot(),
        AbpModule,
        UtilsModule,
        ServiceProxyModule,
        AppCommonModule        
    ],
    declarations: [
        TalentComponent,
        TalentPageComponent,
        FindTalentMapComponent
    ]
})
export class TalentModule {

}