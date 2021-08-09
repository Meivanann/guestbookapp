import { Component, OnInit,Input } from '@angular/core';
import { ProductService } from 'src/app/service/product.service';
import { HttpClient, HttpHeaders,HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment'
import { OrderService } from 'src/app/service/order.service'; 
@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  
  @Input() productData: any;
  apiurl=environment.serviceUrl
  size_list_object:any={}
  category_list_object:any={}
  subcategory_object:any={}
  suppler_list_object:any={}
  sub_category=[]
  subcategory=[]
  suppler_list=[]
  count=0
  category_list=[]
  size_list=[]
  product_details:any
  constructor(private http:HttpClient,private productservice:ProductService,private Orderservice:OrderService) { }

  ngOnInit(): void {
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
    this.product_details=this.productData
    console.log('product_details',this.product_details)
 
      let customer_body=new HttpParams();
    customer_body = customer_body.set('Product_id',this.productData.id );
    setTimeout(() => {
      this.productservice.product_details(customer_body).subscribe(val1=>
        {
          
  this.productData=val1['list'][0]
  console.log('product_details',this.productData)
 
  this.productData.imageurl=this.apiurl+this.productData.image
    console.log("elem",this.productData.size)
    this.productData.sizename=this.size_list_object[this.productData.size]!=undefined?this.size_list_object[this.productData.size]:''
    console.log("elementsize",this.category_list_object[3],this.productData.sizename)
    this.productData.category_name=this.category_list_object[this.productData.category]
    this.productData.sub_category_name=this.subcategory_object[this.productData.subcategory]
    this.productData.store_name=this.suppler_list_object[this.productData.supplier]
 
        })
    }, 1000);
 
    
   
    

  }
  increasecount()
  {
   ++this.count
  }
  decreasecount()
  {
    --this.count
  }
  add_cart()
  {
    let logincredentials=JSON.parse(localStorage.getItem('login_credintels'))
    let cart_body=new HttpParams();
    cart_body = cart_body.set('user_id',logincredentials['id']);
    cart_body = cart_body.set('size',this.productData.size );
    cart_body = cart_body.set('productId',this.productData.id );
    cart_body = cart_body.set('quantity',this.count.toString());
    
    this.Orderservice.add_cart(cart_body).subscribe(val1=>
      {
if(val1['status']==1)
{
  document.location.reload()
}
      })
  }
  imagezommer(imgID,event: MouseEvent)
  {
     
    let img=document.getElementById(imgID)
  let lens=document.getElementById('lens')
  lens.style.backgroundImage=`url(${this.productData.imageurl})`
  let ratio=3
  lens.style.backgroundSize=(img.offsetWidth * ratio ) +'px ' + (img.offsetHeight *ratio)+'px'
  img.addEventListener("mousemove", moveLens)
    lens.addEventListener("mousemove", moveLens)
    img.addEventListener("touchmove", moveLens)
  
    function moveLens(){
        /*
        Function sets sets position of lens over image and background image of lens
        1 - Get cursor position
        2 - Set top and left position using cursor position - lens width & height / 2
        3 - Set lens top/left positions based on cursor results
        4 - Set lens background position & invert
        5 - Set lens bounds
    
        */
  
        //1
        let pos = getCursor()
        console.log('pos:', pos)
  
        //2
        let positionLeft = pos.x - (lens.offsetWidth / 2)
        let positionTop = pos.y - (lens.offsetHeight / 2)
  
        //5
        if(positionLeft < 0 ){
            positionLeft = 0
        }
  
        if(positionTop < 0 ){
            positionTop = 0
        }
  
        if(positionLeft > img.offsetWidth - lens.offsetWidth /3 ){
            positionLeft = img.offsetWidth - lens.offsetWidth /3
        }
  
        if(positionTop > img.offsetHeight - lens.offsetHeight /3 ){
            positionTop = img.offsetHeight - lens.offsetHeight /3
        }
  
  
        //3
        lens.style.left = positionLeft + 'px';
        lens.style.top = positionTop + 'px';
  
        //4
        lens.style.backgroundPosition = "-" + (pos.x * ratio) + 'px -' +  (pos.y * ratio) + 'px'
    }
  
    function getCursor(){
        /* Function gets position of mouse in dom and bounds
         of image to know where mouse is over image when moved
        
        1 - set "e" to window events
        2 - Get bounds of image
        3 - set x to position of mouse on image using pageX/pageY - bounds.left/bounds.top
        4- Return x and y coordinates for mouse position on image
        
         */
  
        let e = Event
        let bounds = img.getBoundingClientRect()
  
        console.log('e:', event)
        console.log('bounds:', bounds)
        let x = event.pageX - bounds.left
        let y = event.pageY - bounds.top
        x = x - window.pageXOffset;
        y = y - window.pageYOffset;
        
        return {'x':x, 'y':y}
    }
  }
  

}
