import { Component, OnInit,Input } from '@angular/core';
import { ProductService } from 'src/app/service/product.service';
import { HttpClient, HttpHeaders,HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment'
import { OrderService } from 'src/app/service/order.service'; 
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  // @Input() cartData: any;
  apiurl=environment.serviceUrl
  totalamount=[]
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
  constructor(private http:HttpClient,private productservice:ProductService,private Orderservice:OrderService) { }
  ngOnInit(): void {
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
  
  totalsum(key,array) {
    return array.reduce((a, b) => a + (b[key] || 0), 0);
}
  increasecount(quanity,id,status,index)
  {
   ++this.count

    let productdata=this.cartData.filter(x=>x.id==id)
    let productdatas=productdata[0]
    this.cartData[index].product_list[0].number= Number(this.cartData[index].product_list[0].number) +1
    this.cartData[index].product_list[0].rating=this.cartData[index].product_list[0].rating + Number(this.cartData[index].product_list[0].price)
    console.log("productdata",productdata)
    console.log("productdata")


    let amount=Number(this.cartData[index].product_list[0].price)
    this.totalamount[0].totalamount=this.totalamount[0].totalamount + amount
    this.totalamount[0].sumamount=this.totalamount[0].sumamount + amount
   let customer_body=new HttpParams();
   customer_body = customer_body.set('status',status );
   customer_body = customer_body.set('cart_id',productdatas['cart'] );
  // customer_body = customer_body.set('user_id',this.customerform.value.email );
   customer_body = customer_body.set('product_id',productdatas['productId'] );
   customer_body = customer_body.set('size_id',productdatas['size'] );
   customer_body = customer_body.set('quantity', '1');
   this.Orderservice.increment_decrment_qty(customer_body).subscribe(val1=>
     {

     })
  }
  decreasecount(quanity,id,status,index)
  {
    --this.count
    console.log("cartdatabefore",this.cartData)
    let productdata=this.cartData.filter(x=>x.id==id)
    let productdatas=productdata[0]
    this.cartData[index].product_list[0].number= Number(this.cartData[index].product_list[0].number) - 1
    this.cartData[index].product_list[0].rating=this.cartData[index].product_list[0].rating - Number(this.cartData[index].product_list[0].price)
    console.log("productdata",productdata)
    console.log("cartdataafter",this.cartData)
    
    let amount=Number(this.cartData[index].product_list[0].price)
    this.totalamount[0].totalamount=this.totalamount[0].totalamount - amount
    this.totalamount[0].sumamount=this.totalamount[0].sumamount - amount
   let customer_body=new HttpParams();
   customer_body = customer_body.set('status',status );
   customer_body = customer_body.set('cart_id',productdatas['cart'] );
  // customer_body = customer_body.set('user_id',this.customerform.value.email );
   customer_body = customer_body.set('product_id',productdatas['productId'] );
   customer_body = customer_body.set('size_id',productdatas['size'] );
   customer_body = customer_body.set('quantity','1');
   this.Orderservice.increment_decrment_qty(customer_body).subscribe(val1=>
     {

     })
  }

}
