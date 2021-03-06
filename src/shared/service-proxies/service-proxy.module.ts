﻿import { NgModule } from '@angular/core';

import * as ApiServiceProxies from './service-proxies';

@NgModule({
    providers: [
        ApiServiceProxies.AuditLogServiceProxy,
        ApiServiceProxies.CachingServiceProxy,
        ApiServiceProxies.ChatServiceProxy,
        ApiServiceProxies.CommonLookupServiceProxy,
        ApiServiceProxies.EditionServiceProxy,
        ApiServiceProxies.FriendshipServiceProxy,
        ApiServiceProxies.HostSettingsServiceProxy,
        ApiServiceProxies.LanguageServiceProxy,
        ApiServiceProxies.NotificationServiceProxy,
        ApiServiceProxies.OrganizationUnitServiceProxy,
        ApiServiceProxies.PermissionServiceProxy,
        ApiServiceProxies.ProfileServiceProxy,
        ApiServiceProxies.RoleServiceProxy,
        ApiServiceProxies.SessionServiceProxy,
        ApiServiceProxies.TenantServiceProxy,
        ApiServiceProxies.TenantDashboardServiceProxy,
        ApiServiceProxies.TenantSettingsServiceProxy,
        ApiServiceProxies.TimingServiceProxy,
        ApiServiceProxies.UserServiceProxy,
        ApiServiceProxies.UserLinkServiceProxy,
        ApiServiceProxies.UserLoginServiceProxy,
        ApiServiceProxies.WebLogServiceProxy,
        ApiServiceProxies.AccountServiceProxy,
        ApiServiceProxies.TokenAuthServiceProxy,
        ApiServiceProxies.TenantRegistrationServiceProxy,
        ApiServiceProxies.HostDashboardServiceProxy,
        ApiServiceProxies.PaymentServiceProxy,
        ApiServiceProxies.AddressServiceProxy,
        ApiServiceProxies.EndorsementServiceProxy,
        ApiServiceProxies.WorbbyTaskServiceProxy,
        ApiServiceProxies.GalleryActivityServiceProxy,
        ApiServiceProxies.CieloServiceProxy,
        ApiServiceProxies.EvaluationTypeServiceProxy,
        ApiServiceProxies.EvaluationServiceProxy,
        ApiServiceProxies.WorbbiorServiceProxy,
        ApiServiceProxies.EvaluationValueServiceProxy,
        ApiServiceProxies.EmailingServiceProxy,
        ApiServiceProxies.InterestCenterServiceProxy,
        ApiServiceProxies.ActivityServiceProxy,
        ApiServiceProxies.AvailabilityServiceProxy,
        ApiServiceProxies.UserDocumentsInfoServiceProxy,
        ApiServiceProxies.BankAccountServiceProxy,
        ApiServiceProxies.BalanceTransferServiceProxy,
        ApiServiceProxies.SaleServiceProxy

    ]
})
export class ServiceProxyModule { }
