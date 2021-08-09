import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  public apiurl = environment.serviceUrl;
  public headers : any;
  constructor(private http: HttpClient) { 
    this.headers = new HttpHeaders();
  }
  public product_list(data) {
    
     let params = data;
    let head= this.headers;
   
    // head = head.append('Content-Type', 'application/json')
    // head=head.append('Access-Control-Allow-Origin','*')
    // let auth = localStorage.getItem('basicAuth');
    // head = head.append("Authorization", "Basic " + btoa(auth));

    return this.http.post(this.apiurl +'/productlist',params, {headers:head}).pipe(map(val => {
      return val;
    })
    );
  }
  public add_product(data) {
    
    let params = data;
    let head= this.headers;
   
  //  head = head.append('Content-Type', 'multipart/form-data')
    // head=head.append('Access-Control-Allow-Origin','*')
    // let auth = localStorage.getItem('basicAuth');
    // head = head.append("Authorization", "Basic " + btoa(auth));

    return this.http.post(this.apiurl +'/product_register',params, {headers:head}).pipe(map(val => {
      return val;
    })
    );
  }
  public supplier_list() {
    
    // let params = data;
    let head= this.headers;
   
    head = head.append('Content-Type', 'application/json')
    // head=head.append('Access-Control-Allow-Origin','*')
    // let auth = localStorage.getItem('basicAuth');
    // head = head.append("Authorization", "Basic " + btoa(auth));

    return this.http.get(this.apiurl +'/supplier_list', {headers:head}).pipe(map(val => {
      return val;
    })
    );
  }
  public producr_size_list() {
    
    // let params = data;
    let head= this.headers;
   
    head = head.append('Content-Type', 'application/json')
    // head=head.append('Access-Control-Allow-Origin','*')
    // let auth = localStorage.getItem('basicAuth');
    // head = head.append("Authorization", "Basic " + btoa(auth));

    return this.http.get(this.apiurl +'/product_size', {headers:head}).pipe(map(val => {
      return val;
    })
    );
  }
  public product_details(data) {
    
    let params = data;
    let head= this.headers;

    //head = head.append('Content-Type', 'application/json')
    // head=head.append('Access-Control-Allow-Origin','*')
    // let auth = localStorage.getItem('basicAuth');
    // head = head.append("Authorization", "Basic " + btoa(auth));

    return this.http.post(this.apiurl +'/productdetails', params, {headers:head}).pipe(map(val => {
      return val;
    })
    );
  }
  public product_category_list() {
    
    // let params = data;
    let head= this.headers;
   
    head = head.append('Content-Type', 'application/json')
    // head=head.append('Access-Control-Allow-Origin','*')
    // let auth = localStorage.getItem('basicAuth');
    // head = head.append("Authorization", "Basic " + btoa(auth));

    return this.http.get(this.apiurl +'/category_list', {headers:head}).pipe(map(val => {
      return val;
    })
    );
  }
}
