import { Component, OnInit } from '@angular/core';
import { FormControl,FormGroup,FormBuilder,Validators } from '@angular/forms';
import { LoginService } from 'src/app/service/login.service';
import { ProductService } from 'src/app/service/product.service'; 
import { HttpClient, HttpHeaders,HttpParams } from '@angular/common/http';
@Component({
  selector: 'app-customer-login',
  templateUrl: './customer-login.component.html',
  styleUrls: ['./customer-login.component.css']
})
export class CustomerLoginComponent implements OnInit {
  loginform:any
  constructor(private formBuilder: FormBuilder,private http:HttpClient,private loginservice:LoginService,private ProductService:ProductService) { }

  ngOnInit(): void {
    this.loginform = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  Onsubmit()
  {
console.log("userbale",this.loginform)
let params = new HttpParams();
params = params.set('username',this.loginform.value.username );
params = params.set('password', this.loginform.value.password);

let pojo={

}
pojo['username']=this.loginform.value.username
pojo['password']=this.loginform.value.password
console.log("obj",pojo)
this.loginservice.login((params)).subscribe(val=>
  {
   if(val['status']==1)
   {
     let list=val['data'][0]
     localStorage.setItem('login_credintels',JSON.stringify(list))
   }
  })
  }

}
