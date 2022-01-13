import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'src/app/service/login.service';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
loginform:FormGroup
submitted=false
  constructor(private loginservice:LoginService,private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {

    this.loginform=new FormGroup({
      email: new FormControl('',[Validators.required]),
      password: new FormControl('',[Validators.required]),
    });
  }
get w()
{
  return this.loginform.controls
}
onsubmit()
{
  console.log('forms',this.w)
  this.submitted=true
  if(this.loginform.invalid)
  {
    return false
  }
  else
  {
    let data={}
    data['email']=this.w.email.value
    data['password']=this.w.password.value

    this.loginservice.userLogin(data).subscribe(response=>
      {
        console.log(response)
        let responsedata=response

        localStorage.setItem('access_token',responsedata['token'])
        this.router.navigate(['movie_list']);
      })
  }
}
}
