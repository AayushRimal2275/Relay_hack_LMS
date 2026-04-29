from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    LearnerProfile, Employer, Course,
    Event, EventRegistration, Payment, JobPosting,
)


# ─── Auth ────────────────────────────────────────────────────────────────────
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


# ─── User ────────────────────────────────────────────────────────────────────
class LearnerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = LearnerProfile
        fields = ["bio", "skills", "avatar_url", "linkedin_url"]


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    learner_profile = LearnerProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = [
            "id", "username", "email", "first_name", "last_name",
            "full_name", "is_active", "is_staff", "date_joined",
            "learner_profile",
        ]
        read_only_fields = ["id", "date_joined"]

    def get_full_name(self, obj):
        return obj.get_full_name() or obj.username


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["first_name", "last_name", "email", "is_active"]


# ─── Employer ────────────────────────────────────────────────────────────────
class EmployerSerializer(serializers.ModelSerializer):
    job_count = serializers.SerializerMethodField()

    class Meta:
        model = Employer
        fields = [
            "id", "company_name", "industry", "website", "logo_url",
            "contact_email", "contact_name", "is_active",
            "job_count", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def get_job_count(self, obj):
        return obj.job_postings.count()


# ─── Course ──────────────────────────────────────────────────────────────────
class CourseSerializer(serializers.ModelSerializer):
    """Shared contract: id, title, track, youtube_video_id, thumbnail_url,
    instructor_name, is_published must remain stable."""

    class Meta:
        model = Course
        fields = [
            "id", "title", "track", "youtube_video_id", "thumbnail_url",
            "instructor_name", "is_published",
            "description", "level", "duration_hours", "price",
            "enrollment_count", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "enrollment_count", "created_at", "updated_at"]


class CourseListSerializer(serializers.ModelSerializer):
    """Lightweight list serializer."""
    class Meta:
        model = Course
        fields = [
            "id", "title", "track", "instructor_name",
            "level", "price", "is_published", "enrollment_count",
            "thumbnail_url", "created_at",
        ]


# ─── Event ───────────────────────────────────────────────────────────────────
class EventSerializer(serializers.ModelSerializer):
    registration_count = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            "id", "title", "description", "event_type", "status",
            "start_date", "end_date", "location", "is_online",
            "meeting_url", "max_capacity", "banner_url",
            "registration_count", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "registration_count", "created_at", "updated_at"]

    def get_registration_count(self, obj):
        return obj.registrations.count()


class EventListSerializer(serializers.ModelSerializer):
    registration_count = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            "id", "title", "event_type", "status",
            "start_date", "end_date", "is_online",
            "max_capacity", "registration_count", "banner_url",
        ]

    def get_registration_count(self, obj):
        return obj.registrations.count()


# ─── EventRegistration ───────────────────────────────────────────────────────
class EventRegistrationSerializer(serializers.ModelSerializer):
    learner_username = serializers.CharField(source="learner.username", read_only=True)
    learner_email = serializers.CharField(source="learner.email", read_only=True)
    learner_full_name = serializers.SerializerMethodField()
    event_title = serializers.CharField(source="event.title", read_only=True)

    class Meta:
        model = EventRegistration
        fields = [
            "id", "event", "event_title",
            "learner", "learner_username", "learner_email", "learner_full_name",
            "status", "registered_at", "attended_at",
        ]
        read_only_fields = ["id", "registered_at"]

    def get_learner_full_name(self, obj):
        return obj.learner.get_full_name() or obj.learner.username


# ─── Payment ─────────────────────────────────────────────────────────────────
class PaymentSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source="user.username", read_only=True)
    user_email = serializers.CharField(source="user.email", read_only=True)
    course_title = serializers.CharField(source="course.title", read_only=True, default=None)

    class Meta:
        model = Payment
        fields = [
            "id", "user", "user_username", "user_email",
            "course", "course_title",
            "amount", "currency", "status", "payment_method",
            "transaction_id", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


# ─── JobPosting ──────────────────────────────────────────────────────────────
class JobPostingSerializer(serializers.ModelSerializer):
    employer_name = serializers.CharField(source="employer.company_name", read_only=True)

    class Meta:
        model = JobPosting
        fields = [
            "id", "employer", "employer_name",
            "title", "description", "required_skills",
            "job_type", "location", "is_remote",
            "salary_min", "salary_max", "status",
            "application_count", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "application_count", "created_at", "updated_at"]


# ─── Analytics ───────────────────────────────────────────────────────────────
class DashboardStatsSerializer(serializers.Serializer):
    total_users = serializers.IntegerField()
    total_courses = serializers.IntegerField()
    published_courses = serializers.IntegerField()
    total_events = serializers.IntegerField()
    upcoming_events = serializers.IntegerField()
    total_revenue = serializers.DecimalField(max_digits=14, decimal_places=2)
    total_employers = serializers.IntegerField()
    total_job_postings = serializers.IntegerField()
    total_enrollments = serializers.IntegerField()
    recent_payments = PaymentSerializer(many=True)
