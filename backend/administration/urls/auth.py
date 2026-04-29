"""
Auth endpoints:
  POST /api/auth/login/   → obtain JWT tokens
  POST /api/auth/refresh/ → refresh access token
  POST /api/auth/logout/  → blacklist / client-side logout
"""
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from administration.views.auth import LoginView, LogoutView

urlpatterns = [
    path("login/", LoginView.as_view(), name="auth-login"),
    path("refresh/", TokenRefreshView.as_view(), name="auth-refresh"),
    path("logout/", LogoutView.as_view(), name="auth-logout"),
]
