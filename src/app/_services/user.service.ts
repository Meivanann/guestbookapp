import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../_models';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }
private apiurl="http://3.129.218.61:8011"
    getAll() {
        return this.http.get<User[]>(this.apiurl+`/customerdetails`);
    }
    register(user: User) {
        return this.http.post(this.apiurl+`/createcustomer`, user);
    }

    delete(id: number) {
        return this.http.delete(`/users/${id}`);
    }
}