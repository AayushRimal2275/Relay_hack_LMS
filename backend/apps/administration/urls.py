from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views.courses import CourseViewSet
from .views.events import EventViewSet
from .views.registrations import EventRegistrationViewSet
from .views.payments import PaymentViewSet
from .views.analytics import (
    DashboardStatsView, CourseAnalyticsView, 
    EventAnalyticsView, RevenueAnalyticsView
)

router = DefaultRouter()
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'events', EventViewSet, basename='event')
router.register(r'registrations', EventRegistrationViewSet, basename='registration')
router.register(r'payments', PaymentViewSet, basename='payment')

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard-stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('analytics/courses/', CourseAnalyticsView.as_view(), name='analytics-courses'),
    path('analytics/events/', EventAnalyticsView.as_view(), name='analytics-events'),
    path('analytics/revenue/', RevenueAnalyticsView.as_view(), name='analytics-revenue'),
]
