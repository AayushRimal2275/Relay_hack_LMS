from django.db.models import Sum, Count, Q
from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser

from administration.models import Course, Event, Payment, Employer, JobPosting
from administration.serializers import PaymentSerializer
from .utils import success


class DashboardStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        total_revenue = (
            Payment.objects.filter(status="completed")
            .aggregate(total=Sum("amount"))["total"] or 0
        )
        recent_payments = Payment.objects.select_related("user", "course").order_by("-created_at")[:5]

        data = {
            "total_users": User.objects.filter(is_active=True).count(),
            "total_courses": Course.objects.count(),
            "published_courses": Course.objects.filter(is_published=True).count(),
            "total_events": Event.objects.count(),
            "upcoming_events": Event.objects.filter(status="upcoming").count(),
            "total_revenue": total_revenue,
            "total_employers": Employer.objects.filter(is_active=True).count(),
            "total_job_postings": JobPosting.objects.filter(status="open").count(),
            "total_enrollments": Course.objects.aggregate(total=Sum("enrollment_count"))["total"] or 0,
            "recent_payments": PaymentSerializer(recent_payments, many=True).data,
        }
        return Response(success(data))


class CourseAnalyticsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        by_track = list(
            Course.objects.values("track")
            .annotate(count=Count("id"), enrollments=Sum("enrollment_count"))
            .order_by("-count")
        )
        by_level = list(
            Course.objects.values("level")
            .annotate(count=Count("id"))
        )
        top_courses = list(
            Course.objects.order_by("-enrollment_count")
            .values("id", "title", "track", "enrollment_count", "price")[:10]
        )
        return Response(success({
            "by_track": by_track,
            "by_level": by_level,
            "top_courses": top_courses,
        }))


class EventAnalyticsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        by_type = list(
            Event.objects.values("event_type")
            .annotate(count=Count("id"))
        )
        by_status = list(
            Event.objects.values("status")
            .annotate(count=Count("id"))
        )
        top_events = list(
            Event.objects.annotate(reg_count=Count("registrations"))
            .order_by("-reg_count")
            .values("id", "title", "event_type", "status", "reg_count")[:10]
        )
        return Response(success({
            "by_type": by_type,
            "by_status": by_status,
            "top_events": top_events,
        }))


class RevenueAnalyticsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        by_status = list(
            Payment.objects.values("status")
            .annotate(count=Count("id"), total=Sum("amount"))
        )
        by_method = list(
            Payment.objects.filter(status="completed")
            .values("payment_method")
            .annotate(count=Count("id"), total=Sum("amount"))
        )
        # Monthly revenue for current year
        from django.db.models.functions import TruncMonth
        monthly = list(
            Payment.objects.filter(
                status="completed",
                created_at__year=timezone.now().year,
            )
            .annotate(month=TruncMonth("created_at"))
            .values("month")
            .annotate(total=Sum("amount"), count=Count("id"))
            .order_by("month")
        )
        # Convert datetimes to strings for JSON
        for m in monthly:
            if m["month"]:
                m["month"] = m["month"].strftime("%Y-%m")

        return Response(success({
            "by_status": by_status,
            "by_method": by_method,
            "monthly_revenue": monthly,
        }))
