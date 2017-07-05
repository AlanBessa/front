import { Component, OnInit } from '@angular/core';
import { LoginService } from '@app/account/login/login.service';

@Component({
    template:  `<router-outlet></router-outlet>`
})
export class PublicComponent implements OnInit {
    public constructor(
        private _loginService: LoginService
    ) {
    }

    ngOnInit(): void {
        this._loginService.init();
    }
}