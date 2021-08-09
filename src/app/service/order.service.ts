import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class OrderService {
  public apiurl = environment.serviceUrl;
  public headers : any;
  constructor(private http: HttpClient) { 
    this.headers = new HttpHeaders();
  }

  public add_order(data) {
    
    let params = data;
    let head= this.headers;
   
    head = head.append('Content-Type', 'application/json')
    // head=head.append('Access-Control-Allow-Origin','*')
    // let auth = localStorage.getItem('basicAuth');
    // head = head.append("Authorization", "Basic " + btoa(auth));

    return this.http.post(this.apiurl +'/add_order',params, {headers:head}).pipe(map(val => {
      return val;
    })
    );
  }
  public increment_decrment_qty(data) {
    
    let params = data;
    let head= this.headers;
   
  //  head = head.append('Content-Type', 'multipart/form-data')
    // head=head.append('Access-Control-Allow-Origin','*')
    // let auth = localStorage.getItem('basicAuth');
    // head = head.append("Authorization", "Basic " + btoa(auth));

    return this.http.post(this.apiurl +'/inc_dec_quanity',params, {headers:head}).pipe(map(val => {
      return val;
    })
    );
  }
  public add_cart(data) {
    
    let params = data;
    let head= this.headers;
   
  //  head = head.append('Content-Type', 'multipart/form-data')
    // head=head.append('Access-Control-Allow-Origin','*')
    // let auth = localStorage.getItem('basicAuth');
    // head = head.append("Authorization", "Basic " + btoa(auth));

    return this.http.post(this.apiurl +'/add_cart',params, {headers:head}).pipe(map(val => {
      return val;
    })
    );
  }
  public cart_list(data) {
    
    let params = data;
    let head= this.headers;
   
  //  head = head.append('Content-Type', 'multipart/form-data')
    // head=head.append('Access-Control-Allow-Origin','*')
    // let auth = localStorage.getItem('basicAuth');
    // head = head.append("Authorization", "Basic " + btoa(auth));

    return this.http.post(this.apiurl +'/cart_list',params, {headers:head}).pipe(map(val => {
      return val;
    })
    );
  }
  public order_list(data) {
    
    let params = data;
    let head= this.headers;
   
  //  head = head.append('Content-Type', 'multipart/form-data')
    // head=head.append('Access-Control-Allow-Origin','*')
    // let auth = localStorage.getItem('basicAuth');
    // head = head.append("Authorization", "Basic " + btoa(auth));

    return this.http.post(this.apiurl +'/order_list',params, {headers:head}).pipe(map(val => {
      return val;
    })
    );
  }
  public add_billing(data) {
    
    let params = data;
    let head= this.headers;
   
  //  head = head.append('Content-Type', 'multipart/form-data')
    // head=head.append('Access-Control-Allow-Origin','*')
    // let auth = localStorage.getItem('basicAuth');
    // head = head.append("Authorization", "Basic " + btoa(auth));

    return this.http.post(this.apiurl +'/billing_register',params, {headers:head}).pipe(map(val => {
      return val;
    })
    );
  }
}

