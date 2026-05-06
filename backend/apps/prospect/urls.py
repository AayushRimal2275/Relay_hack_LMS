from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProfileView, EnrollmentView, CertificateView

router = DefaultRouter()
router.register(r'profile', ProfileView, basename='profile')
router.register(r'enrollments', EnrollmentView, basename='enrollment')
router.register(r'certificates', CertificateView, basename='certificate')

urlpatterns = [
    path('', include(router.urls)),
]
