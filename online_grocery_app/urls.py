from django.urls import path
from online_grocery_app import views

urlpatterns = [
    path('', views.index,name='read'),
    path('create/', views.create,name='create'),
    path('update/<int:id>', views.update,name='update'),
    path('delete/', views.delete,name='delete'),
    path('register/', views.register,name='register'),
    path('login', views.login,name='login'),
    path('productlist', views.product_list,name='product_list'),
    path('productdetails', views.product_details,name='product_details'),
    path('customer_register', views.Customer_registration,name='customer_register'),
    path('product_register', views.Product_register,name='product_register'),
    path('product_size', views.product_size_list,name='product_size_list'),
    path('supplier_list', views.product_supplier_list,name='product_supplier_list'),
    path('category_list', views.product_category_list,name='product_category_list'),
    path('add_cart', views.add_Cart,name='add_cart'),
    path('add_order', views.add_Order,name='add_order'),
    path('cart_list', views.cart_list,name='cart_list'),
    path('order_list', views.order_list,name='order_list'),
    path('inc_dec_quanity', views.inc_dec_qty,name='inc_dec'),
    path('billing_register', views.billing_registration,name='billing_register')
   
   

]
