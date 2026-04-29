from django.contrib.auth.models import User
from rest_framework import serializers
from .models import LearnerProfile


class LearnerProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    full_name = serializers.SerializerMethodField()
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = LearnerProfile
        fields = [
            'id', 'username', 'full_name', 'email',
            'track', 'skills', 'score', 'certification_count', 'bio', 'avatar_url',
        ]

    def get_full_name(self, obj):
        return obj.user.get_full_name() or obj.user.username


class EmployerRegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)
    name = serializers.CharField(max_length=200)
    industry = serializers.CharField(max_length=100)
    website = serializers.URLField(required=False, allow_blank=True)
    contact_email = serializers.EmailField()

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with that username already exists.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with that email already exists.")
        return value
