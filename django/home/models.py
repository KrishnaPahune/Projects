from django.contrib.auth.models import User
from django.db import models
from datetime import datetime
from phonenumber_field.modelfields import PhoneNumberField
# Create your models here.
class Contact(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()
    date = models.DateField(default=datetime.today())
    
    def __str__(self):
            return self.name
    
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    mobile = PhoneNumberField()
    def __str__(self):
         return self.user.username