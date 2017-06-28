import { Component, Injector, AfterViewInit, ViewChild, Inject, OpaqueToken, ElementRef, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { FileUploader, FileUploaderOptions, Headers } from '@node_modules/ng2-file-upload';
import { FileDtoBase64, FileDto, UserDocumentsInfoServiceProxy,CreateUserDocumentsInfoInputWorbbiorState, CreateUserDocumentsInfoInput, CreateBankAccountInput, BankAccountServiceProxy } from '@shared/service-proxies/service-proxies';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { IAjaxResponse } from '@abp/abpHttp';
import { TokenService } from '@abp/auth/token.service';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { WorbbiorState } from '@shared/AppEnums';
import { PdfViewerComponent } from '@node_modules/ng2-pdf-viewer';
import { ViewDocumentModalComponent } from './view-document-modal.component';
import { Angulartics2 } from 'angulartics2';

export class Sending {
    cpfFileName:boolean = false;
    rgFileName:boolean = false;
    criminalRecordsCertificateFileName:boolean = false;
    companyRegistrationFileName:boolean = false;
    proofOfAddressFileName:boolean = false;
}

@Component({
    templateUrl: './my-documents.component.html',
    animations: [appModuleAnimation()],
    selector: 'editMyDocumentsWorbbior',
})
export class MyDocumentsWorbbiorComponent extends AppComponentBase implements AfterViewInit {

    @ViewChild('viewDocumentModal') viewdocumentModal: ViewDocumentModalComponent;

    public AppConsts: typeof AppConsts = AppConsts;
    public active: boolean = false;
    public saving: boolean = false;
    public worbbiorState: WorbbiorState;

    public userDocumentsInfo: CreateUserDocumentsInfoInput;

    public userBankAccount: CreateBankAccountInput;

    public rgUploader: FileUploader;

    public cpfUploader: FileUploader;

    public criminalRecordsCertificateUploader: FileUploader;

    public proofOfAddressUploader: FileUploader;

    public companyRegistrationUploader: FileUploader;

    private _uploaderOptions: FileUploaderOptions = {};
    public WorbbiorState: typeof WorbbiorState = WorbbiorState;
    public pdfViewer: PdfViewerComponent;
    src: string = "";

    public tooltipAntecendenteCriminal: string = "Solicitamos a Certidão de Antecedentes Criminais para dar mais segurança aos usuários que forem contratar talentos na plataforma.<br /><br /> O que é?<br /> A Certidão de Antecedentes Criminais é um documento que informa se uma pessoa possui registros criminais. Ela tem validade de 90 dias, a partir da data de emissão. Depois desse prazo, é necessário emitir uma nova certidão.<br /><br /> Onde deve ser feito?<br /> Pela internet, no site da Polícia Federal (http://www.pf.gov.br/servicos-pf/antecedentes-criminais) ou no site do Detran-RJ (http://atestadodic.detran.rj.gov.br/). Também pode ser solicitada em um posto de atendimento do instituto de identificação do estado.<br /><br /> Quanto custa?<br /> A emissão pela internet é gratuita. Quando solicitada em um posto de atendimento do instituto de identificação, pode haver cobrança de taxas.";
    public tooltipComprovanteResidencia: string = "Se você não tem comprovante de residência em seu nome, deve socilitá-lo ao proprietário do imóvel, locador ou a quem tem o nome nas contas da residência, que forneça a você uma cópia do comprovante de residência com uma declaração de próprio punho no corpo do papel (ou no verso) dizendo que você reside no imóvel cujo endereço consta em seu cadastro na Worbby. Ao fim da declaração, é preciso da assinatura deste proprietário, como forma de atestar que a declaração é verdadeira. Recomendamos que juntamente com essa declaração, seja enviada uma cópia da identidade do proprietário do imóvel.";    


    public sending = new Sending();

    constructor(
        injector: Injector,
        private _tokenService: TokenService,
        private _userDocumentsService: UserDocumentsInfoServiceProxy,
        private _bankAccountService: BankAccountServiceProxy,
        private _appSessionService: AppSessionService,
        private elRef: ElementRef,
        private _fileDownloadService: FileDownloadService,
        private angulartics2: Angulartics2
    ) {
        super(injector);
    }

    ngAfterViewInit(): void {
        this.getInitData();
    }

    ngOnInit() {
        this.worbbiorState = this._appSessionService.worbbiorState;
    }


    getInitData(): void {
        this._userDocumentsService.getUserDocumentsInfoForEdit().subscribe((result) => {
            this.userDocumentsInfo = result;
            this.userDocumentsInfo.userId = abp.session.userId;
            this.rgUploader = this.initFileUploader("rgFileName");
            this.cpfUploader = this.initFileUploader("cpfFileName");
            this.criminalRecordsCertificateUploader = this.initFileUploader("criminalRecordsCertificateFileName");
            this.companyRegistrationUploader = this.initFileUploader("companyRegistrationFileName");
            this.proofOfAddressUploader = this.initFileUploader("proofOfAddressFileName");
            this.userDocumentsInfo.isCompany = this.userDocumentsInfo.isCompany ? this.userDocumentsInfo.isCompany : false;
            this._bankAccountService.getBankAccountByUserId(abp.session.userId).subscribe((result) => {
                this.userBankAccount = result;

                if (!this.userBankAccount.userId) {
                    this.userBankAccount.userId = abp.session.userId;
                }

                this.active = true;
            });
        });
    }

    viewDocument(guid: string) {
        this.viewdocumentModal.show(guid);
    }

    initFileUploader(fileName: string): FileUploader {
        let self = this;
        var uploader = new FileUploader({ url: AppConsts.remoteServiceBaseUrl + "/File/UploadFileDocumentsInfo" });
        self._uploaderOptions.autoUpload = false;
        self._uploaderOptions.authToken = 'Bearer ' + self._tokenService.getToken();
        self._uploaderOptions.removeAfterUpload = true;

        uploader.onAfterAddingFile = (file) => {
            file.withCredentials = false;
            this.angulartics2.eventTrack.next({ action: fileName, properties: { category: 'Upload', label: file.file.size}});
            if(file.file.size > this.megByteToBytes(AppConsts.maxFileSizeUpload)){
                this.message.error("Tamanho máximo permitido de " + AppConsts.maxFileSizeUpload + "MB").done(() => {
                    $("#" + fileName).val("");
                    uploader.clearQueue();
                });;
                self.sending[fileName] = false;
                self.userDocumentsInfo[fileName] = "";
            }else{
                uploader.uploadItem(file);
            }
        };

        uploader.onBeforeUploadItem = (item) => {
            self.userDocumentsInfo[fileName] = "";
            self.sending[fileName] = true;
        };

        uploader.onSuccessItem = (item, response, status) => {
            let resp = <IAjaxResponse>JSON.parse(response);
            if (resp.success) {
                self.userDocumentsInfo[fileName] = resp.result.fileName;

            } else {
                $("#" + fileName).val("");
                this.message.error(resp.error.message);
            }
            self.sending[fileName] = false;
        };

        uploader.setOptions(self._uploaderOptions);

        return uploader;
    }

    save(showNotify: boolean = true, callback: () => void): void {
        this.saving = true;

        if (this.worbbiorState != Number(this.WorbbiorState.WaitingActivation) 
        && this.worbbiorState != Number(this.WorbbiorState.WaitingActivEdit) ) {
            
            this.userDocumentsInfo.worbbiorState = Number(this.worbbiorState);

            this._userDocumentsService.createUserDocumentsInfoDisableValidation(this.userDocumentsInfo)
                .finally(() => {
                    this.saving = false;
                  
                })
                .subscribe(() => {
                    if (!this.bankAccountIsEmpty()) {
                        this.createBankAccount(showNotify);
                    } else {
                        this.getInitData();
                        if (showNotify) {
                            this.notify.info(this.l('SavedSuccessfully'));
                             
                        }
                    }
                     callback();
                });

        }
    }
    createBankAccount(showNotify: boolean = true): void {
        this._bankAccountService.createBankAccount(this.userBankAccount)
            .finally(() => { this.saving = false; })
            .subscribe(() => {
                this.getInitData();
                if (showNotify) {
                    this.notify.info(this.l('SavedSuccessfully'));
                }
            });
    }

    bankAccountIsEmpty(): boolean {
        var bool = false;
        if (
            (this.userBankAccount.agency == "" || this.userBankAccount.agency == undefined) &&
            (this.userBankAccount.bank == "" || this.userBankAccount.bank == undefined) &&
            (this.userBankAccount.currentAccount == "" || this.userBankAccount.currentAccount == undefined) &&
            (this.userBankAccount.holderName == "" || this.userBankAccount.holderName == undefined) &&
            (this.userBankAccount.holderCpf == "" || this.userBankAccount.holderCpf == undefined)
        ) {
            bool = true;
        }

        return bool;
    }

    onChangeIsCompany(newValue) {
        this.userDocumentsInfo.isCompany = newValue;
    }

    updateWorbbiorState(): void {
        this.worbbiorState = this._appSessionService.worbbiorState;
    }
}