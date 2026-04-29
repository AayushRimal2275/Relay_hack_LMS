"""
Admin API endpoints (all require authentication):
  GET    /api/admin/analytics/dashboard/
  GET    /api/admin/analytics/courses/
  GET    /api/admin/analytics/events/
  GET    /api/admin/analytics/revenue/

  GET/POST        /api/admin/courses/
  GET/PUT/DELETE  /api/admin/courses/<id>/

  GET/POST        /api/admin/events/
  GET/PUT/DELETE  /api/admin/events/<id>/
  GET             /api/admin/events/<id>/registrations/
  PATCH           /api/admin/events/registrations/<id>/

  GET/POST        /api/admin/payments/
  GET/PUT/DELETE  /api/admin/payments/<id>/

  GET             /api/admin/users/
  GET/PUT/PATCH   /api/admin/users/<id>/

  GET/POST        /api/admin/employers/
  GET/PUT/DELETE  /api/admin/employers/<id>/

  GET/POST        /api/admin/jobs/
  GET/PUT/DELETE  /api/admin/jobs/<id>/
"""
from django.urls import path
from administration.views.analytics import (
    DashboardStatsView, CourseAnalyticsView,
    EventAnalyticsView, RevenueAnalyticsView,
)
from administration.views.courses import CourseListCreateView, CourseDetailView
from administration.views.events import (
    EventListCreateView, EventDetailView,
    EventRegistrationListView, EventRegistrationDetailView,
)
from administration.views.payments import PaymentListCreateView, PaymentDetailView
from administration.views.users import UserListView, UserDetailView
from administration.views.employers import EmployerListCreateView, EmployerDetailView
from administration.views.jobs import JobPostingListCreateView, JobPostingDetailView

urlpatterns = [
    # ── Analytics ──────────────────────────────────────────────────────────
    path("analytics/dashboard/", DashboardStatsView.as_view(), name="analytics-dashboard"),
    path("analytics/courses/", CourseAnalyticsView.as_view(), name="analytics-courses"),
    path("analytics/events/", EventAnalyticsView.as_view(), name="analytics-events"),
    path("analytics/revenue/", RevenueAnalyticsView.as_view(), name="analytics-revenue"),
    # ── Courses ─────────────────────────────────────────────────────────────
    path("courses/", CourseListCreateView.as_view(), name="course-list"),
    path("courses/<int:pk>/", CourseDetailView.as_view(), name="course-detail"),
    # ── Events ──────────────────────────────────────────────────────────────
    path("events/", EventListCreateView.as_view(), name="event-list"),
    path("events/<int:pk>/", EventDetailView.as_view(), name="event-detail"),
    path("events/<int:event_id>/registrations/", EventRegistrationListView.as_view(), name="event-registrations"),
    path("events/registrations/<int:pk>/", EventRegistrationDetailView.as_view(), name="registration-detail"),
    # ── Payments ────────────────────────────────────────────────────────────
    path("payments/", PaymentListCreateView.as_view(), name="payment-list"),
    path("payments/<int:pk>/", PaymentDetailView.as_view(), name="payment-detail"),
    # ── Users ───────────────────────────────────────────────────────────────
    path("users/", UserListView.as_view(), name="user-list"),
    path("users/<int:pk>/", UserDetailView.as_view(), name="user-detail"),
    # ── Employers ───────────────────────────────────────────────────────────
    path("employers/", EmployerListCreateView.as_view(), name="employer-list"),
    path("employers/<int:pk>/", EmployerDetailView.as_view(), name="employer-detail"),
    # ── Jobs ────────────────────────────────────────────────────────────────
    path("jobs/", JobPostingListCreateView.as_view(), name="job-list"),
    path("jobs/<int:pk>/", JobPostingDetailView.as_view(), name="job-detail"),
]
