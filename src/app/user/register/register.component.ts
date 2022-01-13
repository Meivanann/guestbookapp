import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'src/app/service/login.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  userform:FormGroup
  submitted=false
  constructor(private loginservice:LoginService) { }

  ngOnInit() {
    
    this.userform=new FormGroup({
      name: new FormControl('',[Validators.required]),
      email: new FormControl('',[Validators.required]),
      password: new FormControl('',[Validators.required]),
    });
  }
  get w()
  {
    return this.userform.controls
  }
  submit()
  {
    this.submitted=true
    if(this.w.invalid)
    {
      return false
    }
    else
    {
      let data={}
    data['email']=this.w.email.value
    data['name']=this.w.name.value
    data['password']=this.w.password.value

    this.loginservice.usercreate(data).subscribe(response=>
      {
        console.log(response)
      })
      
    }
  }
}
