import { Component, OnInit, Injector } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from "shared/common/app-component-base";
import { ActivatedRoute } from "@angular/router";
import { WorbbiorServiceProxy, WorbbiorProfileDto, ActivityServiceProxy, ActivityDto, UserActivityInput, ListResultDtoOfUserActivityInput } from "shared/service-proxies/service-proxies";
import { AppConsts } from "shared/AppConsts";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { MetaService } from "@nglibs/meta";
import { DayOfWeek, CancellationPolicy, UnitMeasure } from "shared/AppEnums";

@Component({
  templateUrl: './activity-page.component.html',
  animations: [appModuleAnimation()]
})

export class ActivityPageComponent extends AppComponentBase implements OnInit {

  public worbbiorPerfilCarregado: boolean = false;
  public similarActivityCarregado: boolean = false;
  public atividadeCarregado:boolean = false;

  public activityUserId: number;
  public DayOfWeek: typeof DayOfWeek = DayOfWeek;
  public CancellationPolicy: typeof CancellationPolicy = CancellationPolicy;
  public UnitMeasure: typeof UnitMeasure = UnitMeasure;
  public activityUser: UserActivityInput;

  public worbbiorProfile: WorbbiorProfileDto;
  public whatsappLink: SafeUrl = "";

  public teste: number = 5;

  public searchBanner: string = "/assets/metronic/worbby/global/img/exemplo.jpg";
  public loading: string;

  public similarActivityList: UserActivityInput[] = [];

  constructor(
    injector: Injector,
    private _activatedRoute: ActivatedRoute,
    private _activityService: ActivityServiceProxy,
    private _worbbiorService: WorbbiorServiceProxy,
    private metaService: MetaService,
    private sanitizer: DomSanitizer
  ) {
    super(injector);
  }

  ngOnInit() {
    this.activityUserId = Number(this._activatedRoute.snapshot.params['activity'].slice(0, this._activatedRoute.snapshot.params['activity'].indexOf("-")));
    this.loading = "assets/metronic/worbby/global/img/loading2.gif";

    this.worbbiorPerfilCarregado = false;
    this.atividadeCarregado = false;
    this.similarActivityCarregado = false;

    this.getActivity();
  }

  getPreviewWorbbiorProfile(worbbiorId:number): void {
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

      this.whatsappLink = this.sanitizer.bypassSecurityTrustUrl("whatsapp://send?text=Veja as habilidades de " + this.worbbiorProfile.worbbior.displayName + " - " + AppConsts.appBaseUrl + '/worbbior/page/' + this.worbbiorProfile.worbbior.id + "-" + this.worbbiorProfile.worbbior.displayName);

      this.metaService.setTitle("Veja as habilidades de " + this.worbbiorProfile.worbbior.displayName);
      this.metaService.setTag("og:description", "Contrate uma tarefa com esse e outros talentos na Worbby. São diversas opções para facilitar o seu dia a dia.");
      this.metaService.setTag("og:image", AppConsts.appBaseUrl + "/assets/metronic/worbby/global/img/facebok-share.jpg");
      this.metaService.setTag("og:title", "Veja as habilidades de " + this.worbbiorProfile.worbbior.displayName);
      this.metaService.setTag("og:url", AppConsts.appBaseUrl + "/worbbior/page/" + this.worbbiorProfile.worbbior.id + "-" + this.worbbiorProfile.worbbior.displayName);
    }, (error) => {
      console.log(error);
    });
  }

  getActivity(): void {
    this._activityService.getUserActivity(this.activityUserId).subscribe((result) => {
      this.activityUser = result;
      var filter = '{"filters":[';

      this.activityUser.evaluation.evaluations.items.forEach(element => {
        this.getPictureByGuid(element.profilePictureId).then((result) => {
          if (!this.isNullOrEmpty(result)) {
            element.userPicture = result;
          } else {
            element.userPicture = AppConsts.defaultProfilePicture;
          }
        });

        this.atividadeCarregado = true;
      }); 
      
      for(let i = 0; i < this.activityUser.listInterestCenter.items.length; i++) {
        if(i == 0) {
          filter = filter + '{"interestcenterid":"' + this.activityUser.listInterestCenter.items[i].id + '", "interestcenterparentid":"' + this.activityUser.listInterestCenter.items[i].parentId + '"}';
        }
        else {
          filter = filter + ',{"interestcenterid":"' + this.activityUser.listInterestCenter.items[i].id + '", "interestcenterparentid":"' + this.activityUser.listInterestCenter.items[i].parentId + '"}';
        }
      }

      filter = filter + ']}';

      
      this._worbbiorService.getWorbbiorByUserId(this.activityUser.userId).subscribe((result) => {
        let worbbior = result;

        this.getPreviewWorbbiorProfile(worbbior.id);
      });

      this._activityService.getUsersActivityByActivityId(this.activityUser.activityId, filter, this.activityUser.id).subscribe((result: ListResultDtoOfUserActivityInput) => {
        this.similarActivityList = result.items;
        this.similarActivityCarregado = true;
      });
    });
  }

  goToActivityPage(userId:number, userActivityId:number, userActivityName:string): void {
    let url = "/atividade/" + userActivityId + "-" + userActivityName.replace(/\s+/g, '-').toLowerCase();
  }
}
