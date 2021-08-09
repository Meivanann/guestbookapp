import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/service/product.service';
import { HttpClient, HttpHeaders,HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment'
import { OrderService } from 'src/app/service/order.service'; 
import { FormControl,FormGroup,FormBuilder,Validators } from '@angular/forms';
import { async } from '@angular/core/testing';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  providers: [DatePipe]
})
export class CheckoutComponent implements OnInit {
  apiurl=environment.serviceUrl
  totalamount=[]
  order_id=[]
  order_body=[]
  checkoutform:any
  myDate = new Date()
  size_list_object:any={}
  category_list_object:any={}
  subcategory_object:any={}
  suppler_list_object:any={}
  sub_category=[]
  subcategory=[]
  cartData=[]
  suppler_list=[]
  product_details_object={}
  count=0
  category_list=[]
  size_list=[]
  cart_details:any
  logindetails:any
  username:any
  isLogged=false
  productlistdata:any
  constructor(private formBuilder: FormBuilder,private http:HttpClient,private productservice:ProductService,private Orderservice:OrderService,private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.checkoutform = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      company_name: ['',[ Validators.required]],
      address1: ['', [Validators.required]],
      address2: ['', Validators.required],
      country: ['', Validators.required],
      postcode: ['', Validators.required],
      city: ['', Validators.required],
      mobile_number: ['', Validators.required],
      email: ['', Validators.required]

    });
  
 
    this.logindetails=JSON.parse(localStorage.getItem('login_credintels'))
   
    console.log('lof',this.logindetails,this.username)
    if(this.logindetails!=undefined)
    {
      this.username=this.logindetails.username
      if(Object.keys(this.logindetails).length > 0)
      {
        this.isLogged=true
      }
      else{
        this.isLogged=false
      }
    }
    this.productservice.producr_size_list().subscribe(cal1=>
      {
        this.size_list.push(...cal1['list'])
        console.log("sizelist",this.size_list)

        this.size_list.forEach(element => {
          this.size_list_object[element.id]=element.size_name
        });
        console.log("sizelist",this.size_list_object)

      })
    
      this.productservice.product_category_list().subscribe(cal1=>
        {
          this.category_list.push(...cal1['list'])
          this.subcategory.push(...cal1['subcategory'])
          this.category_list.forEach(element => {
            this.category_list_object[element.id]=element.category_name
          });
          this.subcategory.forEach(element => {
            this.subcategory_object[element.id]=element.category_name
          });
        })
        this.productservice.supplier_list().subscribe(cal1=>
          {
            this.suppler_list.push(...cal1['list'])
            this.suppler_list.forEach(element => {
              this.suppler_list_object[element.id]=element.store_name
            });
          })
    this.cart_details=this.cartData
    console.log('product_details',this.cart_details)
    
    let product_body=new HttpParams();
    product_body = product_body.set('search','' );
 
    this.productservice.product_list(product_body).subscribe(val1=>
      {
       this.productlistdata=val1['list']
       this.productlistdata.forEach(element => {
         if(this.product_details_object[element.id]==undefined)
         {
           this.product_details_object[element.id]=[]
         }
         this.product_details_object[element.id].push(element)
       });
      })
      console.log('detailsobject',this.product_details_object)
      let customer_body=new HttpParams();
    customer_body = customer_body.set('user_id',this.logindetails.id );
    setTimeout(() => {
      this.Orderservice.cart_list(customer_body).subscribe(val1=>
        {
          let data=val1['data']
          data.forEach(element => {
            this.cartData.push(...element['cartlist'])
          });
  
  console.log('product_details_first',this.cartData)
  console.log('product_list',data)
 this.cartData.forEach(element => {
   element.product_list=this.product_details_object[element.productId].length >0?this.product_details_object[element.productId]:[]
   if(element.product_list.length> 0)
   {
     element.product_list.forEach(val => {
       val.imageurl=this.apiurl+val.image
    // console.log("elem",this.cartData.size)
    val.sizename=this.size_list_object[val.size]!=undefined?this.size_list_object[val.size]:''
    console.log("elementsize",this.category_list_object[3],val.sizename)
    val.category_name=this.category_list_object[val.category]
    val.sub_category_name=this.subcategory_object[val.subcategory]
    val.store_name=this.suppler_list_object[val.supplier]
    val.rating=val.price * Number(element.quantity)
    val.productId=element.productId
    val.quantity=element.quantity
    element.rating=val.price * Number(element.quantity)

    val.number=element.quantity
    
 
     });  
   }
 });
 console.log('product_details',this.cartData)
 let totalamounts=this.totalsum('rating',this.cartData)
   this.totalamount.push({totalamount:totalamounts,deilvery:49,sumamount:0})
  
   

   this.totalamount.forEach(element => {
     let amount=element.totalamount+element.deilvery
     element.sumamount=element.sumamount+amount
   });
   console.log("totalamountarray",this.totalamount)
  
  // this.cartData.imageurl=this.apiurl+this.cartData.image
  //   console.log("elem",this.cartData.size)
  //   this.cartData.sizename=this.size_list_object[this.cartData.size]!=undefined?this.size_list_object[this.cartData.size]:''
  //   console.log("elementsize",this.category_list_object[3],this.cartData.sizename)
  //   this.cartData.category_name=this.category_list_object[this.cartData.category]
  //   this.cartData.sub_category_name=this.subcategory_object[this.cartData.subcategory]
  //   this.cartData.store_name=this.suppler_list_object[this.cartData.supplier]
 
        })
    }, 1000);
 
    
  

  }
  get f() {
    console.log(this.checkoutform);
    return this.checkoutform.controls;
  }
  totalsum(key,array) {
    return array.reduce((a, b) => a + (b[key] || 0), 0);
}
makePurchase()
{
  this.order_body=[]
  let orderdata=this.cartData.map((x,i)=>{
    x.product_list.map((element,index)=>
    {
      element.payment_id=0
      element.total=x.rating+49
      element.order_date=this.datePipe.transform(this.myDate,'yyyy-MM-dd')
      this.order_body.push(element)

    })

  })
 
  let order_body={
    userId:this.logindetails['id'],
    order_items:this.order_body,
    order_details:this.cartData
  }
  


  this.Orderservice.add_order(order_body).subscribe(val1=>{
    if(val1['status']==1)
    {
       this.order_id=val1['order_id']
       let billing_body=new HttpParams();
  billing_body = billing_body.set('user',this.logindetails['id'] );
  billing_body = billing_body.set('first_name',this.checkoutform.value.first_name );
  billing_body = billing_body.set('last_name',this.checkoutform.value.last_name );
  billing_body = billing_body.set('company_name',this.checkoutform.value.company_name );
  billing_body = billing_body.set('address1',this.checkoutform.value.address1 );
  billing_body = billing_body.set('address2', this.checkoutform.value.address2);
  billing_body = billing_body.set('country', this.checkoutform.value.country);
  billing_body = billing_body.set('postcode', this.checkoutform.value.postcode);
  billing_body = billing_body.set('city', this.checkoutform.value.city);
  billing_body = billing_body.set('mobile_number', this.checkoutform.value.mobile_number);
  billing_body = billing_body.set('order', this.order_id.join());
  billing_body = billing_body.set('email', this.checkoutform.value.email);
  this.Orderservice.add_billing(billing_body).subscribe(val1=>
    {

    })
    }

  })
  
}

}

