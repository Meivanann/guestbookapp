import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './_services';
import { User } from './_models';
@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent {
  currentUser: User;

    constructor(
        private router: Router,
        private authenticationService: AuthService
    ) {
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }
    get user(): any {
        var user=localStorage.getItem('userInfo');
        return user.replace(/['"]+/g, '')
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }
}
