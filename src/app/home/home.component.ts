import { Component, OnInit } from '@angular/core';
import { LoginService } from '@app/account/login/login.service';

@Component({
    template:  `<router-outlet></router-outlet>`
})
export class HomeComponent implements OnInit {
    public constructor(
    ) {
    }

    ngOnInit(): void {
    }
}