import { Component, OnInit, Injector } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from "shared/common/app-component-base";
import { ActivatedRoute } from "@angular/router";
import { WorbbiorServiceProxy, WorbbiorProfileDto, ActivityServiceProxy, ActivityDto, UserActivityInput } from "shared/service-proxies/service-proxies";
import { AppConsts } from "shared/AppConsts";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { MetaService } from "@nglibs/meta";
import { DayOfWeek } from "shared/AppEnums";

@Component({
  templateUrl: './activity-page.component.html',
  animations: [appModuleAnimation()]
})

export class ActivityPageComponent extends AppComponentBase implements OnInit {

  public active: boolean = false;

  public worbbiorId: number;
  public activityUserId: number;
  public DayOfWeek: typeof DayOfWeek = DayOfWeek;
  public activityUser: UserActivityInput;

  public worbbiorProfile: WorbbiorProfileDto;
  public whatsappLink: SafeUrl = "";

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
    this.worbbiorId = Number(this._activatedRoute.snapshot.params['worbbior'].slice(0, this._activatedRoute.snapshot.params['worbbior'].indexOf("-")));
    this.activityUserId = Number(this._activatedRoute.snapshot.params['activity'].slice(0, this._activatedRoute.snapshot.params['activity'].indexOf("-")));

    this.getPreviewWorbbiorProfile();
    this.getActivity();
  }

  getPreviewWorbbiorProfile(): void {
    this._worbbiorService.getPreviewWorbbiorProfile(this.worbbiorId).subscribe((result) => {
      this.worbbiorProfile = result;

      this.getPictureByGuid(this.worbbiorProfile.worbbior.userPictureId).then((result) => {
        if (!this.isNullOrEmpty(result)) {
          this.worbbiorProfile.worbbior.userPicture = result;
        } else {
          this.worbbiorProfile.worbbior.userPicture = AppConsts.defaultProfilePicture;
        }

        this.active = true;
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
    });
  }

  getActivity(): void {
    this._activityService.getUserActivity(this.activityUserId).subscribe((result) => {
      this.activityUser = result;

      this.activityUser.evaluation.evaluations.items.forEach(element => {
        this.getPictureByGuid(element.profilePictureId).then((result) => {
          if (!this.isNullOrEmpty(result)) {
            element.userPicture = result;
          } else {
            element.userPicture = AppConsts.defaultProfilePicture;
          }
        });
      });     
    });
  }
}