from django import forms
from django.forms import fields
from online_grocery_app.models import Product
from django.contrib.auth.forms import UserCreationForm
from online_grocery_app.models import Customer
class studentForms(forms.ModelForm):
    class Meta:
        model=Product
        fields='__all__'


class RegisterForm(forms.ModelForm):
    
    class Meta:
             model = Customer
             fields = ['username','name','email','password','phonenumber','address']
 