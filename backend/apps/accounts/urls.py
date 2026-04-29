from django.urls import path
from .views import EmployerRegisterView

urlpatterns = [
    path('employer/register/', EmployerRegisterView.as_view(), name='employer_register'),
]
