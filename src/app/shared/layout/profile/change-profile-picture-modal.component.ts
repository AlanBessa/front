import { Component, OnInit, ViewChild, Injector, Inject } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ProfileServiceProxy, UpdateProfilePictureCropperInput } from "@shared/service-proxies/service-proxies";
import { ImageCropperComponent, CropperSettings, Bounds} from 'ng2-img-cropper';
import { Angulartics2 } from 'angulartics2';


@Component({
    selector: 'changeProfilePictureModal',
    templateUrl: './change-profile-picture-modal.component.html'
})
export class ChangeProfilePictureModalComponent extends AppComponentBase {

    @ViewChild('changeProfilePictureModal') modal: ModalDirective;
    @ViewChild('cropper', undefined) cropper:ImageCropperComponent;

    public active: boolean = false;
    public saving:boolean = false;
    public uploading: boolean = false;
    public temporaryPictureUrl: string;

    private temporaryPictureFileName: string;
    private _$profilePictureResize: JQuery;
    private _$jcropApi: any;

    public fileCropper: UpdateProfilePictureCropperInput = new UpdateProfilePictureCropperInput();

    cropperSettings: CropperSettings;
    data: any;

    public tooltipFoto: string = "Para facilitar a identificação, sua foto deve ser atual, apenas do rosto e frontal, tipo foto 3x4.";

    constructor(
        injector: Injector,
        private _profileService: ProfileServiceProxy,
        private angulartics2: Angulartics2
    ) {
        super(injector);
    }

    initializeModal(): void {
        this.active = true;
        this.temporaryPictureUrl = '';
        this.temporaryPictureFileName = '';
        this._$profilePictureResize = null;
        this._$jcropApi = null;
    }

    onModalShown() {
        this._$profilePictureResize = $("#ProfilePictureResize");
    }

    uploadAvatarChangeListener($event):void{
        var image:any = new Image();
        var file:File = $event.target.files[0];
        var myReader:FileReader = new FileReader();
        var that = this;
        this.angulartics2.eventTrack.next({ action: "Imagem do perfil", properties: { category: 'Upload', label: file.size}});
        myReader.onloadend = function (loadEvent:any) {
            image.src = loadEvent.target.result;
            that.cropper.setImage(image);

        };

        myReader.readAsDataURL(file);
    }

    show(): void {
        this.cropperSettings = new CropperSettings();
        this.cropperSettings.width = 200;
        this.cropperSettings.height = 200;
        this.cropperSettings.keepAspect = false;

        this.cropperSettings.croppedWidth = 100;
        this.cropperSettings.croppedHeight = 100;

        this.cropperSettings.canvasWidth = this.mediaQuery == "xs" ? 265 : 500;
        this.cropperSettings.canvasHeight = this.mediaQuery == "xs" ? 200 : 300;

        // this.cropperSettings.minWidth = 100;
        // this.cropperSettings.minHeight = 100;

        this.cropperSettings.rounded = true;
        this.cropperSettings.minWithRelativeToResolution = false;

        this.cropperSettings.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';
        this.cropperSettings.cropperDrawSettings.strokeWidth = 2;
        this.cropperSettings.noFileInput = true;

        this.data = {};

        this.initializeModal();
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }

    save(): void {
        this.saving = true;
        let self = this;

        if(!this.data.image){
            this.message.error("A nova imagem não foi selecionada!", "Erro ao salver nova imagem de perfil!");
        }else{
            this.fileCropper.base64 = /,(.+)/.exec(this.data.image)[1];

            self._profileService.profilePictureCropper(this.fileCropper)
            .finally(() => { this.saving = false; })
            .subscribe(() => {
                abp.event.trigger("profilePictureChanged");
                self.close();
            });
        }
    }
}