import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ProductComponent } from '../app/templates/product/product.component';
import { SignupComponent } from './templates/login/signup/signup.component'; 
import { CustomerLoginComponent } from '../app/templates/login/customer-login/customer-login.component';
import { AddproductComponent } from './templates/product/addproduct/addproduct.component';
import { CheckoutComponent } from './templates/product/checkout/checkout.component';
const routes: Routes = [
  { path: 'login', redirectTo: 'login', pathMatch: 'full'},
  // { path: 'login', component: LoginComponent, data: { animation: 'isRight' } },
  // { path: 'signup', component: SignupComponent, data: { animation: 'isLeft' } },
  // { path: 'forgotPasswordUsername', component: ForgotPasswordUsernameComponent },,
  { path: 'main', component: ProductComponent },
  
  { path: 'login', component: CustomerLoginComponent },
  { path: 'addproduct', component: AddproductComponent },
  { path: 'checkout', component: CheckoutComponent },
];



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
     RouterModule.forRoot(routes, {useHash: true})
    
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
