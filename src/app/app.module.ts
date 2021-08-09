import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { TemplatesComponent } from './templates/templates.component';
import { LoginComponent } from './templates/login/login.component';
import { ProductComponent } from './templates/product/product.component';
import { CustomerLoginComponent } from './templates/login/customer-login/customer-login.component';
import { AddproductComponent } from './templates/product/addproduct/addproduct.component';
import { ProductListComponent } from './templates/product/product-list/product-list.component';
import { ProductDetailsComponent } from './templates/product/product-details/product-details.component';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
 // Import the library
 
 
// import { NgxImageZoomModule } from 'ngx-image-zoom';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { SignupComponent } from './templates/login/signup/signup.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartComponent } from './templates/product/cart/cart.component';
import { OrderComponent } from './templates/product/order/order.component';
import { CheckoutComponent } from './templates/product/checkout/checkout.component';
import { PinchZoomModule } from 'ngx-pinch-zoom';

@NgModule({
  declarations: [
    AppComponent,
    TemplatesComponent,
    LoginComponent,
    ProductComponent,
    CustomerLoginComponent,
    AddproductComponent,
    ProductListComponent,
    ProductDetailsComponent,
    SignupComponent,
    CartComponent,
    OrderComponent,
    CheckoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    // NgxImageZoomModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    PinchZoomModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
