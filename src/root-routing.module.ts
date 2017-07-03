import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router, NavigationEnd } from '@angular/router';
import { RootComponent } from './root.component';

const routes: Routes = [
    {
        path: '',
        loadChildren: 'app/public/public.module#PublicModule', //Lazy load main module
        data: { preload: true }
    },
    { path: 'home', redirectTo: '', pathMatch: 'full' },
    {
        path: 'conta',
        loadChildren: 'app/account/account.module#AccoutModule', //Lazy load account module
        data: { preload: true }
    },
    { path: 'login', redirectTo: '/conta/entrar', pathMatch: 'full' },
    { path: 'entrar', redirectTo: '/conta/entrar', pathMatch: 'full' },
    { path: 'register/:roleName', redirectTo: '/conta/registrar/:roleName', pathMatch: 'full', },
    { path: 'registrar/:roleName', redirectTo: '/conta/registrar/:roleName', pathMatch: 'full', },
    { path: 'forgot-password', redirectTo: '/conta/esqueceu-a-sua-senha', pathMatch: 'full' },
    { path: 'esqueceu-a-sua-senha', redirectTo: '/conta/esqueceu-a-sua-senha', pathMatch: 'full' },
    { path: 'reset-password', redirectTo: '/conta/trocar-senha', pathMatch: 'full' },
    { path: 'trocar-senha', redirectTo: '/conta/trocar-senha', pathMatch: 'full' },
    { path: 'email-activation', redirectTo: '/conta/ativacao-de-email', pathMatch: 'full' },
    { path: 'ativacao-de-email', redirectTo: '/conta/ativacao-de-email', pathMatch: 'full' },
    { path: 'confirm-email', redirectTo: '/conta/confirmar-email', pathMatch: 'full' },
    { path: 'confirmar-email', redirectTo: '/conta/confirmar-email', pathMatch: 'full' },
    // {
    //     path: 'worbbior',
    //     loadChildren: 'app/worbbior/worbbior.module#WorbbiorModule', //Lazy load worbbior module
    //     data: { preload: true }
    // },
    // {
    //     path: 'worbbient',
    //     loadChildren: 'app/worbbient/worbbient.module#WorbbientModule', //Lazy load worbbient module
    //     data: { preload: true }
    // }
];

@NgModule({
    imports: [
        RouterModule.forRoot(
            routes,
            { enableTracing: true } // <-- debugging purposes only
        )
    ],
    exports: [RouterModule],
    providers: []
})
export class RootRoutingModule {
    constructor(private router: Router) {
        router.events.subscribe((event: NavigationEnd) => {
        });
    }
}