import { Component, Injector, OnInit, Input, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { EntityDtoOfInt64, WorbbyTaskServiceProxy, WorbbyTaskDto, WorbbyOfferDto } from '@shared/service-proxies/service-proxies';
import { Router, ActivatedRoute } from '@angular/router';
import { WorbbyTaskStatus } from '@shared/AppEnums';
import { SendReportModalComponent } from '@app/worbbior/page/send-report-modal.component';

@Component({
    selector: 'worbbiorWorbbyTaskActions',
    templateUrl: './worbbior-task-actions.component.html'
})
export class WorbbiorWorbbyTaskActions extends AppComponentBase implements OnInit {

    @Input() worbbyTask: WorbbyTaskDto;
    @Input() actionsType: string;

    @ViewChild('sendReportModal') sendReportModal: SendReportModalComponent;

    public active:boolean = false;

    constructor(
        injector: Injector,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _worbbyTaskService: WorbbyTaskServiceProxy
    ) {
        super(injector);
    }

    ngOnInit(): void {
    }

    get ifOfferAcceptedByWorbbient():boolean{
        return (this.worbbyTask.status == Number(WorbbyTaskStatus.OfferAcceptedByWorbbient) && !this.isNullOrEmpty(this.worbbyTask.offerId) && !this.isNullOrEmpty(this.worbbyTask.targetUserId) && this.isNullOrEmpty(this.worbbyTask.activityUserId))
    }

    acceptWorbbyTaskProposed(): void {
        var entityDto: EntityDtoOfInt64 = new EntityDtoOfInt64(this.worbbyTask);

        this._worbbyTaskService.worbbyTaskProposalAcceptedByWorbbior(entityDto)
            .finally(() => {
            })
            .subscribe(() => {
                this.message.custom('', 'Proposta aceita com sucesso!', 'assets/common/images/icon-dove@2x.png').done(() => {
                });
            });
    }

    confirmOfferAccepted(worbbyTask: WorbbyTaskDto): void {
        var entityDto = new EntityDtoOfInt64();
        entityDto.id = worbbyTask.id;
        this._worbbyTaskService.offerConfirmedByWorbbior(entityDto)
            .finally(() => {
            })
            .subscribe(() => {
                this.message.custom('', 'Oferta confirmada com sucesso!', 'assets/common/images/icon-dove@2x.png').done(() => {
                    this._router.navigate(['/worbbior/worbby-task-details', worbbyTask.id]);
                });
            });
    }

    refusedOfferAccepted(worbbyTask: WorbbyTaskDto): void {
        var entityDto = new EntityDtoOfInt64();
        entityDto.id = worbbyTask.id;
        this.message.confirm(
            'Deseja recusar essa oferta?', 'Ops!',
            isConfirmed => {
                if (isConfirmed) {
                    this._worbbyTaskService.offerCanceledByWorbbior(entityDto)
                        .finally(() => {
                        })
                        .subscribe(() => {
                            this.message.custom('', 'Oferta recusada com sucesso!', 'assets/common/images/icon-dove@2x.png').done(() => {
                            });
                        });
                }
            }
        );
    }

    sendReport(): void {
        this.sendReportModal.show();
    }
}