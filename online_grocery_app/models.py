from typing import Sized
from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes import fields
# Create your models here.





class Category(models.Model):
    category_name=models.CharField(max_length=30)
    desripation=models.CharField(max_length=100)
    status=models.CharField(max_length=4)
    parentCategory=models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True) 
def __str__(self):
        return self.category_name
class Supplier(models.Model):
    store_name=models.CharField(max_length=20)
    address=models.CharField(max_length=10)
    category=models.ForeignKey(Category,on_delete=models.CASCADE)
    subcategory=models.IntegerField(default=0)
    # goods_type=models.CharField(max_length=50)
    city=models.CharField(max_length=10)
    email=models.EmailField()
    phone_number=models.CharField(max_length=10)
    state=models.CharField(max_length=10)
    postal_code=models.CharField(max_length=30)
    status=models.CharField(max_length=4)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True) 

    def __str__(self):
        return self.store_name
    
class Customer(models.Model):
   
    name = models.CharField(max_length=10)
    username = models.CharField(max_length=10)
    address=models.CharField(max_length=50)
    email=models.EmailField()
    phonenumber=models.CharField(max_length=10)
    password=models.CharField(max_length=20)
    
    def __str__(self):
        return  self.name



class product_Size(models.Model):
    size_name=models.CharField(max_length=10)
    category=models.ForeignKey(Category,on_delete=models.CASCADE)
    sub_category=models.IntegerField(default=0)
    price=models.CharField(max_length=20)
    
def __str__(self):
        return  self.size_name
class Product(models.Model):
    name=models.CharField(max_length=50)
    size=models.ForeignKey(product_Size,on_delete=models.CASCADE)
    descripation=models.CharField(max_length=50)
    supplier=models.ForeignKey(Supplier,on_delete=models.CASCADE,blank=True)
    matericalType=models.CharField(max_length=50)
    category=models.ForeignKey(Category,on_delete=models.CASCADE)
    subcategory=models.IntegerField(default=0)
    price=models.CharField(max_length=50,default=0)
    companyname=models.CharField(max_length=50)
    image = models.ImageField(upload_to='images/',blank=True,null=True)
    def __str__(self):
        return  self.name


class Cart(models.Model):
    Customer=models.ForeignKey(Customer,on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class CartItem(models.Model):
    productId=models.ForeignKey(Product,on_delete=models.CASCADE)
    quantity=models.CharField(max_length=10)
    size=models.CharField(max_length=10,blank=True)
    cart=models.ForeignKey(Cart,related_name='cartlist',on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Order(models.Model):
    userId=models.ForeignKey(Customer,on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    total=models.CharField(max_length=10,blank=True)
    payment_id=models.CharField(max_length=10,blank=True)

class OrderItem(models.Model):
    orderId=models.ForeignKey(Order,related_name='order_list',on_delete=models.CASCADE)
    productId=models.ForeignKey(Product,on_delete=models.CASCADE)
    quantity=models.CharField(max_length=10)
    size=models.CharField(max_length=20)
    category=models.ForeignKey(Category,on_delete=models.CASCADE)
    subcategory=models.IntegerField(default=0)
    order_date=models.CharField(max_length=30)
    status=models.CharField(max_length=4)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
 
class payment_detail(models.Model):
    order_id=models.ForeignKey(Order,on_delete=models.CASCADE)
    amount=models.CharField(max_length=10)
    provider=models.CharField(max_length=50)
    category=models.ForeignKey(Category,on_delete=models.CASCADE)
    subcategory=models.IntegerField(default=0)
    payment_date=models.CharField(max_length=30)
    status=models.CharField(max_length=4)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True) 

    def __str__(self):
        return self.provider


class billing_detail(models.Model):
    first_name=models.CharField(max_length=30)
    last_name=models.CharField(max_length=40)
    company_name=models.CharField(max_length=50)
    address1=models.CharField(max_length=100)
    address2=models.CharField(max_length=150)
    country=models.CharField(max_length=10)
    postcode=models.CharField(max_length=50)
    city=models.CharField(max_length=4)
    mobile_number=models.CharField(max_length=20)
    email = models.EmailField()
    order=models.CharField(max_length=100)
    user = models.ForeignKey(Customer,related_name="user",on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True) 

def __str__(self):
        return  self.first_name

class Invoice(models.Model):
    user_id=models.ForeignKey(Customer,on_delete=models.CASCADE)
    payment_id=models.ForeignKey(payment_detail,on_delete=models.CASCADE)
    status=models.CharField(max_length=4)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True) 


class Invoice_detail(models.Model):
    invoice_id=models.ForeignKey(Invoice,on_delete=models.CASCADE)
    order_id=models.ForeignKey(Customer,on_delete=models.CASCADE)
    amount=models.CharField(max_length=10)
    category=models.ForeignKey(Category,on_delete=models.CASCADE)
    subcategory=models.IntegerField(default=0)
    order_date=models.CharField(max_length=50)
    quantity=models.CharField(max_length=20)
    status=models.CharField(max_length=4)
    size=models.CharField(max_length=10)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True) 

    def __str__(self):
        return self.size

class Stock_detail(models.Model):
    supplier=models.ForeignKey(Supplier,on_delete=models.CASCADE)
    category=models.ForeignKey(Category,on_delete=models.CASCADE)
    size=models.ForeignKey(product_Size,on_delete=models.CASCADE)
    stock_count=models.IntegerField(default=0)
    sub_category=models.IntegerField(default=0)
    desripation=models.CharField(max_length=100)
    status=models.CharField(max_length=4)
    amount=models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)



     




     