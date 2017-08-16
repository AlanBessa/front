import { Component, OnInit, Injector, ViewChild, AfterViewInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from "shared/common/app-component-base";
import { ActivatedRoute, Router } from "@angular/router";
import { InterestCenterDto, WorbbiorServiceProxy, WorbbiorProfileDto, ActivityServiceProxy, ActivityDto, UserActivityInput, ListResultDtoOfUserActivityInput, InterestCenterForActivityDto } from "shared/service-proxies/service-proxies";
import { AppConsts } from "shared/AppConsts";
import { DayOfWeek, CancellationPolicy, UnitMeasure } from "shared/AppEnums";
import { AppSessionService } from "shared/common/session/app-session.service";
import { Ng2ImageGalleryComponent } from 'ng2-image-gallery';
import { Angulartics2 } from 'angulartics2';
import { MetaService } from '@nglibs/meta';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { SendReportModalComponent } from '@app/worbbior/page/send-report-modal.component';
import { CreateOrEditUserActivityModalComponent } from '@app/worbbior/edit-profile/create-or-edit-user-activity-modal.component';
declare const FB: any;

@Component({
  templateUrl: './activity-page.component.html',
  animations: [appModuleAnimation()]
})

export class ActivityPageComponent extends AppComponentBase implements AfterViewInit {

  @ViewChild('gallery') gallery: Ng2ImageGalleryComponent;
  @ViewChild('sendReportModal') sendReportModal: SendReportModalComponent;
  @ViewChild('createOrEditUserActivityModal') createOrEditUserActivityModal: CreateOrEditUserActivityModalComponent;

  public worbbiorPerfilCarregado: boolean = false;
  public similarActivityCarregado: boolean = false;
  public atividadeCarregado: boolean = false;

  public activityUserId: number;
  public DayOfWeek: typeof DayOfWeek = DayOfWeek;
  public CancellationPolicy: typeof CancellationPolicy = CancellationPolicy;
  public UnitMeasure: typeof UnitMeasure = UnitMeasure;
  public activityUser: UserActivityInput;

  public worbbiorProfile: WorbbiorProfileDto;
  public whatsappLink: SafeUrl = "";
  public showLoginRegister:boolean = false;

  public worbbiorId:number;

  public isMyActivity:boolean = false;

  public searchBanner: string = "/assets/metronic/worbby/global/img/worbby-pattern.png";
  public loading: string = "assets/metronic/worbby/global/img/loading2.gif";

  public similarActivityList: UserActivityInput[] = [];

  public tooltipPoliticaCancelamento: string = "<strong>Superflexível:</strong> 100% de reembolso do valor da tarefa até 4 horas antes da hora prevista.<br /><br /> <strong>Flexível:</strong> 100% de reembolso do valor da tarefa até 24 horas antes da data prevista.<br /><br /> <strong>Moderada:</strong> 50% de reembolso do valor da tarefa até 48 horas da data prevista.<br /><br /> <strong>Rígida:</strong> 50% de reembolso do valor da tarefa até 5 dias (120 horas) antes da data prevista.";

  public listInterestCenter: any[] = [];

  constructor(
    injector: Injector,
    private _activatedRoute: ActivatedRoute,
    private _activityService: ActivityServiceProxy,
    private _worbbiorService: WorbbiorServiceProxy,
    private metaService: MetaService,
    private _appSessionService: AppSessionService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private angulartics2: Angulartics2,
  ) {
    super(injector);
  }

  ngOnInit() {
    this._activatedRoute.params.subscribe(params => {
      this.activityUserId = Number(this._activatedRoute.snapshot.params['activity'].slice(0, this._activatedRoute.snapshot.params['activity'].indexOf("-")));

      this.worbbiorPerfilCarregado = false;
      this.atividadeCarregado = false;
      this.similarActivityCarregado = false;

      this.worbbiorProfile = undefined;
      this.activityUser = undefined;
      this.similarActivityList = [];

      this.getActivity();
    });
  }

  ngAfterViewInit(): void {
    this.getInterestCenters();
  }

  openGallery(): void {
    this.gallery.openLightboxGallery(0);
  }

  updateActivity(): void {
      this.createOrEditUserActivityModal.show(new UserActivityInput(this.activityUser));
  }

  getPreviewWorbbiorProfile(worbbiorId: number): void {
    this._worbbiorService.getPreviewWorbbiorProfile(worbbiorId).subscribe((result) => {
      this.worbbiorProfile = result;

      this.getPictureByGuid(this.worbbiorProfile.worbbior.userPictureId).then((result) => {
        if (!this.isNullOrEmpty(result)) {
          this.worbbiorProfile.worbbior.userPicture = result;
        } else {
          this.worbbiorProfile.worbbior.userPicture = AppConsts.defaultProfilePicture;
        }

        this.worbbiorPerfilCarregado = true;
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

      this.whatsappLink = this.sanitizer.bypassSecurityTrustUrl("whatsapp://send?text=" + this.activityUser.title + " - " + AppConsts.appBaseUrl + "/publico/atividade/" + this.activityUser.id + "-" + this.activityUser.title);

      this.metaService.setTitle(this.activityUser.title);
      this.metaService.setTag("og:description", this.activityUser.description);
      this.metaService.setTag("og:image", AppConsts.appBaseUrl + "/assets/metronic/worbby/global/img/facebok-share.jpg");
      this.metaService.setTag("og:title", this.activityUser.title);
      this.metaService.setTag("og:url", AppConsts.appBaseUrl + "/publico/atividade/" + this.activityUser.id + "-" + this.activityUser.title);
    }, (error) => {
      console.log(error);
    });
  }

  getActivity(): void {
    console.log(this.activityUserId);
    this._activityService.getUserActivity(this.activityUserId, undefined).subscribe((result) => {
      this.activityUser = result;
      this.isMyActivity = this.activityUser.userId == abp.session.userId;

      let interestCenterParentController: any;

      this.activityUser.listInterestCenter.items.forEach(element => {
        if(interestCenterParentController == undefined) {
          this.listInterestCenter.push(element);

          interestCenterParentController = element;
        }        
        else if(element.parentId != interestCenterParentController.parentId) {
          this.listInterestCenter.push(element);

          interestCenterParentController = element;
        } 
      });      

      var filter = '{"filters":[';

      this.activityUser.evaluation.evaluations.items.forEach(element => {
        this.getPictureByGuid(element.profilePictureId).then((result) => {
          if (!this.isNullOrEmpty(result)) {
            element.userPicture = result;
          } else {
            element.userPicture = AppConsts.defaultProfilePicture;
          }
        });
      });

      this.atividadeCarregado = true;

      this.getPictureByGuid(this.activityUser.featuredImageId).then((result) => {
        if (!this.isNullOrEmpty(result)) {
          this.activityUser.featuredImage = result;
        } else {
          this.activityUser.featuredImage = this.searchBanner;
        }
      });

      this.activityUser.listGalleryActivity.items.forEach(element => {
        var image = new Image();
        if (element.galleryPictureId) {
          this.getPictureByGuid(element.galleryPictureId).then((result) => {
            element.image = result;
            element.thumbnail = result;
          });
        }
      });

      this._worbbiorService.getWorbbiorByUserId(this.activityUser.userId).subscribe((result) => {
        let worbbior = result;
        this.worbbiorId = worbbior.id

        this.getPreviewWorbbiorProfile(worbbior.id);
      });

      for (let i = 0; i < this.activityUser.listInterestCenter.items.length; i++) {
        if (i == 0) {
          filter = filter + '{"interestcenterid":"' + this.activityUser.listInterestCenter.items[i].id + '", "interestcenterparentid":"' + this.activityUser.listInterestCenter.items[i].parentId + '"}';
        }
        else {
          filter = filter + ',{"interestcenterid":"' + this.activityUser.listInterestCenter.items[i].id + '", "interestcenterparentid":"' + this.activityUser.listInterestCenter.items[i].parentId + '"}';
        }
      }

      filter = filter + ']}';

      this._activityService.getUsersActivityByActivityId(this.activityUser.activityId, filter, this.activityUser.id).subscribe((result: ListResultDtoOfUserActivityInput) => {
        this.similarActivityList = result.items;

        this.similarActivityList.forEach(element => {
          this.getPictureByGuid(element.featuredImageId).then((result) => {
            if (!this.isNullOrEmpty(result)) {
              element.featuredImage = result;
            }
            else {
              element.featuredImage = this.searchBanner;
            }
          });
        });

        this.similarActivityCarregado = true;
      });
    });
  }

  goToActivityPage(userId: number, userActivityId: number, userActivityName: string): void {
    let url = userActivityId + "-" + this.changeSpecialCharacterToNormalCharacter(userActivityName.replace(/\s+/g, '-').toLowerCase());
    this.router.navigate(["/publico/atividade/", url]);
  }

  goWorbbiorPage(worbbior: WorbbiorProfileDto): void {
    this.router.navigate(['/publico/worbbior/pagina/' + this.changeSpecialCharacterToNormalCharacter((worbbior.worbbior.slug).toLocaleLowerCase())]);
  }

  navigateToFindATalent(interestCenterId: number, interestCenterChildId: number, titulo: string): void {
    this.router.navigate(['/talentos/' + interestCenterId, { 'interestCenterChildId': interestCenterChildId, 'filter': titulo }]);
  }

  offertTask(activityUser: UserActivityInput): void {
    if (abp.session.userId) {
      if (activityUser.userId == abp.session.userId) {
        this.message.error('Você não pode ofertar uma tarefa para si mesmo!', 'Ops! Algo deu errado.')
          .done(() => { });
      }
      else {
        if (this._appSessionService.userRoleName == 'Worbbior') {
          this.message.confirm(
            "", "Deseja  alterar o seu prefil para o worbbient?",
            isConfirmed => {
              if (isConfirmed) {
                this._appSessionService.userRoleName = "Worbbient";
                setTimeout(
                  function () {
                    location.href = "/postar-tarefa/" + activityUser.id;
                  }, 500);
              }
            });
        }
        else if (this._appSessionService.userRoleName == 'Worbbient') {
          this._appSessionService.userRoleName = "Worbbient";
          this.router.navigate(['/postar-tarefa', { 'activityUserId': activityUser.id }]);
        }
      }
    }else{
        this.showLoginRegister = true; 
    }   
  }

  private getInterestCenters(): void {
      if(this.appSession.interestCentersTopLevel.length == 0) {
          this.getInterestCentersTopLevel();
      }
  }

  shareButtonClick(name: string): void {
    this.angulartics2.eventTrack.next({
      action: 'Compartilharmento da atividade do Worbbior',
      properties: {
        category: name,
        label: AppConsts.appBaseUrl + "/publico/atividade/" + this.activityUser.id + "-" + this.activityUser.title
      }
    });
  }  

  sharedFacebook(): void {
      FB.ui({
          method: 'feed',
          link: AppConsts.appBaseUrl + "/publico/atividade/" + this.activityUser.id + "-" + this.activityUser.title,
          picture: AppConsts.appBaseUrl + '/assets/metronic/worbby/global/img/Tarefa-na-worbby-facebook.jpg',
          name: this.activityUser.title,
          description: this.activityUser.description
      }, function(response){
          console.log(response);
      });

    this.angulartics2.eventTrack.next({
      action: 'Compartilharmento da atividade do Worbbior',
      properties: {
         category: 'Facebook',
        label: AppConsts.appBaseUrl + "/publico/atividade/" + this.activityUser.id + "-" + this.activityUser.title
      }
    });
  }

  sendReport(): void {
    this.sendReportModal.show();
  }

  endorse(): void {
    //var stringRoute = '/endorsement'
    this.router.navigate(['/publico/endosso', { 'userId': this.worbbiorProfile.worbbior.userId }]);
  }

  goToInterestCenterPage(interestCenter:InterestCenterForActivityDto){
    let url = interestCenter.parentId + "-" + this.changeSpecialCharacterToNormalCharacter(interestCenter.parentDisplayName.toLowerCase())
    this.router.navigate(['/centro-interesse', url]);
  }
}
