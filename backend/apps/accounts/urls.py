from django.urls import path

from .views import (
    LoginView,
    LogoutView,
    MeView,
    PerfilVARKView,
    RegistroView,
    VARKCompletarTestView,
    VARKGenerarTestView,
)

urlpatterns = [
    # CU-01: Registro
    path('registro/', RegistroView.as_view(), name='accounts-registro'),

    # CU-02: Autenticación
    path('login/', LoginView.as_view(), name='accounts-login'),
    path('logout/', LogoutView.as_view(), name='accounts-logout'),
    path('me/', MeView.as_view(), name='accounts-me'),

    # CU-03: Test VARK
    path('vark/test/', VARKGenerarTestView.as_view(), name='vark-generar'),
    path('vark/completar/', VARKCompletarTestView.as_view(), name='vark-completar'),
    path('vark/perfil/', PerfilVARKView.as_view(), name='vark-perfil'),
]
