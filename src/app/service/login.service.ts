import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
serviceurl=environment.serviceUrl
  constructor(private http: HttpClient) { }

  public userLogin(data)
  {
    let body=data;
    const headers = { 'content-type': 'application/json'}  
    return this.http.post(this.serviceurl + 'user_login', body,{'headers':headers}).pipe(map(val1=>{
      return val1;
    })
    );
  }
  public usercreate(data)
  {
    let body=data;
    const headers = { 'content-type': 'application/json'}  
    return this.http.post(this.serviceurl + 'user_register', body,{'headers':headers}).pipe(map(val1=>{
      return val1;
    })
    );
  }
}
