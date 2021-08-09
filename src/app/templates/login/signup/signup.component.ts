import { Component, OnInit } from '@angular/core';
import { FormControl,FormGroup,FormBuilder,Validators } from '@angular/forms';
import { LoginService } from 'src/app/service/login.service';
import { HttpClient, HttpHeaders,HttpParams } from '@angular/common/http';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
 customerform:any
 formvaildation:any=false
  constructor(private formBuilder: FormBuilder,private http:HttpClient,private loginservice:LoginService) { }

  ngOnInit(): void {
    this.customerform = this.formBuilder.group({
      username: ['', Validators.required],
      name: ['', Validators.required],
      email: ['',[ Validators.required,Validators.email]],
      phonenumber: ['', [Validators.required]],
      address: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  get f() {
    console.log(this.customerform.controls);
    return this.customerform.controls;
  }
  onSubmit()
  {
    this.formvaildation=true
    console.log("signup",this.customerform)
    let customer_body=new HttpParams();
    customer_body = customer_body.set('username',this.customerform.value.username );
    customer_body = customer_body.set('name',this.customerform.value.name );
    customer_body = customer_body.set('email',this.customerform.value.email );
    customer_body = customer_body.set('address',this.customerform.value.address );
    customer_body = customer_body.set('phonenumber',this.customerform.value.phonenumber );
    customer_body = customer_body.set('password', this.customerform.value.password);
    this.loginservice.signup(customer_body).subscribe(val1=>
      {

      })
  }
}
