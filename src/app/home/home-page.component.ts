import { Component, Injector, AfterViewInit, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { SlickSliderComponent } from '@shared/slick-slider.component';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { WorbbiorServiceProxy, EntityDtoOfInt64 } from '@shared/service-proxies/service-proxies';
import { HomeReleaseModalComponent } from './home-release-modal.component';
import { Angulartics2 } from 'angulartics2';


@Component({
    templateUrl: './home-page.component.html',
    animations: [appModuleAnimation()]
})

export class HomePageComponent extends AppComponentBase implements AfterViewInit {

    @ViewChild('homeReleaseModal') homeReleaseModal: HomeReleaseModalComponent; 

    public filter:string = "";
    public imagemBanner: string = "";
    public isPublic: boolean = false; 

    constructor(
        injector: Injector,
        private router: Router,
        private _appSessionService: AppSessionService,
        private _worbbiorService: WorbbiorServiceProxy,
        private angulartics2: Angulartics2
    ) {
        super(injector);
    }

    ngAfterViewInit(): void {
        $("body").scrollTop(0);
        $(".page-loading").hide();
        this.getInterestCenters();
        this.activatedRoute.fragment.subscribe(f => {
            this.goTo(f);
        });
        
        if(this._appSessionService.firstAccess){
            //this.showReleaseModal();
            this._appSessionService.firstAccess = false;
        }
    } 

    ngOnDestroy(): void {
        
    }

    ngOnInit() {
        this.isPublic = this.appSession.userId == null;

        this.buildIframe();
        if(this.activatedRoute.snapshot.url.join('') == "seja-um-worbbior" || this.activatedRoute.snapshot.url.join('') == "become-a-worbbior"){
            $('body').attr('class', 'worbbior');
            $('.logo-topo').attr('src', '/assets/metronic/worbby/global/img/logo-worbbior-beta.svg');
        }else{
            if(this.appSession.userRoleName == "Worbbior"){
                $('body').attr('class', 'worbbior');
                $('.logo-topo').attr('src', '/assets/metronic/worbby/global/img/logo-worbbior-beta.svg');
            }else{
                $('body').attr('class', 'worbbient');
                $('.logo-topo').attr('src', '/assets/metronic/worbby/global/img/logo-worbbient-beta.svg');
            }
        }

        var resolution = window.screen.width < 768 ? "770" : window.screen.width < 990 ? "1000" : "1910";
        this.imagemBanner = "/assets/metronic/worbby/global/img/home/" + resolution + "/banner-" + (Math.floor(Math.random() * (11 - 1 + 1)) + 1) + ".jpg";
    }

    showReleaseModal():void{
        this.homeReleaseModal.show();
    }

    public buildIframe(): void {
        let div, n, v = document.getElementsByClassName("youtube-player");

        for(n = 0; n < v.length; n++) {
            div = document.createElement("div");

            div.setAttribute("data-id", v[n].getAttribute("data-id"));
            div.setAttribute("data-params", v[n].getAttribute("data-params"));

            div.id = "containerYoutube";
            div.innerHTML = this.createThumb(v[n].getAttribute("data-id"));
            div.onclick = this.createIframe;

            v[n].appendChild(div);
        }
    }

    private createThumb(id): any {
        let thumb = '<img src="/assets/metronic/worbby/global/img/video-worbby-background.jpg">',
            play = '<div class="play"></div>';

        return thumb.replace("ID", id) + play;
    }

    private createIframe(event): any {      

        let div = document.getElementById("containerYoutube");

        var iframe = document.createElement("iframe");
        iframe.setAttribute("src", "https://www.youtube.com/embed/" + div.getAttribute("data-id") + div.getAttribute("data-params"));
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("allowfullscreen", "1");

        div.parentNode.replaceChild(iframe, div);
    }

    public callAnalytics(): void {

        this.angulartics2.eventTrack.next({ 
            action: "Quantidades de cliques no vídeo", 
            properties: { category: 'Video Worbby: Home', 
            label: this._appSessionService.user ? this._appSessionService.user.emailAddress : "Anonimo" } 
        });
    }

    private getInterestCenters(): void {
        if(this.interestCentersTopLevel.length == 0){
            this.getInterestCentersTopLeve();
        }
    }

    public findByTerm(): void {
        this.router.navigate(['/find-a-talents-t', this.filter]);
    }

    public becomeWorbbior(): void {
        if(abp.session.userId) {
            if(!this.permission.isGranted("Pages.Worbbior.SwitchToWorbbientProfile")) {
                this.worbbientToWorbbior();
            }
            else {
                this.router.navigate(['/worbbior/edit-profile']);
            }
        }
        else {
            this.router.navigate(['/registrar/Worbbior']);
        }
    }

    public worbbientToWorbbior(): void {
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