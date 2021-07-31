from email.mime.text import MIMEText
import os
from os import path
from django.template import Context, context
from django.http import response
from email.mime.image import MIMEImage

from django.http.request import QueryDict
from django.template.loader import render_to_string,get_template
from django.core.mail import EmailMessage
from rest_framework import viewsets
from rest_framework.parsers import JSONParser
from email.mime.multipart import MIMEMultipart
from rest_framework.response import Response
from django.shortcuts import redirect, render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from django.core import serializers
from django.core.mail import send_mail,EmailMultiAlternatives
from django.conf import settings
from rest_framework.serializers import Serializer
from online_grocery_app.forms import studentForms
from online_grocery_app.models import Cart, CartItem, Category, Product
from online_grocery_app.models import Customer
from online_grocery_app.models import product_Size
from online_grocery_app.models import Supplier
from online_grocery_app.models import Order
from online_grocery_app.models import OrderItem
from online_grocery_app.forms import RegisterForm
 
import json
from .serializers import  CartlistSerailzer, UserSerializer, categorySeralizer
from .serializers import ProductSerializer
from .serializers import RegisterSerializer
from .serializers import ProductRegisterSerializer
from .serializers import Sizeseralizer
from .serializers import supplierSeralizer
from .serializers import addCart
from .serializers import CartDetails
from .serializers import OrderRegister
from .serializers import OrderItemSerlizer
from .serializers import OrderlistSerailzer
from .serializers import OrderItemSerlizer
from .serializers import OrderitemSerailzer
from .serializers import BillingSerlizer
from django.http import HttpResponse

from django.views.decorators.csrf import csrf_exempt
# Create your views here.


# @login_required(login_url="/users/login")

@csrf_exempt
def login(request):
#   data =list(Customer.objects.values())
#   return JsonResponse(data,safe = False)
 print('object',request.POST.get('username'))
 if request.method == "POST":

     datas = Customer.objects.filter(username=request.POST.get('username'))
     if datas.exists():
      checkpassword=datas.filter(password=request.POST.get('password'))
      print('checkpassword',checkpassword.exists())
      if checkpassword.exists():
         
         serializer_class = UserSerializer(instance=checkpassword,many=True)
     
         return JsonResponse({"status":1,'message':'login successfully',"data":serializer_class.data})
      else:
         return JsonResponse({"status":0,'message':'Password is  incorrect'})

 
     else:
      return JsonResponse({"status":0,"message":"User is not found"})
     
@csrf_exempt
###Product list####
def product_list(request):
     queryset=''
     if request.method=='POST':
          searchdata=request.POST.get('search')
          print("searchdata",bool(searchdata))
          if bool(searchdata)==False:
            queryset=Product.objects.all()
            serlizerclass=ProductSerializer(instance=queryset,many=True)
            return JsonResponse({'status':1,'message':'Product list','list':serlizerclass.data})
          else:
              
              queryset=Product.objects.filter(name=searchdata)
              serlizerclass=ProductSerializer(instance=queryset,many=True)
          return JsonResponse({'status':1,'message':'Product list','list':serlizerclass.data})
     else:
          return JsonResponse({'status':0,'message':'Method is not found'})
@csrf_exempt
###Product list by id####
def product_details(request):
     print('method',request.method)
     if request.method=='POST':
          queryset=Product.objects.filter(id=request.POST.get('Product_id'))
          serlizerclass=ProductSerializer(instance=queryset,many=True)
          return JsonResponse({'status':1,'message':'Product list','list':serlizerclass.data})
     else:
          return JsonResponse({'status':0,'message':'Method is not found'})


@csrf_exempt
def Customer_registration(request):
 if request.method == "POST":
   checkusername=Customer.objects.filter(username=request.POST.get('username'))
   usernamevalue=checkusername.exists()
   if usernamevalue==False:
     print("conditon")
     serlizer_regitser=RegisterSerializer(data=request.POST)
     if serlizer_regitser.is_valid():
       serlizer_regitser.save()
       return JsonResponse({'status':1,'message':'Register done','errors':serlizer_regitser.errors})
     else:
        return JsonResponse({'status':0,'errors':serlizer_regitser.errors})
   else:
        return JsonResponse({'status':0,'message':'Username alreday found'})

@csrf_exempt
def my_mail(request,email,html_path,postdata):  
        subject = "Order Confirmaiton mail"  

        msg     =get_template(html_path).render({"postdata":postdata['order_details']})  
        to      = email 
      
        data = EmailMultiAlternatives(subject,msg,settings.EMAIL_HOST_USER,[to])
        
        data.content_subtype='related'
     
        for item in postdata['product_images']:
         img_dir = 'media\images'
         image = item['imagename']
        file_path = os.path.join(img_dir, image)
        print('path',file_path)
        with open(file_path,"rb") as f:
         img = MIMEImage(f.read())
        img.add_header('Content-ID', '<{image}>')
        img.add_header('Content-Disposition', 'inline', filename=image)
     #    msg=MIMEText('<p>Test Image<img src="cid:"`{image}` /></p>', _subtype='html')
     #    data.content_subtype = "html"  # Main content is now text/html
        data.attach(img)
        data.attach_alternative(msg, "text/html")
        data.send()
     #    res     = send_mail(subject, msg, , [to],html_message=)  
     #    if(res == 1):  
     #        msg = "Mail Sent Successfully."  
     #    else:  
     #        msg = "Mail Sending Failed."  
     #    return HttpResponse(msg)  
@csrf_exempt
def billing_registration(request):
 if request.method == "POST":
   checkuser=Customer.objects.filter(id=request.POST.get('user'))
   userexist=checkuser.exists()
   if userexist==True:
     print("conditon")
     serlizer_regitser=BillingSerlizer(data=request.POST)
     if serlizer_regitser.is_valid():
       serlizer_regitser.save()
       return JsonResponse({'status':1,'message':'Billing added successfully','errors':serlizer_regitser.errors})
     else:
        return JsonResponse({'status':0,'errors':serlizer_regitser.errors})
   else:
        return JsonResponse({'status':0,'message':'User is not  found'})

#product Registration 
@csrf_exempt
def Product_register(request):
 
 if request.method == "POST":
      
   body={}
   checkproduct=Product.objects.filter(name=request.POST.get('name'),size=request.POST.get('size'))
   checkproductvalue=checkproduct.exists()
   if checkproductvalue==False:

     body['name']=request.POST.get('name')
     body['size']=request.POST.get('size')
     body['descripation']=request.POST.get('descripation')
     body['supplier']=request.POST.get('supplier')
     body['matericalType']=request.POST.get('matericalType')
     body['category']=request.POST.get('category')
     body['subcategory']=request.POST.get('subcategory')
     body['companyname']=request.POST.get('companyname')
     body['price']=request.POST.get('price')
     body['image']=request.FILES.get('image')

     serlizer_regitser=ProductRegisterSerializer(data=body)
     if serlizer_regitser.is_valid():
       serlizer_regitser.save()
       return JsonResponse({'status':1,'message':'Product added Successfully','errors':serlizer_regitser.errors})
     else:
       return JsonResponse({'status':0,'errors':serlizer_regitser.errors})
   else:
        return JsonResponse({'status':0,'message':'Product already added'})

@csrf_exempt
def add_Cart(request):
   if request.method == "POST":
          body={}
          body['user_id']=request.POST.get('user_id')
          print('data',request)
          cartserlizer=addCart(data=body) 
          if cartserlizer.is_valid():
            cartserlizer.save()
            
            body['size']=request.POST.get('size')
            body['productId']=request.POST.get('productId')
            body['quantity']=request.POST.get('quantity')
            body['cart']=cartserlizer.data['id']
            
            print('cartitemse',body)
            cartitemseralizer=CartDetails(data=body)
           
            if cartitemseralizer.is_valid():
              print('cartitemse',cartitemseralizer.errors)
              cartitemseralizer.save()
              return JsonResponse({'status':1,'message':'Cart  added successfully','errors':cartserlizer.data})
            else :
               return JsonResponse({'status':0,'message':'Cart  added failed','error':cartitemseralizer.errors})
          else :
               return JsonResponse({'status':0,'message':'Cart  addition failed'})
   else :
        return JsonResponse({'status':0,'message':'Method is not found'})


@csrf_exempt
def add_Order(request):
   if request.method == "POST":
         order_count=0
         order_item_count=0
         order_error=[]
         order_id_array=[]
         order_item_error=[]
         postdata=json.loads(request.body)
         item_list=postdata['order_items']
         print('s',request.body)
         for item in item_list:
           body={}
           body['userId']=postdata['userId']
           body['payment_id']=item['payment_id']
           body['total']=item['total']
           print('data',request)
           orderserlizer=OrderRegister(data=body) 
     
           if orderserlizer.is_valid():
            order_count=int(order_count) + 1
            orderserlizer.save()
           
            print('insidea lopp',order_count)
            body['size']=item['size']
            body['category']=item['category']
            body['subcategory']=item['subcategory']
            body['order_date']=item['order_date']
            body['productId']=item['productId']
            body['quantity']=item['quantity']
            body['orderId']=orderserlizer.data['id']
            body['status']=1
            order_id_array.append(orderserlizer.data['id'])
            print('cartitemse',body)
            cartitemseralizer=OrderItemSerlizer(data=body)
           
            if cartitemseralizer.is_valid():
               print('cartitemse',cartitemseralizer.errors)
               cartitemseralizer.save()
               order_item_count=int(order_item_count) + 1
            else :
               order_count=-1
               order_error.append(orderserlizer.errors)
           else :
               order_item_count=-1
               order_item_error.append(orderserlizer.errors)
         print('ordercount',order_count,order_item_count,order_error,order_item_error)
         if len(order_error)==0 & len(order_item_error)==0:
               my_mail(request,'meivannanjayalakshim@gmail.com','OrderConfrimation_email.html',postdata)
               return JsonResponse({'status':1,'message':'Order added successfully',"order_id":order_id_array})
         if len(order_error)>0:
               return JsonResponse({'status':0,'message':'Order failed','errors':order_error})
         if len(order_item_error)>0:
               return JsonResponse({'status':0,'message':'Order failed','errors':order_item_error})
   else :
        return JsonResponse({'status':0,'message':'Method is not found'})
@csrf_exempt
def cart_list(request):
   if request.method == "POST":
          body={}
          
          data=Cart.objects.filter(Customer=request.POST.get('user_id'))
          
          cartlistserlizer=CartlistSerailzer(instance=data,many=True)
          # cartlistserlizer.is_valid()
          print('name',cartlistserlizer)
          return JsonResponse({'status':1,'message':'Cart list','data':cartlistserlizer.data})

          
   else :
        return JsonResponse({'status':0,'message':'Method is not found'})
@csrf_exempt
def order_list(request):
   if request.method == "POST":
          body={}
          print(request.POST.get('user_id'))
          data=Order.objects.filter(userId=request.POST.get('user_id'))
          if data.exists():
           orderlistserlizer=OrderlistSerailzer(instance=data,many=True)
          # cartlistserlizer.is_valid()
           print('name',orderlistserlizer)
           return JsonResponse({'status':1,'message':'Order list','data':orderlistserlizer.data})
          else:
           return JsonResponse({'status':0,'message':'User is not found',})


          
   else :
        return JsonResponse({'status':0,'message':'Method is not found'})

def register(response):
 if response.method == "POST":
    form = RegisterForm(response.POST)
    if form.is_valid():
             form.save()
    return redirect("read")
 else:
   form = RegisterForm()
   context={
          "form":form
     }
 return render(response, "register.html", context)
def index(request):

     obj=Product.objects.all()
     return  render(request,'OrderConfrimation_email.html',{'data':obj})
def create(request):
 if request.method =='POST':
     form=studentForms(request.POST,request.FILES)
     if form.is_valid():
          form.save()
          return redirect('read')
     return redirect('create')
 else:
      form=studentForms()
      context={
          "form":form
     }
      return  render(request,'create.html',context)
def update(request,id):
    selecteddata=Product.objects.get(id=id)
    return  render(request,'product_list.html',{'data':selecteddata})
def delete(request):
     return  render(request,'delete.html')
@csrf_exempt
###Product list####
def product_size_list(request):
     category=[]
     queryset2=[]
     if request.method=='GET':
          queryset=product_Size.objects.all()
          serlizerclass=Sizeseralizer(instance=queryset,many=True)
          return JsonResponse({'status':1,'message':'Product size list','list':serlizerclass.data})
     else:
          return JsonResponse({'status':0,'message':'Method is not found'})
@csrf_exempt         
def product_supplier_list(request):
     data=[]
     if request.method=='GET':
          queryset=Supplier.objects.all()
          serlizerclass=supplierSeralizer(instance=queryset,many=True)
          return JsonResponse({'status':1,'message':'Product size list','list':serlizerclass.data})
     else:
          return JsonResponse({'status':0,'message':'Method is not found'})
@csrf_exempt         
def product_category_list(request):
     data=[]
     if request.method=='GET':
          queryset1=Category.objects.filter(parentCategory=0)
          subqueryset1=Category.objects.exclude(parentCategory=0)
          serlizerclassquerset=categorySeralizer(instance=queryset1,many=True)
          serlizerclasssubquerset=categorySeralizer(instance=subqueryset1,many=True)
          return JsonResponse({'status':1,'message':'Product category list','list':serlizerclassquerset.data,'subcategory':serlizerclasssubquerset.data})
     else:
          return JsonResponse({'status':0,'message':'Method is not found'})

@csrf_exempt         
def inc_dec_qty(request):
     data=[]
     if request.method=='POST':
          status=request.POST.get('status')
          if status=='increment':
            queryset1=CartItem.objects.filter(cart=request.POST.get('cart_id'),productId=request.POST.get('product_id'),size=request.POST.get('size_id'))
            for x in queryset1.iterator():
                 print(x.size)
                 queryset1.update(quantity=int(x.quantity) + int(request.POST.get('quantity')))
          #   serlizerclassquerset=categorySeralizer(instance=queryset1,many=True)
          
            return JsonResponse({'status':1,'message':'Product is added successfully'})
          else:
              queryset1=CartItem.objects.filter(cart=request.POST.get('cart_id'),productId=request.POST.get('product_id'),size=request.POST.get('size_id'))
              for x in queryset1.iterator():
                 print(x.size)
                 queryset1.update(quantity=int(x.quantity) - int(request.POST.get('quantity')))
              return JsonResponse({'status':1,'message':'Product is removed successfully'})
     else:
          return JsonResponse({'status':0,'message':'Method is not found'})
 