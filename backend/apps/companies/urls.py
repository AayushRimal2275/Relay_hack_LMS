from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    ApplicationViewSet,
    CompanyDetailView,
    CompanyListView,
    JobPostingViewSet,
)

router = DefaultRouter()
router.register(r'jobs', JobPostingViewSet, basename='job')
router.register(r'applications', ApplicationViewSet, basename='application')

urlpatterns = [
    path('companies/', CompanyListView.as_view(), name='company_list'),
    path('companies/<int:pk>/', CompanyDetailView.as_view(), name='company_detail'),
    path('', include(router.urls)),
]
