import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { FileUploader, FileUploaderOptions, Headers } from '@node_modules/ng2-file-upload';
import { FileDtoBase64, FileDownloadDto, UserDocumentsInfoServiceProxy } from '@shared/service-proxies/service-proxies';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { PdfViewerComponent } from '@node_modules/ng2-pdf-viewer';
import { ModalDirective } from 'ngx-bootstrap';

import * as _ from "lodash";

@Component({
    selector: 'viewDocumentModal',
    templateUrl: './view-document-modal.component.html',
    styles: [
        `.user-edit-dialog-profile-image {
             margin-bottom: 20px;
        }`
    ]
})
export class ViewDocumentModalComponent extends AppComponentBase {
    @ViewChild('createOrEditModal') modal: ModalDirective;
    public img: boolean = false;
    public pdf: boolean = false;
    public srcPdf: string = "";
    public srcImg: string = "";
    public fileDtoBase64: FileDtoBase64 = new FileDtoBase64();

    constructor(
        injector: Injector,
        private _fileDownloadService: FileDownloadService,
        private _userDocumentsService: UserDocumentsInfoServiceProxy
    ) {
        super(injector);
    }

    show(guid: string): void {
        this._userDocumentsService.getExtensionBase64(guid).subscribe((result) => {
            this.fileDtoBase64 = result;
            this.img = false;
            this.pdf = false;
            switch (this.fileDtoBase64.fileExtension) {
                case '.pdf':
                    this.srcPdf = 'data:application/pdf;base64,' + this.fileDtoBase64.fileBase64;
                    this.pdf = true;
                    break;
                case '.jpeg':
                    this.srcImg = 'data:image/jpeg;base64,' + this.fileDtoBase64.fileBase64;
                    this.img = true;
                    break;
                case '.png':
                    this.srcImg = 'data:image/jpeg;base64,' + this.fileDtoBase64.fileBase64;
                    this.img = true;
                    break;
                case '.jpg':
                    this.srcImg = 'data:image/png;base64,' + this.fileDtoBase64.fileBase64;
                    this.img = true;
                    break;
                default:
            }
            this.modal.show();
        });        
    }


    downloadFile(fileName: string, guid: string): void {
        var fileDonwload = new FileDownloadDto();
        fileDonwload.fileName = fileName;
        fileDonwload.id = guid;

        this._userDocumentsService.downloadDocumentFile(fileDonwload)
            .subscribe((result) => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }

    onShown(): void {
    }


    close(): void {
        this.modal.hide();
    }
}

