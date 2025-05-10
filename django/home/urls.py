from django.contrib import admin
from django.urls import path
from home import views
urlpatterns = [
    path("",views.index,name="home"),
    path("about/",views.about,name="about"),
    path("contact/",views.contact,name="contact"),
    path('wisdom/', views.wisdom, name='wisdom'),
    path('products/', views.products, name='products'),
    path('media/', views.media, name='media'),
    path('guidance/', views.guidance, name='guidance'),
    path('contact/', views.contact, name='contact'),
    path('feedback/', views.feedback, name='feedback'),
    path("login/", views.login_view, name="login"),  
    path('logout/',views.logoutUser,name='logout'),
    path('register/',views.register, name="register")
]