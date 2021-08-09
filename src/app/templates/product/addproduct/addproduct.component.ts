import { Component, OnInit } from '@angular/core';
import { FormControl,FormGroup,FormBuilder,Validators } from '@angular/forms';
import { ProductService } from 'src/app/service/product.service';
import { HttpClient, HttpHeaders,HttpParams } from '@angular/common/http';
@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.css']
})
export class AddproductComponent implements OnInit {
 productform:any
 suppler_list=[]
 category_list=[]
 size_list=[]
 sub_category=[]
 subcategory=[]
  constructor(private formBuilder: FormBuilder,private http:HttpClient,private productservice:ProductService) { }

  ngOnInit(): void {
    this.productform = this.formBuilder.group({
      name: ['', Validators.required],
      descripation: ['', Validators.required],
      materialtype: ['',[ Validators.required]],
      supplier: ['', [Validators.required]],
      category: ['', Validators.required],
      subcategory: ['', Validators.required],
      size: ['', Validators.required],
      price: ['', Validators.required],
      image:['',Validators.required],
      filesource:['',Validators.required],
      companyname:['',Validators.required]
    });
this.productservice.producr_size_list().subscribe(cal1=>
  {
    this.size_list.push(...cal1['list'])
    console.log("sizelist",this.size_list)
  })

  this.productservice.product_category_list().subscribe(cal1=>
    {
      this.category_list.push(...cal1['list'])
      this.subcategory.push(...cal1['subcategory'])
    })
    this.productservice.supplier_list().subscribe(cal1=>
      {
        this.suppler_list.push(...cal1['list'])
      })
  }
  get f() {
    console.log(this.productform.controls);
    return this.productform.controls;
  }

  onFileChange(event) {
  
    if (event.target.files.length > 0) {
      console.log("event",event)
      const file = event.target.files[0];
      this.productform.get('filesource').setValue(file);
    }
    console.log("form",this.productform)
  }
  categorychange(value)
  {
    this.sub_category=[]
console.log('value',value)
let filtervalue=this.subcategory.filter(val=>val.parentCategory==value)
this.sub_category.push(...filtervalue)
console.log('category',this.sub_category)
  }
  subcategorychange(value)
  {
     

this.size_list=this.size_list.filter(val=>val.sub_category==value)
console.log('value',this.size_list)
 
  }
  onSubmit()
  {
    
   
    let customer_body=new FormData();
     customer_body.append('name',this.productform.value.name );
     customer_body.append('size',this.productform.value.size );
     customer_body.append('supplier',this.productform.value.supplier );
     customer_body.append('descripation',this.productform.value.descripation );
    customer_body.append('matericalType',this.productform.value.materialtype );
     customer_body.append('subcategory', this.productform.value.subcategory);
     customer_body.append('category', this.productform.value.category);
      customer_body.append('price', this.productform.value.price);
     customer_body.append('image', this.productform.value.filesource);
      customer_body.append('companyname', this.productform.value.companyname);
    console.log("signup",this.productform,customer_body)
    
    this.productservice.add_product(customer_body).subscribe(val1=>
      {

      })
  }

}
