import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from "moment";

@Component({
    templateUrl: './awaiting.component.html',
    selector: 'awaiting'
})
export class AwaitingComponent extends AppComponentBase implements OnInit {

    public title:string = "Cancelamento de tarefa";
    public text:string = "Aguarde, cancelando tarefa...";
    public showAwaiting:boolean = false;


    constructor(
        injector: Injector,
    ) {
        super(injector);
    }

    ngOnInit(): void {
    }

    show(text:string, title?:string):void{
        this.title = title;
        this.text = text;
        this.showAwaiting = true;
    }

    hide():void{
        this.showAwaiting = false;
    }
}