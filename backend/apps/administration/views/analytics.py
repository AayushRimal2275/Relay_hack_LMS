from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.db.models import Count, Sum
from django.contrib.auth.models import User

from ..models import Course, Event, EventRegistration, Payment
from ..serializers import DashboardStatsSerializer
from apps.companies.models import Company, JobPosting
from apps.accounts.models import LearnerProfile


class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        total_users = User.objects.count()
        total_courses = Course.objects.count()
        published_courses = Course.objects.filter(is_published=True).count()
        total_events = Event.objects.count()
        upcoming_events = Event.objects.filter(status='upcoming').count()
        total_revenue = Payment.objects.filter(status='completed').aggregate(
            total=Sum('amount')
        )['total'] or 0
        total_employers = Company.objects.count()
        total_job_postings = JobPosting.objects.count()
        total_enrollments = Course.objects.aggregate(
            total=Sum('enrollment_count')
        )['total'] or 0
        recent_payments = Payment.objects.filter(status='completed').order_by('-created_at')[:10]

        data = {
            'total_users': total_users,
            'total_courses': total_courses,
            'published_courses': published_courses,
            'total_events': total_events,
            'upcoming_events': upcoming_events,
            'total_revenue': total_revenue,
            'total_employers': total_employers,
            'total_job_postings': total_job_postings,
            'total_enrollments': total_enrollments,
            'recent_payments': recent_payments,
        }

        serializer = DashboardStatsSerializer(data)
        return Response(serializer.data)


class CourseAnalyticsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Courses by track
        by_track = Course.objects.values('track').annotate(
            count=Count('id')
        ).order_by('-count')

        # Courses by status (published/unpublished)
        by_status = [
            {'status': 'published', 'count': Course.objects.filter(is_published=True).count()},
            {'status': 'draft', 'count': Course.objects.filter(is_published=False).count()},
        ]

        # Enrollment trend (last 6 months)
        from django.utils import timezone
        import datetime
        six_months_ago = timezone.now() - datetime.timedelta(days=180)
        enrollment_trend = []
        for i in range(6):
            month_start = six_months_ago + datetime.timedelta(days=30*i)
            month_end = month_start + datetime.timedelta(days=30)
            count = Course.objects.filter(
                created_at__gte=month_start,
                created_at__lt=month_end
            ).aggregate(total=Sum('enrollment_count'))['total'] or 0
            enrollment_trend.append({
                'month': month_start.strftime('%b'),
                'enrollments': count
            })

        return Response({
            'by_track': list(by_track),
            'by_status': by_status,
            'enrollment_trend': enrollment_trend,
        })


class EventAnalyticsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Events by type
        by_type = Event.objects.values('event_type').annotate(
            count=Count('id')
        ).order_by('-count')

        # Events by status
        by_status = Event.objects.values('status').annotate(
            count=Count('id')
        ).order_by('-count')

        # Upcoming events
        from django.utils import timezone
        upcoming = Event.objects.filter(
            start_date__gte=timezone.now()
        ).order_by('start_date')[:10]
        upcoming_data = [{
            'title': e.title,
            'start_date': e.start_date,
            'status': e.status,
        } for e in upcoming]

        return Response({
            'by_type': list(by_type),
            'by_status': list(by_status),
            'upcoming': upcoming_data,
        })


class RevenueAnalyticsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Monthly revenue (last 6 months)
        from django.utils import timezone
        import datetime
        six_months_ago = timezone.now() - datetime.timedelta(days=180)
        monthly = []
        for i in range(6):
            month_start = six_months_ago + datetime.timedelta(days=30*i)
            month_end = month_start + datetime.timedelta(days=30)
            revenue = Payment.objects.filter(
                status='completed',
                created_at__gte=month_start,
                created_at__lt=month_end
            ).aggregate(total=Sum('amount'))['total'] or 0
            monthly.append({
                'month': month_start.strftime('%b'),
                'revenue': float(revenue)
            })

        # Revenue by payment method
        by_method = Payment.objects.filter(status='completed').values(
            'payment_method'
        ).annotate(
            total=Sum('amount')
        ).order_by('-total')

        return Response({
            'monthly': monthly,
            'by_method': list(by_method),
        })
