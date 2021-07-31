from django.contrib import admin

# Register your models here.
from online_grocery_app.models import Product
from online_grocery_app.models import Customer
from online_grocery_app.models import Cart
from online_grocery_app.models import CartItem
from online_grocery_app.models import Order
from online_grocery_app.models import OrderItem
from online_grocery_app.models import payment_detail
from online_grocery_app.models import product_Size
from online_grocery_app.models import Supplier
from online_grocery_app.models import Invoice
from online_grocery_app.models import Invoice_detail
from online_grocery_app.models import Category
from online_grocery_app.models import Stock_detail
from online_grocery_app.models import billing_detail
# Register your models here.

admin.site.register(Product)
admin.site.register(Customer)
admin.site.register(Cart)
admin.site.register(CartItem)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(payment_detail)
admin.site.register(product_Size)
admin.site.register(Supplier)
admin.site.register(Invoice)
admin.site.register(Invoice_detail)
admin.site.register(Category)
admin.site.register(Stock_detail)
admin.site.register(billing_detail)