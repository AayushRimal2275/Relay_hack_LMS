from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth.models import User
from administration.models import Course
from .models import Enrollment, Certificate
from .serializers import UserProfileSerializer, EnrollmentSerializer, CertificateSerializer

class ProfileView(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]
    
    def list(self, request):
        """Get current user's profile"""
        user = request.user
        serializer = UserProfileSerializer(user)
        return Response(serializer.data)
    
    def update(self, request):
        """Update user profile"""
        user = request.user
        serializer = UserProfileSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EnrollmentView(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]
    
    def list(self, request):
        """List user's enrolled courses"""
        enrollments = Enrollment.objects.filter(learner=request.user)
        serializer = EnrollmentSerializer(enrollments, many=True)
        return Response(serializer.data)
    
    def create(self, request):
        """Enroll in a course"""
        course_id = request.data.get('course_id')
        if not course_id:
            return Response({'error': 'course_id required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)
        
        enrollment, created = Enrollment.objects.get_or_create(
            learner=request.user,
            course=course
        )
        
        if created:
            return Response(EnrollmentSerializer(enrollment).data, status=status.HTTP_201_CREATED)
        return Response({'message': 'Already enrolled'}, status=status.HTTP_200_OK)

class CertificateView(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]
    
    def list(self, request):
        """List user's certificates"""
        certificates = Certificate.objects.filter(learner=request.user)
        serializer = CertificateSerializer(certificates, many=True)
        return Response(serializer.data)
