import { Component, OnInit, Injector } from '@angular/core';
import { LoginService } from './login/login.service';

@Component({
    template:  `<router-outlet></router-outlet>`
})
export class AccountComponent implements OnInit {

    public constructor(
        private _loginService: LoginService 
    ) {
    }

    ngOnInit(): void {
        this._loginService.init();
    }
}



