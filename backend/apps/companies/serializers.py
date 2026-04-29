from rest_framework import serializers
from .models import Company, JobPosting, Application


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = [
            'id', 'name', 'logo', 'industry', 'website',
            'contact_email', 'is_verified', 'created_at',
        ]
        read_only_fields = ['is_verified', 'created_at']


class JobPostingSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)

    class Meta:
        model = JobPosting
        fields = [
            'id', 'company', 'company_name', 'title', 'description',
            'required_skills', 'is_active', 'created_at',
        ]
        read_only_fields = ['company', 'created_at']


class ApplicationSerializer(serializers.ModelSerializer):
    learner_username = serializers.CharField(source='learner.username', read_only=True)
    job_title = serializers.CharField(source='job.title', read_only=True)

    class Meta:
        model = Application
        fields = [
            'id', 'learner', 'learner_username', 'job', 'job_title',
            'status', 'applied_at', 'employer_notes',
        ]
        read_only_fields = ['learner', 'applied_at']


class ApplicationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ['job']

    def validate_job(self, job):
        if not job.is_active:
            raise serializers.ValidationError("This job posting is no longer active.")
        return job
