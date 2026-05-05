from rest_framework import viewsets, permissions
from ..serializers import CourseSerializer, CourseListSerializer
from ..models import Course


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']

    def get_serializer_class(self):
        if self.action == 'list':
            return CourseListSerializer
        return CourseSerializer
