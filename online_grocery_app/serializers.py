from rest_framework import serializers
from rest_framework.fields import ReadOnlyField
from .models import Customer
from .models import Product
from .models import product_Size
from .models import Supplier
from .models import Category
from rest_framework.validators import UniqueValidator
from .models import Cart
from .models import CartItem
from .models import Order
from .models import OrderItem
from .models import billing_detail
from django.contrib.auth.password_validation import validate_password

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'






class RegisterSerializer(serializers.ModelSerializer):
    
 class Meta:
        model = Customer
        fields = ('name','username', 'password', 'email', 'phonenumber', 'password','address')
        extra_kwargs = {
            'username': {'required': True},
            'password': {'required': True},
            'email':{'required': True}
        }

class OrderRegister(serializers.ModelSerializer):
    
 class Meta:
        model = Order
        fields = '__all__'
        extra_kwargs = {
            'userId': {'required': True},
            'total': {'required': True},
            'payment_id':{'required': True}
        }

class OrderItemSerlizer(serializers.ModelSerializer):
    
 class Meta:
        model = OrderItem
        fields = '__all__'
        extra_kwargs = {
            'orderId': {'required': True},
            'productId': {'required': True},
            'quantity':{'required': True},
            'size':{'required': True},
            'category':{'required': True},
            'subcategory':{'required': True},
            'order_date':{'required': True}
        }

class ProductRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ('name','size', 'descripation', 'supplier', 'matericalType', 'category','subcategory','price','companyname','image')
        extra_kwargs = {
            'name': {'required': True},
            'size': {'required': True},
            'supplier':{'required': True},
            'category':{'required': True},
            'subcategory':{'required': True},
            'price':{'required': True}
            }
class addCart(serializers.ModelSerializer):
    CustomerId=UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=Customer.objects.all(), source='Customer', write_only=True)
    class Meta:
        model = Cart
        depth = 1
        fields = '__all__'
        
class CartDetails(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = '__all__'

class Sizeseralizer(serializers.ModelSerializer):
    class Meta:
         model = product_Size
         fields = '__all__'

class supplierSeralizer(serializers.ModelSerializer):
    class Meta:
         model = Supplier
         fields = '__all__'
class categorySeralizer(serializers.ModelSerializer):
    class Meta:
         model = Category
         fields = '__all__'
        

class CartitemSerailzer(serializers.ModelSerializer):
    
    class Meta:
        model = CartItem
        fields = '__all__'

class CartlistSerailzer(serializers.ModelSerializer):
   cartlist=CartitemSerailzer(many=True, read_only=True)
#    cart_list = serializers.PrimaryKeyRelatedField(queryset=Cart.objects.all(), source='cart', write_only=True)
   class Meta:
        model = Cart
        fields = '__all__'

class OrderitemSerailzer(serializers.ModelSerializer):
    
    class Meta:
        model = OrderItem
        fields = '__all__'

class OrderlistSerailzer(serializers.ModelSerializer):
   order_list=OrderitemSerailzer(many=True, read_only=True)
#    cart_list = serializers.PrimaryKeyRelatedField(queryset=Cart.objects.all(), source='cart', write_only=True)
   class Meta:
        model = Order
        fields = '__all__'

class BillingSerlizer(serializers.ModelSerializer):
   
#    cart_list = serializers.PrimaryKeyRelatedField(queryset=Cart.objects.all(), source='cart', write_only=True)
   class Meta:
        model = billing_detail
        fields = '__all__'


