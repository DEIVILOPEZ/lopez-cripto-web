from django.urls import path
from . import views

urlpatterns = [
    # TUS RUTAS ANTERIORES (ejemplo si tenías vistas previas):
    # path('', views.mi_vista_anterior, name='home'),

    # RUTA DE AUTENTICACIÓN
    path('auth/', views.auth_user, name='auth_user'),
]