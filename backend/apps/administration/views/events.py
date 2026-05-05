from rest_framework import viewsets, permissions
from ..serializers import EventSerializer, EventListSerializer
from ..models import Event


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']

    def get_serializer_class(self):
        if self.action == 'list':
            return EventListSerializer
        return EventSerializer
