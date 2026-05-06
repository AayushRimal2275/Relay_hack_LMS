from rest_framework import serializers
from django.contrib.auth.models import User
from administration.models import Course
from .models import Enrollment, Certificate

class UserProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    learner_profile = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'full_name', 'learner_profile']
        
    def get_full_name(self, obj):
        return obj.get_full_name() or obj.username
        
    def get_learner_profile(self, obj):
        if hasattr(obj, 'learner_profile'):
            from administration.serializers import LearnerProfileSerializer
            return LearnerProfileSerializer(obj.learner_profile).data
        return None

class EnrollmentSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)
    course_track = serializers.CharField(source='course.track', read_only=True)
    
    class Meta:
        model = Enrollment
        fields = ['id', 'course', 'course_title', 'course_track', 'enrolled_at', 'completed', 'completed_at']
        read_only_fields = ['id', 'enrolled_at']

class CertificateSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)
    
    class Meta:
        model = Certificate
        fields = ['id', 'course', 'course_title', 'certificate_id', 'issued_at']
        read_only_fields = ['id', 'issued_at', 'certificate_id']
