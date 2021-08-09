import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public apiurl = environment.serviceUrl;
  public headers : any;
  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders();
   }
   public login(data) {
    
    let params = data;
    let head= this.headers;

    //head = head.append('Content-Type', 'application/json')
    // head=head.append('Access-Control-Allow-Origin','*')
    // let auth = localStorage.getItem('basicAuth');
    // head = head.append("Authorization", "Basic " + btoa(auth));

    return this.http.post(this.apiurl +'/login', params, {headers:head}).pipe(map(val => {
      return val;
    })
    );
  }
  public signup(data) {
    
    let params = data;
    let head= this.headers;

    //head = head.append('Content-Type', 'application/json')
    // head=head.append('Access-Control-Allow-Origin','*')
    // let auth = localStorage.getItem('basicAuth');
    // head = head.append("Authorization", "Basic " + btoa(auth));

    return this.http.post(this.apiurl +'/customer_register', params, {headers:head}).pipe(map(val => {
      return val;
    })
    );
  }
}
