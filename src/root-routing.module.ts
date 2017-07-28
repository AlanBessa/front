import { NgModule } from '@angular/core';
import { 
    Routes,
    RouterModule, 
    Router, 
    Event as RouterEvent,
    NavigationStart,
    NavigationEnd,
    NavigationCancel,
    NavigationError
    
} from '@angular/router';
import { RootComponent } from './root.component';
import { MetaModule } from '@nglibs/meta';
import { Angulartics2Module, Angulartics2GoogleAnalytics } from 'angulartics2';

const routes: Routes = [
    {
        path: 'talentos',
        loadChildren: 'app/find-talent/talent.module#TalentModule', //Lazy load find talent module  
        data: { preload: true }
    },
    {
        path: 'publico',
        loadChildren: 'app/public/public.module#PublicModule', //Lazy load public module
        data: { preload: true }
    },
    {
        path: 'conta',
        loadChildren: 'app/account/account.module#AccoutModule', //Lazy load account module
        data: { preload: true }
    },
    {
        path: 'worbbior',
        loadChildren: 'app/worbbior/worbbior.module#WorbbiorModule', //Lazy load worbbior module
        data: { preload: true }
    },
    {
        path: 'worbbient',
        loadChildren: 'app/worbbient/worbbient.module#WorbbientModule', //Lazy load worbbient module
        data: { preload: true }
    },
    {
        path: 'home',
        loadChildren: 'app/home/home.module#HomeModule', //Lazy load home module
        data: { preload: true }
    },
    { path: '', redirectTo: 'home', pathMatch: 'full' },


    { path: 'login', redirectTo: '/conta/entrar', pathMatch: 'full' },
    { path: 'entrar', redirectTo: '/conta/entrar', pathMatch: 'full' },
    { path: 'register/:roleName', redirectTo: '/conta/registrar/:roleName', pathMatch: 'full', },
    { path: 'registrar/:roleName', redirectTo: '/conta/registrar/:roleName', pathMatch: 'full', },
    { path: 'forgot-password', redirectTo: '/conta/esqueceu-a-sua-senha', pathMatch: 'full' },
    { path: 'esqueceu-a-sua-senha', redirectTo: '/conta/esqueceu-a-sua-senha', pathMatch: 'full' },
    { path: 'reset-password', redirectTo: '/conta/trocar-senha' + location.search, pathMatch: 'full' },
    { path: 'trocar-senha', redirectTo: '/conta/trocar-senha' + location.search, pathMatch: 'full' },
    { path: 'email-activation', redirectTo: '/conta/ativacao-de-email', pathMatch: 'full' },
    { path: 'ativacao-de-email', redirectTo: '/conta/ativacao-de-email', pathMatch: 'full' },
    { path: 'confirm-email', redirectTo: '/conta/confirmar-email' + location.search, pathMatch: 'full' },
    { path: 'confirmar-email', redirectTo: '/conta/confirmar-email' + location.search, pathMatch: 'full' },
    { path: 'endorsement', redirectTo: '/publico/endosso', pathMatch: 'full' },
    { path: 'endosso', redirectTo: '/publico/endosso', pathMatch: 'full' },
    { path: 'endosso-sucesso', redirectTo: '/publico/endosso-sucesso', pathMatch: 'full' },
    { path: 'endorsement-success', redirectTo: '/publico/endosso-sucesso', pathMatch: 'full' },
    { path: 'suggest-activities', redirectTo: '/publico/sugerir-atividades', pathMatch: 'full' },
    { path: 'sugerir-atividades', redirectTo: '/publico/sugerir-atividades', pathMatch: 'full' },
    { path: 'centro-interesse/:interestCenterId', redirectTo: '/publico/centro-interesse/:interestCenterId', pathMatch: 'full' },
    { path: 'interest-center/:interestCenterId', redirectTo: '/publico/centro-interesse/:interestCenterId', pathMatch: 'full' },
    { path: 'sobre', redirectTo: '/publico/sobre', pathMatch: 'full' },
    { path: 'about-worbby', redirectTo: '/publico/sobre', pathMatch: 'full' },
    { path: 'fale-com-o-Worbby', redirectTo: '/publico/fale-com-o-Worbby', pathMatch: 'full' },
    { path: 'contact', redirectTo: '/publico/fale-com-o-Worbby', pathMatch: 'full' },
    { path: 'perguntas-frequentes', redirectTo: '/publico/perguntas-frequentes', pathMatch: 'full' },
    { path: 'faq', redirectTo: '/publico/perguntas-frequentes', pathMatch: 'full' },
    { path: 'perguntas-frequentes/:tab', redirectTo: '/publico/perguntas-frequentes/:tab', pathMatch: 'full' },
    { path: 'faq/:tab', redirectTo: '/publico/perguntas-frequentes/:tab', pathMatch: 'full' },
    { path: 'como-funciona', redirectTo: '/publico/como-funciona', pathMatch: 'full' },
    { path: 'how-does-it-work', redirectTo: '/publico/como-funciona', pathMatch: 'full' },
    { path: 'como-funciona-w', redirectTo: '/publico/como-funciona-w', pathMatch: 'full' },
    { path: 'how-does-it-work-w', redirectTo: '/publico/como-funciona-w', pathMatch: 'full' },
    { path: 'seguro', redirectTo: '/publico/seguro', pathMatch: 'full' },
    { path: 'insurance', redirectTo: '/publico/seguro', pathMatch: 'full' },
    { path: 'postar-tarefa', redirectTo: '/publico/postar-tarefa', pathMatch: 'full' },
    { path: 'post-a-task', redirectTo: '/publico/postar-tarefa', pathMatch: 'full' },
    { path: 'postar-tarefa/:activityUserId', redirectTo: '/publico/postar-tarefa/:activityUserId', pathMatch: 'full' },
    { path: 'post-a-task/:activityUserId', redirectTo: '/publico/postar-tarefa/:activityUserId', pathMatch: 'full' },
    { path: 'worbby-task/:worbbyTaskId', redirectTo: '/publico/worbby-task/:worbbyTaskId', pathMatch: 'full' },
    { path: 'suporte', redirectTo: '/publico/suporte', pathMatch: 'full' },
    { path: 'support', redirectTo: '/publico/suporte', pathMatch: 'full' },
    { path: 'termos-de-uso', redirectTo: '/publico/termos-de-uso', pathMatch: 'full' },
    { path: 'terms-and-conditions', redirectTo: '/publico/termos-de-uso', pathMatch: 'full' },
    { path: 'tarefas', redirectTo: '/publico/tarefas', pathMatch: 'full' },
    { path: 'find-a-tasks', redirectTo: '/publico/tarefas', pathMatch: 'full' },
    //{ path: 'talentos', redirectTo: '/publico/talentos', pathMatch: 'full' },
    { path: 'find-a-talents', redirectTo: 'talentos', pathMatch: 'full' },
    { path: 'talentos/:interestCenterId', redirectTo: '/talentos/:interestCenterId', pathMatch: 'full' },
    { path: 'find-a-talents/:interestCenterId', redirectTo: '/talentos/:interestCenterId', pathMatch: 'full' },
    { path: 'talentos-t/:filter', redirectTo: '/talentos/t/:filter', pathMatch: 'full' },
    { path: 'find-a-talents-t/:filter', redirectTo: '/talentos/t/:filter', pathMatch: 'full' },
    { path: 'talentos-f/:feature', redirectTo: '/talentos/f/:feature', pathMatch: 'full' },
    { path: 'find-a-talents-f/:feature', redirectTo: '/talentos/f/:feature', pathMatch: 'full' },
    { path: 'seja-um-worbbior', redirectTo: '/publico/seja-um-worbbior', pathMatch: 'full' },
    { path: 'become-a-worbbior', redirectTo: '/publico/seja-um-worbbior', pathMatch: 'full' },
    { path: 'worbbior/pagina/:worbbiorId', redirectTo: '/publico/worbbior/pagina/:worbbiorId', pathMatch: 'full' },
    { path: 'worbbior/page/:worbbiorId', redirectTo: '/publico/worbbior/pagina/:worbbiorId', pathMatch: 'full' },
];

@NgModule({
    imports: [
        MetaModule.forRoot(),
        RouterModule.forRoot(
            routes,
            { enableTracing: false } // <-- debugging purposes only
        ),
        Angulartics2Module.forRoot([ Angulartics2GoogleAnalytics ])
    ],
    exports: [RouterModule],
    providers: []
})
export class RootRoutingModule {
    constructor(private router: Router) {
        router.events.subscribe((event: RouterEvent) => {
            this.navigationInterceptor(event);
        });
    }

    // Shows and hides the loading spinner during RouterEvent changes
    navigationInterceptor(event: RouterEvent): void {
        if (event instanceof NavigationStart) {
            $("body").scrollTop(0);
            $(".page-loading").show();
        }
        if (event instanceof NavigationEnd) {
            $(".page-loading").hide();
            //$(".page-loading").show();
        }

        // Set loading state to false in both of the below events to hide the spinner in case a request fails
        if (event instanceof NavigationCancel) {
            //$(".page-loading").show();
        }
        if (event instanceof NavigationError) {
            //$(".page-loading").show();
        }
    }
}