import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/service/product.service';
import { HttpClient, HttpHeaders,HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment'
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  apiurl=environment.serviceUrl
  product_list=[]
  closeResult: string;
  searchdata:''
  suppler_list=[]
  category_list=[]
  size_list=[]
  viewdata:any
  viewindex:any
  logindetails:any
  size_list_object:any={}
  category_list_object:any={}
  isLogged=false
  subcategory_object:any={}
  suppler_list_object:any={}
  sub_category=[]
  subcategory=[]
  username:any
  constructor(private http:HttpClient,private modalService: NgbModal,private productservice:ProductService) { }

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

          console.log('objects',this.size_list_object[4],this.category_list_object,this.subcategory_object,this.suppler_list_object)
        setTimeout(() => {
          let customer_body=new HttpParams();
         customer_body = customer_body.set('search','' );
          this.productservice.product_list(customer_body).subscribe(val1=>{
            this.product_list=val1['list']
            this.product_list.forEach(element => {
              element.imageurl=this.apiurl+element.image
              console.log("elem",element.size)
              element.sizename=this.size_list_object[element.size]!=undefined?this.size_list_object[element.size]:''
              console.log("elementsize",this.category_list_object[3],element.sizename)
              element.category_name=this.category_list_object[element.category]
              element.sub_category_name=this.subcategory_object[element.subcategory]
              element.store_name=this.suppler_list_object[element.supplier]
            });
            console.log('list',this.product_list)
          })
        }, 1000);
 

   
  }
  product_details(product_data,index)
  {
    console.log("button is clicked")
    this.viewdata=product_data
    this.viewindex=index
    console.log("button is clicked",this.viewdata)
  }
 search()
 {
   console.log("d",this.searchdata)
  let customer_body=new HttpParams();
         customer_body = customer_body.set('search',this.searchdata);
          this.productservice.product_list(customer_body).subscribe(val1=>{
            this.product_list=val1['list']
            this.product_list.forEach(element => {
              element.imageurl=this.apiurl+element.image
              console.log("elem",element.size)
              element.sizename=this.size_list_object[element.size]!=undefined?this.size_list_object[element.size]:''
              console.log("elementsize",this.category_list_object[3],element.sizename)
              element.category_name=this.category_list_object[element.category]
              element.sub_category_name=this.subcategory_object[element.subcategory]
              element.store_name=this.suppler_list_object[element.supplier]
            });
            console.log('list',this.product_list)
          })
 }
 
logout()
{
  localStorage.removeItem('login_credintels')
  window.location.reload()
}
cart()
{
  
}
}
