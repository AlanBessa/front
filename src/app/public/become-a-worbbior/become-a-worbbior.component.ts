import { Component, Injector, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { SlickSliderComponent } from '@shared/slick-slider.component';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { InterestCenterServiceProxy, InterestCenterDto, ListResultDtoOfInterestCenterDto, WorbbiorServiceProxy, EntityDtoOfInt64 } from '@shared/service-proxies/service-proxies';

@Component({
    templateUrl: './become-a-worbbior.component.html',
    animations: [appModuleAnimation()]
})
export class BecomeWorbbiorComponent extends AppComponentBase implements AfterViewInit {

    public filter:string;

    constructor(
        injector: Injector,
        private router: Router,
        private _interestCenterService: InterestCenterServiceProxy,
        public activatedRoute: ActivatedRoute,
        private _appSessionService: AppSessionService,
        private _worbbiorService: WorbbiorServiceProxy
    ) {
        super(injector);
    }

    ngAfterViewInit(): void {
        $("body").scrollTop(0);
        $(".page-loading").hide();
        this.getInterestCenters();
    }

    ngOnDestroy(): void {
        
    }


    private getInterestCenters(): void {
        if(this.interestCentersTopLevel.length == 0){
            this.getInterestCentersTopLeve();
            this.activatedRoute.fragment.subscribe(f => {
                this.goTo(f);
            })   
        }
    }

    becomeWorbbior():void{
        if(abp.session.userId){
            if(!this.permission.isGranted("Pages.Worbbior.SwitchToWorbbientProfile")){
                this.worbbientToWorbbior();
            }else{
                this.router.navigate(['/worbbior/edit-profile']);
            }
        }else{
            this.router.navigate(['/registrar/Worbbior']);
        }
    }

    worbbientToWorbbior():void {
        this.message.confirm(
            "Deseja tornar-se também um worbbior?", "Seja um worbbior!",
            isConfirmed => {
                if (isConfirmed) {
                    
                    this._worbbiorService.worbbientToWorbbior(new EntityDtoOfInt64({ id: abp.session.userId }))
                    .finally(() => {
                    })
                    .subscribe(() => {
                        this.message.custom('Precisamos de mais algumas informações sobre você, preencha os dados na próxima página para ganhar dinheiro oferecendo suas habilidades. Mas atenção, só após completar todos os campos, o seu perfil Worbbior será ativado na plataforma.', 'Falta pouco para você ser um worbbior!', 'assets/common/images/default-profile-picture.png').done(() => {
                            this._appSessionService.userRoleName = "Worbbior";
                            location.href = "/";
                        });
                    });;
                }
            }
        );        
    }
}