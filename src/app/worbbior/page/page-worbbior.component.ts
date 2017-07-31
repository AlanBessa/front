import { Component, Injector, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { UserActivityInput, WorbbiorServiceProxy, WorbbiorProfileDto, GalleryActivityDto, GalleryActivityServiceProxy, ListResultDtoOfGalleryActivityDto } from '@shared/service-proxies/service-proxies';
import { DayOfWeek, AdministrativeAreas, KeyValueItem, WorbbiorState, CancellationPolicy, UnitMeasure } from '@shared/AppEnums';
import { SendReportModalComponent } from '@app/worbbior/page/send-report-modal.component';
import { RatingModule } from "ngx-bootstrap";
import { AppConsts } from '@shared/AppConsts';
import { MetaService } from '@nglibs/meta';
import { AppSessionService } from '@shared/common/session/app-session.service'
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
declare const FB: any; //Facebook API

@Component({
    templateUrl: './page-worbbior.component.html',
    animations: [appModuleAnimation()]
})


export class PageWorbbiorComponent extends AppComponentBase implements AfterViewInit, OnInit {

    @ViewChild('sendReportModal') sendReportModal: SendReportModalComponent;

    public active: boolean = false;
    public worbbiorId: number;
    public worbbiorProfile: WorbbiorProfileDto;
    public DayOfWeek: typeof DayOfWeek = DayOfWeek;
    public CancellationPolicy: typeof CancellationPolicy = CancellationPolicy;
    public UnitMeasure: typeof UnitMeasure = UnitMeasure;
    public galleryImages: GalleryActivityDto[];
    public whatsappLink:SafeUrl = "";
    public showLoginRegister:boolean = false;

    public tooltipPoliticaCancelamento: string = "<strong>Superflexível:</strong> 100% de reembolso do valor da tarefa até 4 horas antes da hora prevista.<br /><br /> <strong>Flexível:</strong> 100% de reembolso do valor da tarefa até 24 horas antes da data prevista.<br /><br /> <strong>Moderada:</strong> 50% de reembolso do valor da tarefa até 48 horas da data prevista.<br /><br /> <strong>Rígida:</strong> 50% de reembolso do valor da tarefa até 5 dias (120 horas) antes da data prevista.";

    constructor(
        injector: Injector,
        private _activatedRoute: ActivatedRoute,
        private _worbbiorService: WorbbiorServiceProxy,
        private router: Router,
        private _galleryActivityService: GalleryActivityServiceProxy,
        private metaService: MetaService,
        private _appSessionService:AppSessionService,
        private sanitizer:DomSanitizer
    ) {
        super(injector);
    }

    ngOnInit() {
        this.worbbiorId = this._activatedRoute.snapshot.params['worbbiorId'].slice(0, this._activatedRoute.snapshot.params['worbbiorId'].indexOf("-"));

        if(this._appSessionService.worbbiorId == this.worbbiorId){
            this.getPreviewWorbbiorProfile();
        }else{
            this.getWorbbiorProfile();
        }
        
    }

    ngAfterViewInit(): void {
        $("body").scrollTop(0);
        $(".page-loading").hide();    
    }

    getWorbbiorProfile():void{
        this._worbbiorService.getWorbbiorProfile(this.worbbiorId).subscribe((result) => {
            this.worbbiorProfile = result;
            
            this.active = true;
            this.getLocation();

            this.getPictureByGuid(this.worbbiorProfile.worbbior.userPictureId).then((result) => {
                if(!this.isNullOrEmpty(result)){
                    this.worbbiorProfile.worbbior.userPicture = result;
                }else{
                    this.worbbiorProfile.worbbior.userPicture = AppConsts.defaultProfilePicture;
                }
            });
            this.worbbiorProfile.userActivities.items.forEach(element => {
                element.listGalleryActivity.items.forEach(element => {
                    var image = new Image();
                    if (element.galleryPictureId) {
                        this.getPictureByGuid(element.galleryPictureId).then((result) => {
                            element.image = result;
                            element.thumbnail = result;
                        });
                    } 
                });
                
                element.evaluation.evaluations.items.forEach(element => {
                    this.getPictureByGuid(element.profilePictureId).then((result) => {
                        element.userPicture = result ? result : AppConsts.defaultProfilePicture;;
                    });
                })
            });
            this.whatsappLink = this.sanitizer.bypassSecurityTrustUrl("whatsapp://send?text=Veja as habilidades de " + this.worbbiorProfile.worbbior.displayName + " - " + AppConsts.appBaseUrl + '/worbbior/page/' + this.worbbiorProfile.worbbior.id + "-" + this.worbbiorProfile.worbbior.displayName); 
            

            this.metaService.setTitle("Veja as habilidades de " + this.worbbiorProfile.worbbior.displayName);
            this.metaService.setTag("og:description","Contrate uma tarefa com esse e outros talentos na Worbby. São diversas opções para facilitar o seu dia a dia.");
            this.metaService.setTag("og:image", AppConsts.appBaseUrl + "/assets/metronic/worbby/global/img/facebok-share.jpg");
            this.metaService.setTag("og:title","Veja as habilidades de " + this.worbbiorProfile.worbbior.displayName);
            this.metaService.setTag("og:url", AppConsts.appBaseUrl + "/worbbior/page/" + this.worbbiorProfile.worbbior.id + "-" + this.worbbiorProfile.worbbior.displayName);
        });
    }

    getPreviewWorbbiorProfile():void{
        this._worbbiorService.getPreviewWorbbiorProfile(this.worbbiorId).subscribe((result) => {
            this.worbbiorProfile = result;

            this.active = true;
            this.getLocation();

            this.getPictureByGuid(this.worbbiorProfile.worbbior.userPictureId).then((result) => {
                if(!this.isNullOrEmpty(result)){
                    this.worbbiorProfile.worbbior.userPicture = result;
                }else{
                    this.worbbiorProfile.worbbior.userPicture = AppConsts.defaultProfilePicture;
                }
            });
            this.worbbiorProfile.userActivities.items.forEach(element => {
                element.listGalleryActivity.items.forEach(element => {
                    var image = new Image();
                    if (element.galleryPictureId) {
                        this.getPictureByGuid(element.galleryPictureId).then((result) => {
                            element.image = result;
                            element.thumbnail = result;
                        });
                    } 
                });
                element.evaluation.evaluations.items.forEach(element => {
                    this.getPictureByGuid(element.profilePictureId).then((result) => {
                        element.userPicture = result;
                    });
                })
            });
            
            this.whatsappLink = this.sanitizer.bypassSecurityTrustUrl("whatsapp://send?text=Veja as habilidades de " + this.worbbiorProfile.worbbior.displayName + " - " + AppConsts.appBaseUrl + '/worbbior/page/' + this.worbbiorProfile.worbbior.id + "-" + this.worbbiorProfile.worbbior.displayName); 
            

            this.metaService.setTitle("Veja as habilidades de " + this.worbbiorProfile.worbbior.displayName);
            this.metaService.setTag("og:description","Contrate uma tarefa com esse e outros talentos na Worbby. São diversas opções para facilitar o seu dia a dia.");
            this.metaService.setTag("og:image", AppConsts.appBaseUrl + "/assets/metronic/worbby/global/img/facebok-share.jpg");
            this.metaService.setTag("og:title","Veja as habilidades de " + this.worbbiorProfile.worbbior.displayName);
            this.metaService.setTag("og:url", AppConsts.appBaseUrl + "/worbbior/page/" + this.worbbiorProfile.worbbior.id + "-" + this.worbbiorProfile.worbbior.displayName);
        });
    }

    getLocation(): void {
        let self = this;
        setTimeout(
            function(){ 
                 self._activatedRoute.fragment.subscribe(f => {
                    self.goTo(f);
                    console.log(f);
                }); 
            },
        1000);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
            this.worbbiorProfile.worbbior.distance = Math.round(this.distance(Number(this.worbbiorProfile.address.latitude), Number(this.worbbiorProfile.address.longitude), position.coords.latitude, position.coords.longitude));
                
            });
        }
    }

    commentsOnClick(event): void {
        var target = event.target || event.srcElement || event.currentTarget;
        $(target).toggleClass("active");
        $(target).parent().parent().parent().parent().parent().find(".activity-comments-list").toggle();
        $(target).parent().parent().parent().parent().parent().find(".activity-comments").toggleClass("active-card");
        // $(target).parent().parent().find(".activity-comments-list").toggle();

    }

    sendReport(): void {
        this.sendReportModal.show();
    }

    endorse(): void {
        //var stringRoute = '/endorsement'
        this.router.navigate(['/publico/endosso', { 'userId': this.worbbiorProfile.worbbior.userId }]);
    }

    task(): void {
        this.router.navigate(['/task']);
    }

    offertTask(activityUser: UserActivityInput): void {
        if(abp.session.userId){
            if(activityUser.userId == abp.session.userId){
                this.message.error('Você não pode ofertar uma tarefa para si mesmo!', 'Ops! Algo deu errado.')
                .done(() => {

                });
            }else{
                if(this._appSessionService.userRoleName == 'Worbbior')
                {
                    this.message.confirm(
                    "", "Deseja  alterar o seu prefil para o worbbient?",
                    isConfirmed => {
                        if (isConfirmed) {
                        this._appSessionService.userRoleName = "Worbbient";
                        setTimeout(
                            function(){ 
                                location.href = "/postar-tarefa/" + activityUser.id;
                            },
                        500);
                        }
                    });

                }else if(this._appSessionService.userRoleName == 'Worbbient'){
                    this._appSessionService.userRoleName = "Worbbient";
                    this.router.navigate(['/postar-tarefa', { 'activityUserId': activityUser.id }]);
                }
            }    
        }else{
            this.showLoginRegister = true;
        }    
    }

    

    sharedFacebook():void {
        FB.ui({
            method: 'feed',
            link: AppConsts.appBaseUrl + '/worbbior/page/' + this.worbbiorProfile.worbbior.id + "-" + this.worbbiorProfile.worbbior.displayName,
            picture: AppConsts.appBaseUrl + '/assets/metronic/worbby/global/img/Tarefa-na-worbby-facebook.jpg',
            name: 'Veja as habilidades de ' + this.worbbiorProfile.worbbior.displayName,
            description: 'Contrate uma tarefa com esse e outros talentos na Worbby. São diversas opções para facilitar o seu dia a dia.'
        }, function(response){
            console.log(response);
        });
    }
}