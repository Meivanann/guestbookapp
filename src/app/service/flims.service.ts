import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class FlimsService {
serviceurl=environment.serviceUrl;
accessToken:any
  constructor(private http: HttpClient) {
this.accessToken=localStorage.getItem('access_token')
   }

  public moviecreate(data)
  {
    const formData = new FormData();
    formData.append('flimname', data['flim-name']);
    formData.append('description',data['description']);
    formData.append('relase_date', data['relase_date']);
    formData.append('rating',data['rating']);
    formData.append('ticket_price',data['ticket_price']);
    formData.append('country',data['country'] );
    formData.append('gener',data['gener']);
    //formData.append('flim_image',data['flimname']);
    for (let index = 0; index < data['flimname'].length; index++) {
      const element=data['flimname'][index]

      formData.append('flim_image', element);
      
    }
  
    let body=formData;
    const headers = { 'Accept': 'application/json','Authorization':'Bearer ' +this.accessToken}  
    return this.http.post(this.serviceurl + 'add_flim', body,{'headers':headers}).pipe(map(val1=>{
      return val1;
    })
    );
  }
  public movielist()
  {
     
    const headers = { 'content-type': 'application/json','Authorization':'Bearer ' +this.accessToken} 
    let data='' 
    return this.http.get(this.serviceurl + 'getflimlist',{'headers':headers})
   
  }
  public movielistbyslugname(data)
  {
    let body=data;
    // let params = new URLSearchParams();
    // params.append('flimslugname',data);
  
    const headers = { 'Accept': 'application/json','Content-type': 'application/json','Authorization':'Bearer ' +this.accessToken}  
    return this.http.post(this.serviceurl + 'getflimlistByslugname?flimslugname='+data,{},{'headers':headers}).pipe(map(val1=>{
      return val1;
    })
    );
  }
}
