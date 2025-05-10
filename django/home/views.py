from django.shortcuts import render, redirect
from home.models import Contact
from home.models import UserProfile
from datetime import datetime
from django.contrib import messages
from django.contrib.auth import authenticate
from django.contrib.auth import logout, login
from django.contrib.auth.models import User
# Create your views here.
def index(request):
    if request.user.is_anonymous:
        return redirect('/login/')
    return render(request, 'index.html')

def about(request):
    return render(request, 'about.html')
def contact(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        message = request.POST.get('message')
        contact = Contact(name=name, email=email, message=message, date = datetime.today())
        contact.save()
        messages.success(request, 'Your message has been sent successfully!')
        # Here you can handle the form submission, e.g., save to database or send an email
    return render(request, 'contact.html')
def wisdom(request):
    return render(request, 'wisdom.html')
def products(request):
    return render(request, 'products.html')
def media(request):
    return render(request, 'media.html')
def guidance(request):
    return render(request, 'guidance.html')
def feedback(request):
    return render(request, 'feedback.html')
def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            # A backend authenticated the credentials
            login(request, user)
            messages.add_message(request, messages.SUCCESS, 'Login successful!')
            return redirect('/')
        else:
            # No backend authenticated the credentials
            messages.error(request, 'Invalid username or password.')
            return render(request,'login.html',{'page':'login'})
    return render(request,'login.html',{'page':'login'})

def logoutUser(request):
    logout(request)
    return redirect('/login/')

def register(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        mobile = request.POST.get('mobile')
        username = request.POST.get('username')
        password = request.POST.get('password')
        if User.objects.filter(username=username).exists():
            messages.error(request, 'Username already exists. Please choose a different one.')
            return render(request,'register.html',{'page':'register'})
        user = User.objects.create_user(first_name=name, email=email, username=username, password=password)
        user.save()
        profile = UserProfile(user=user, mobile=mobile)
        profile.save()
        messages.add_message(request, messages.SUCCESS, 'Registration successful! You can now log in.')
        return redirect('/login/',{'page':'register'})
        # Here you can handle the form submission, e.g., save to database or send an email
    return render(request, 'register.html')



  
