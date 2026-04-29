from rest_framework import serializers
from apps.accounts.models import LearnerProfile


class TalentPoolSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='user.id', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = LearnerProfile
        fields = [
            'id', 'username', 'full_name',
            'track', 'skills', 'score', 'certification_count', 'bio', 'avatar_url',
        ]

    def get_full_name(self, obj):
        return obj.user.get_full_name() or obj.user.username
