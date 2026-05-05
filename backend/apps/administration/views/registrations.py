from rest_framework import viewsets, permissions
from ..serializers import EventRegistrationSerializer
from ..models import EventRegistration


class EventRegistrationViewSet(viewsets.ModelViewSet):
    queryset = EventRegistration.objects.all()
    serializer_class = EventRegistrationSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']
