import { Component, Injector, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { SlickSliderComponent } from '@shared/slick-slider.component';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { InterestCenterServiceProxy, InterestCenterDto, ListResultDtoOfInterestCenterDto, WorbbiorServiceProxy, EntityDtoOfInt64 } from '@shared/service-proxies/service-proxies';
import { HomeReleaseModalComponent } from './home-release-modal.component';
import { Angulartics2 } from 'angulartics2';


@Component({
    templateUrl: './home.component.html',
    styles: ['.find-talent-home-banner{ background: url(/assets/metronic/worbby/global/img/banner-' + (Math.floor(Math.random() * (11 - 1 + 1)) + 1) + '.jpg);}'],
    animations: [appModuleAnimation()]
})

export class HomeComponent extends AppComponentBase implements AfterViewInit {

    @ViewChild('homeReleaseModal') homeReleaseModal: HomeReleaseModalComponent;

    public interestCenters: InterestCenterDto[] = [];
    public filter:string;

    constructor(
        injector: Injector,
        private router: Router,
        private _interestCenterService: InterestCenterServiceProxy,
        private _appSessionService: AppSessionService,
        private _worbbiorService: WorbbiorServiceProxy,
        private angulartics2: Angulartics2
    ) {
        super(injector);
    }

    ngAfterViewInit(): void {
        $("body").scrollTop(0);
        this.getInterestCenters();
    } 

    ngOnInit() {
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
        this._interestCenterService.getInterestCentersTopLevel().subscribe((result: ListResultDtoOfInterestCenterDto) => {
            this.interestCenters = result.items;

            this.activatedRoute.fragment.subscribe(f => {
                this.goTo(f);
            });

            if(this._appSessionService.firstAccess){
                this.showReleaseModal();
                this._appSessionService.firstAccess = false;
            }
            
        });
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