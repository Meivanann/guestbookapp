import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../_models';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    private apiurl="http://localhost:8011"

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('userInfo')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    public setUserInfo(user){
        localStorage.setItem('userInfo', JSON.stringify(user));
      }
    login(username: string, password: string) {
        return this.http.post<any>(this.apiurl+'/customerlogin', { username, password })
            .pipe(map((user) => {
              
                // login successful if there's a jwt token in the response
                if (user.status==1 && user.username) {
                    
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                     this.setUserInfo(user.username)
                     this.currentUserSubject.next(user.username);
                }

                if (user.status==0) {
                    
                    return Error(user.message)
                }

                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('userInfo');
        this.currentUserSubject.next(null);
    }
}