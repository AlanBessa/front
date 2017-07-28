import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { InterestCenterServiceProxy, GalleryActivityServiceProxy, GalleryActivityDto, ListResultDtoOfGalleryActivityDto, InterestCenterForActivityDto, ActivityDto, UserActivityInput, ActivityServiceProxy, UserActivityInputUnitMeasure } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { UnitMeasure, CancellationPolicy, WorbbiorState } from '@shared/AppEnums';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { FileUploader, FileUploaderOptions, Headers } from '@node_modules/ng2-file-upload';
import { TokenService } from '@abp/auth/token.service';
import { IAjaxResponse } from '@abp/abpHttp';
import { Base64 } from 'js-base64';
import { Angulartics2 } from 'angulartics2';

import * as _ from "lodash";

@Component({
    selector: 'createOrEditUserActivityModal',
    templateUrl: './create-or-edit-user-activity-modal.component.html',
    styles: [
        `.user-edit-dialog-profile-image {
             margin-bottom: 20px;
        }`
    ]
})
export class CreateOrEditUserActivityModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal') modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    active: boolean = false;
    saving: boolean = false;
    activityUser: UserActivityInput = new UserActivityInput;
    activity: ActivityDto;
    interestCenters: InterestCenterForActivityDto[];
    unitMeasureOptions: string[];
    cancellationPolicyOptions: string[];
    UnitMeasure: typeof UnitMeasure = UnitMeasure;
    CancellationPolicy: typeof CancellationPolicy = CancellationPolicy;
    currentUnitMeasureOptions: string = "";
    currentCancellationPolicyOptions: string = "";
    public WorbbiorState: typeof WorbbiorState = WorbbiorState;
    public worbbiorState: WorbbiorState;
    private _uploaderOptions: FileUploaderOptions = {};
    public galleryImages: GalleryActivityDto[];
    public galleryImagesUploader: FileUploader[] = [];
    public srcImg: string = "";
    galleryActivityDto: GalleryActivityDto = new GalleryActivityDto;
    remove: boolean = false;

    public tooltipPoliticaCancelamento: string = "Você é quem decide qual será o valor a ser devolvido ao cliente (worbbient) caso a tarefa contratada seja cancelada por ele. Escolha uma das opções:<br /><br /> <strong>Superflexível:</strong> 100% de reembolso do valor da tarefa até 4 horas antes da hora prevista.<br /><br /> <strong>Flexível:</strong> 100% de reembolso do valor da tarefa até 24 horas antes da data prevista.<br /><br /> <strong>Moderada:</strong> 50% de reembolso do valor da tarefa até 48 horas da data prevista.<br /><br /> <strong>Rígida:</strong> 50% de reembolso do valor da tarefa até 5 dias (120 horas) antes da data prevista.";

    public tooltipGaleriaImagem: string = "Extensão permitida: PNG, JPEG e JPG. <br />Tamanho máximo 1mb.";

    constructor(
        injector: Injector,
        private _activityService: ActivityServiceProxy,
        private _interestCenterService: InterestCenterServiceProxy,
        private _tokenService: TokenService,
        private _appSessionService: AppSessionService,
        private _galleryActivityService: GalleryActivityServiceProxy,
        private angulartics2: Angulartics2
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.worbbiorState = this._appSessionService.worbbiorState;
    }
    ngAfterViewInit(): void {

    }
    show(activityUser: UserActivityInput): void {
        this._activityService.getActivity(activityUser.activityId).subscribe((result) => {
            this.activity = result;
            this._activityService.getInterestCentersByActivityId(activityUser.activityId).subscribe((result) => {
                this.interestCenters = result.items;
                this._galleryActivityService.getGalleriesByActivityUserId(activityUser.id == null ? undefined : activityUser.id).subscribe((result: ListResultDtoOfGalleryActivityDto) => {
                    this.galleryImages = result.items;

                    if (this.galleryImages.length < 3) {
                        var imageItem = new GalleryActivityDto();
                        imageItem.activityUserId = activityUser.id;

                        for (var i = this.galleryImages.length; i < 3; i++) {
                            this.galleryImages[i] = new GalleryActivityDto(imageItem.toJSON());
                        }
                    }

                    for (var u = 0; u < this.galleryImages.length; u++) {
                        this.galleryImagesUploader[u] = this.initFileUploader(u);
                    }

                    this.galleryImages.forEach(element => {
                        if (element.galleryPictureId) {
                            this.getPictureByGuid(element.galleryPictureId).then((result) => {
                                //element.fileBase64 = result;
                                element.thumbnail = result;
                                element.image = result;
                            });
                        } else {
                            element.thumbnail = AppConsts.appBaseUrl + "/assets/metronic/worbby/global/img/icone-add-photo.gif";
                            element.image = AppConsts.appBaseUrl + "/assets/metronic/worbby/global/img/icone-add-photo.gif";
                        }
                    });
                    this.active = true;
                });
            });
        });

        this.activityUser = activityUser;
        this.activityUser.title = activityUser.title ? activityUser.title : "";
        this.activityUser.description = activityUser.description ? activityUser.description : "";
        this.activityUser.price = activityUser.price ? activityUser.price : 0;
        var unitMeasureOptions = Object.keys(UnitMeasure);
        this.unitMeasureOptions = unitMeasureOptions.slice(unitMeasureOptions.length / 2);
        this.currentUnitMeasureOptions = this.unitMeasureOptions[0];

        var cancellationPolicyOptions = Object.keys(CancellationPolicy);
        this.cancellationPolicyOptions = cancellationPolicyOptions.slice(cancellationPolicyOptions.length / 2);
        this.currentCancellationPolicyOptions = this.cancellationPolicyOptions[0];

        if (activityUser.cancellationPolicy)
            this.currentCancellationPolicyOptions = CancellationPolicy[activityUser.cancellationPolicy];

        if (activityUser.unitMeasure)
            this.currentUnitMeasureOptions = UnitMeasure[activityUser.unitMeasure];

        this.activityUser.unitMeasure = UnitMeasure[this.currentUnitMeasureOptions];
        this.activityUser.cancellationPolicy = CancellationPolicy[this.currentCancellationPolicyOptions];


        this.modal.show();
    }

    initFileUploader(index: number): FileUploader {
        let self = this;
        var uploader = new FileUploader({ url: AppConsts.remoteServiceBaseUrl + "/File/UploadFileGalleryActivity" });
        self._uploaderOptions.autoUpload = true;
        self._uploaderOptions.authToken = 'Bearer ' + self._tokenService.getToken();
        self._uploaderOptions.removeAfterUpload = true;
        uploader.onAfterAddingFile = (file) => {
            file.withCredentials = false;

        };

        uploader.onBeforeUploadItem = (item) => {
            self.galleryImages[index].fileName = "";
            self.galleryImages[index].fileBase64 = "/assets/metronic/worbby/global/img/loading2.gif";
            self.galleryImages[index].image = "/assets/metronic/worbby/global/img/loading2.gif";
            self.galleryImages[index].thumbnail = "/assets/metronic/worbby/global/img/loading2.gif";
        };

        uploader.onSuccessItem = (item, response, status) => {
            let resp = <IAjaxResponse>JSON.parse(response);
            if (resp.success) {
                var reader = new FileReader();
                reader.readAsDataURL(item._file);
                reader.onload = function () {
                    self.galleryImages[index].fileBase64 = reader.result;
                    self.galleryImages[index].fileName = resp.result.fileName;
                    self.galleryImages[index].image = reader.result;
                    self.galleryImages[index].thumbnail = reader.result;
                };
                reader.onerror = function (error) {
                    //console.log('Error: ', error);
                };
            }
            if (resp.error) {
                this.message.error((resp.error.message));
            }
        };

        uploader.setOptions(self._uploaderOptions);

        return uploader;
    }

    removeImageGallery(id: number): void {
        this._galleryActivityService.removeOneImageGalleryActivity(id).finally(() => { this.saving = false; })
            .subscribe(() => {
                //this.remove = true;
                this.show(this.activityUser);
                this.message.success("Removido com sucesso!");
                // this.close();
                // this.modalSave.emit(null);
            });
    }

    onShown(): void {
    }

    changeUnitMeasure(name: string): void {
        this.currentUnitMeasureOptions = name;
        this.activityUser.unitMeasure = UnitMeasure[name];
    }

    changeCancellationPolicy(name: string): void {
        this.currentCancellationPolicyOptions = name;
        this.activityUser.cancellationPolicy = CancellationPolicy[name];
    }

    save(): void {
        this.saving = true;
        if (this.activityUser.tenantId == 0 || this.activityUser.tenantId == null) {
            this.activityUser.tenantId = abp.session.tenantId;
        }
        this.activityUser.listGalleryActivity = new ListResultDtoOfGalleryActivityDto();
        this.activityUser.listGalleryActivity.items = this.galleryImages;
        this._activityService.addActivityToUser(this.activityUser)
            .finally(() => { this.saving = false; })
            .subscribe(() => {
                //if (!this.remove) {
                    this.message.success(this.l('SavedSuccessfully'));
                    this.close();
                    this.modalSave.emit(null);
                //}
            });
    }

    fileSelect($event, galleryActivity: GalleryActivityDto):void{
        console.log($event);
        var image = new Image();
        var file:File = $event.target.files[0];

        this.angulartics2.eventTrack.next({ action: "Atividade Galeria", properties: { category: 'Upload', label: file.size}});
        if(!this.isImageFile(file.name)){
            this.message.error("Arquivo somente no formato JPG / JPEG / PNG");

        }else{
            var myReader:FileReader = new FileReader();
            var that = this;

            image.onload = function(){
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext("2d");
                ctx.drawImage(image, 0, 0);
                var MAX_WIDTH = 800;
                var MAX_HEIGHT = 600;
                var width = image.width;
                var height = image.height;
                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(image, 0, 0, width, height);

                var dataurl = canvas.toDataURL("image/png");

                galleryActivity.fileBase64 = dataurl;
                galleryActivity.image = dataurl;
                galleryActivity.thumbnail = dataurl;
                galleryActivity.fileName = file.name;
            }

            myReader.onload = function (loadEvent:any) {            
                image.src = loadEvent.target.result;
            };

            myReader.readAsDataURL(file);
        }

        
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}