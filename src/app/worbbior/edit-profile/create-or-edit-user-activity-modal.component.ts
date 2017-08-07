import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { InterestCenterServiceProxy, GalleryActivityServiceProxy, GalleryActivityDto, ListResultDtoOfGalleryActivityDto, InterestCenterForActivityDto, ActivityDto, UserActivityInput, ActivityServiceProxy, UserActivityInputUnitMeasure } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { UnitMeasure, CancellationPolicy, WorbbiorState } from '@shared/AppEnums';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { TokenService } from '@abp/auth/token.service';
import { IAjaxResponse } from '@abp/abpHttp';
import { Base64 } from 'js-base64';
import { Angulartics2 } from 'angulartics2';
import { ImageCropperComponent, CropperSettings, Bounds} from 'ng2-img-cropper';

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

    @ViewChild('cropper', undefined) cropper:ImageCropperComponent;
    @ViewChild('cropper2', undefined) cropper2:ImageCropperComponent;

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
    public galleryImages: GalleryActivityDto[];
    public srcImg: string = "";
    galleryActivityDto: GalleryActivityDto = new GalleryActivityDto;
    remove: boolean = false;
    data: any;
    data2: any;
    cropperSettings: CropperSettings;
    cropperSettings2: CropperSettings;
    image:any = new Image();
    cropActive:boolean = false;

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

    uploadAvatarChangeListener($event):void{
        var self = this;
        var file:File = $event.target.files[0];
        var myReader:FileReader = new FileReader();
        
        this.angulartics2.eventTrack.next({ action: "Imagem do perfil", properties: { category: 'Upload', label: file.size}});
        myReader.onloadend = function (loadEvent:any) {
            self.image.src = loadEvent.target.result;
            self.cropper.setImage(self.image);
            self.cropActive = true;
        };

        myReader.readAsDataURL(file);
    }

    show(activityUser: UserActivityInput): void {

        this.cropperSettings = new CropperSettings();
        this.cropperSettings.width = 1400;
        this.cropperSettings.height = 550;
        this.cropperSettings.keepAspect = true;

        this.cropperSettings.croppedWidth = 1400;
        this.cropperSettings.croppedHeight = 550;

        this.cropperSettings.canvasWidth = this.mediaQuery == "xs" ? 265 : 500;
        this.cropperSettings.canvasHeight = this.mediaQuery == "xs" ? 200 : 300;

        this.cropperSettings.minWidth = 1400;
        this.cropperSettings.minHeight = 550;

        this.cropperSettings.rounded = false;
        this.cropperSettings.minWithRelativeToResolution = false;

        this.cropperSettings.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';
        this.cropperSettings.cropperDrawSettings.strokeWidth = 2;
        this.cropperSettings.noFileInput = true;

        this.data = {};

        this._activityService.getActivity(activityUser.activityId).subscribe((result) => {
            this.activity = result;
            this._activityService.getInterestCentersByActivityId(activityUser.activityId).subscribe((result) => {
                this.interestCenters = result.items;
                this._galleryActivityService.getGalleriesByActivityUserId(activityUser.id == null ? undefined : activityUser.id).subscribe((result: ListResultDtoOfGalleryActivityDto) => {
                    this.galleryImages = result.items;

                    var imageItem = new GalleryActivityDto();
                    imageItem.activityUserId = activityUser.id;
                    this.galleryImages.push(imageItem);

                    this.galleryImages.forEach(element => {
                        if (element.galleryPictureId) {
                            this.getPictureByGuid(element.galleryPictureThumbnailId).then((result) => {
                                //element.fileBase64 = result;
                                element.thumbnail = result;
                            });
                            this.getPictureByGuid(element.galleryPictureId).then((result) => {
                                //element.fileBase64 = result;
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

    removeImageGallery(id: number): void {
        this._galleryActivityService.removeOneImageGalleryActivity(id).finally(() => { this.saving = false; })
            .subscribe(() => {
                this.show(this.activityUser);
                this.message.success("Removido com sucesso!");
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

        this.activityUser.featuredImage = this.data.image;
        this.activityUser.featuredImageThumbnail = this.data.image;

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

    resample_single(canvas, width, height, resize_canvas):void {
        var width_source = canvas.width;
        var height_source = canvas.height;
        width = Math.round(width);
        height = Math.round(height);

        var ratio_w = width_source / width;
        var ratio_h = height_source / height;
        var ratio_w_half = Math.ceil(ratio_w / 2);
        var ratio_h_half = Math.ceil(ratio_h / 2);

        var ctx = canvas.getContext("2d");
        var img = ctx.getImageData(0, 0, width_source, height_source);
        var img2 = ctx.createImageData(width, height);
        var data = img.data;
        var data2 = img2.data;

        for (var j = 0; j < height; j++) {
            for (var i = 0; i < width; i++) {
                var x2 = (i + j * width) * 4;
                var weight = 0;
                var weights = 0;
                var weights_alpha = 0;
                var gx_r = 0;
                var gx_g = 0;
                var gx_b = 0;
                var gx_a = 0;
                var center_y = (j + 0.5) * ratio_h;
                var yy_start = Math.floor(j * ratio_h);
                var yy_stop = Math.ceil((j + 1) * ratio_h);
                for (var yy = yy_start; yy < yy_stop; yy++) {
                    var dy = Math.abs(center_y - (yy + 0.5)) / ratio_h_half;
                    var center_x = (i + 0.5) * ratio_w;
                    var w0 = dy * dy; //pre-calc part of w
                    var xx_start = Math.floor(i * ratio_w);
                    var xx_stop = Math.ceil((i + 1) * ratio_w);
                    for (var xx = xx_start; xx < xx_stop; xx++) {
                        var dx = Math.abs(center_x - (xx + 0.5)) / ratio_w_half;
                        var w = Math.sqrt(w0 + dx * dx);
                        if (w >= 1) {
                            //pixel too far
                            continue;
                        }
                        //hermite filter
                        weight = 2 * w * w * w - 3 * w * w + 1;
                        var pos_x = 4 * (xx + yy * width_source);
                        //alpha
                        gx_a += weight * data[pos_x + 3];
                        weights_alpha += weight;
                        //colors
                        if (data[pos_x + 3] < 255)
                            weight = weight * data[pos_x + 3] / 250;
                        gx_r += weight * data[pos_x];
                        gx_g += weight * data[pos_x + 1];
                        gx_b += weight * data[pos_x + 2];
                        weights += weight;
                    }
                }
                data2[x2] = gx_r / weights;
                data2[x2 + 1] = gx_g / weights;
                data2[x2 + 2] = gx_b / weights;
                data2[x2 + 3] = gx_a / weights_alpha;
            }
        }
        //clear and resize canvas
        if (resize_canvas === true) {
            canvas.width = width;
            canvas.height = height;
        } else {
            ctx.clearRect(0, 0, width_source, height_source);
        }

        //draw
        ctx.putImageData(img2, 0, 0);
    }

    fileSelect($event, galleryActivity: GalleryActivityDto):void{
        console.log($event);
        console.log(galleryActivity);
        var image = new Image();
        var file:File = $event.target.files[0];

        let self = this;

        self.angulartics2.eventTrack.next({ action: "Atividade Galeria", properties: { category: 'Upload', label: file.size}});
        if(!self.isImageFile(file.name)){
            self.message.error("Arquivo somente no formato JPG / JPEG / PNG");

        }else{
            var myReader:FileReader = new FileReader();

            image.onload = function(){

                if(image.width < 330 && image.height < 330){
                    self.message.error("A imagem tem que ter altura e larguras maiores do que 330 pixels");
                }else{
                    if(self.isNullOrEmpty(galleryActivity.fileName) && self.isNullOrEmpty(galleryActivity.galleryPictureId)){
                        var imageItem = new GalleryActivityDto();
                        imageItem.activityUserId = self.activityUser.id;
                        imageItem.thumbnail = AppConsts.appBaseUrl + "/assets/metronic/worbby/global/img/icone-add-photo.gif";
                        imageItem.image = AppConsts.appBaseUrl + "/assets/metronic/worbby/global/img/icone-add-photo.gif";
                        self.galleryImages.push(imageItem);
                    }
                    

                    //Imagem resize
                    var canvas = document.createElement('canvas');
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

                    self.resample_single(canvas, width,height,true);

                    var canvasTemp = document.createElement('canvas');
                    var ctxTemp = canvas.getContext("2d");

                    var widthTemp = canvas.width;
                    var heightTemp = canvas.height;

                    var imageData;


                    if(canvas.width < canvas.height){
                        heightTemp *= 330 / widthTemp;
                        widthTemp = 330;
                        ctx.drawImage(image, 0, 0, widthTemp, heightTemp);

                        imageData = ctx.getImageData(0, heightTemp/2-(330/2), 330, 330);

                    } else {
                        widthTemp *= 330 / heightTemp;
                        heightTemp = 330;
                        ctx.drawImage(image, 0, 0, widthTemp, heightTemp);

                        imageData = ctx.getImageData(widthTemp/2-(330/2), 0, 330, 330);
                    }

                    var canvas2 = document.createElement("canvas");
                    canvas2.width = 330;
                    canvas2.height = 330;
                    var ctx1 = canvas2.getContext("2d");
                    ctx1.rect(0, 0, 330, 330);
                    ctx1.fillStyle = 'white';
                    ctx1.fill();
                    ctx1.putImageData(imageData, 0, 0);

                    self.resample_single(canvas2, canvas2.width,canvas2.height,true);

                    var dataurl = canvas.toDataURL("image/png");
                    var dataurl2 = canvas2.toDataURL("image/png");

                    galleryActivity.fileBase64 = dataurl;
                    galleryActivity.image = dataurl;
                    galleryActivity.thumbnail = dataurl2;
                    galleryActivity.fileName = file.name;
                    
                } 
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