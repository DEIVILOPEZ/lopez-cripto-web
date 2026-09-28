from django.urls import path
from . import views

urlpatterns = [
    path('', views.lopez_cripto, name='home'),
]