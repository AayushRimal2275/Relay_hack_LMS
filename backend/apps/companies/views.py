from rest_framework import generics, mixins, permissions, status, viewsets
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.response import Response

from .models import Application, Company, JobPosting
from .serializers import (
    ApplicationCreateSerializer,
    ApplicationSerializer,
    CompanySerializer,
    JobPostingSerializer,
)


class IsOwnerOrReadOnly(permissions.BasePermission):
    """Allow write access only to the object's owner (company.user == request.user)."""

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        if isinstance(obj, Company):
            return obj.user == request.user
        if isinstance(obj, JobPosting):
            return obj.company.user == request.user
        return False


# ──────────────────────────── Company ────────────────────────────

class CompanyListView(generics.ListAPIView):
    serializer_class = CompanySerializer

    def get_queryset(self):
        return Company.objects.filter(user=self.request.user)


class CompanyDetailView(generics.RetrieveUpdateAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    http_method_names = ['get', 'patch', 'head', 'options']


# ──────────────────────────── JobPosting ─────────────────────────

class JobPostingViewSet(viewsets.ModelViewSet):
    serializer_class = JobPostingSerializer
    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']

    def get_queryset(self):
        return JobPosting.objects.select_related('company').filter(is_active=True)

    def perform_create(self, serializer):
        try:
            company = self.request.user.company
        except Company.DoesNotExist:
            raise PermissionDenied("Only company accounts can create job postings.")
        serializer.save(company=company)

    def get_permissions(self):
        if self.action in ('update', 'partial_update', 'destroy'):
            return [permissions.IsAuthenticated(), IsOwnerOrReadOnly()]
        return [permissions.IsAuthenticated()]

    def check_object_permissions(self, request, obj):
        super().check_object_permissions(request, obj)
        if request.method not in permissions.SAFE_METHODS:
            if obj.company.user != request.user:
                raise PermissionDenied("You do not own this job posting.")


# ──────────────────────────── Application ────────────────────────

class ApplicationViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    http_method_names = ['get', 'post', 'patch', 'head', 'options']

    def get_serializer_class(self):
        if self.action == 'create':
            return ApplicationCreateSerializer
        return ApplicationSerializer

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'company'):
            # Employer: see all applications for their jobs
            return (
                Application.objects
                .filter(job__company=user.company)
                .select_related('learner', 'job')
            )
        # Learner: see only their own applications
        return Application.objects.filter(learner=user).select_related('job')

    def perform_create(self, serializer):
        user = self.request.user
        if hasattr(user, 'company'):
            raise PermissionDenied("Employer accounts cannot apply to jobs.")
        job = serializer.validated_data['job']
        if Application.objects.filter(learner=user, job=job).exists():
            raise ValidationError("You have already applied to this job.")
        serializer.save(learner=user)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        # Only the employer who owns the job may update status/notes
        if not hasattr(request.user, 'company') or instance.job.company.user != request.user:
            raise PermissionDenied("Only the hiring employer can update this application.")
        serializer = ApplicationSerializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
