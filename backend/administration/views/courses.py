from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404

from administration.models import Course
from administration.serializers import CourseSerializer, CourseListSerializer
from .utils import success, error


class CoursePagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "page_size"


class CourseListCreateView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        qs = Course.objects.all()
        # Filtering
        track = request.query_params.get("track")
        level = request.query_params.get("level")
        is_published = request.query_params.get("is_published")
        search = request.query_params.get("search")

        if track:
            qs = qs.filter(track=track)
        if level:
            qs = qs.filter(level=level)
        if is_published is not None:
            qs = qs.filter(is_published=is_published.lower() == "true")
        if search:
            qs = qs.filter(title__icontains=search)

        paginator = CoursePagination()
        page = paginator.paginate_queryset(qs, request)
        serializer = CourseListSerializer(page, many=True)
        return paginator.get_paginated_response(success(serializer.data))

    def post(self, request):
        serializer = CourseSerializer(data=request.data)
        if serializer.is_valid():
            course = serializer.save()
            return Response(success(CourseSerializer(course).data, "Course created"), status=201)
        return Response(error(serializer.errors), status=400)


class CourseDetailView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, pk):
        course = get_object_or_404(Course, pk=pk)
        return Response(success(CourseSerializer(course).data))

    def put(self, request, pk):
        course = get_object_or_404(Course, pk=pk)
        serializer = CourseSerializer(course, data=request.data, partial=True)
        if serializer.is_valid():
            course = serializer.save()
            return Response(success(CourseSerializer(course).data, "Course updated"))
        return Response(error(serializer.errors), status=400)

    def delete(self, request, pk):
        course = get_object_or_404(Course, pk=pk)
        course.delete()
        return Response(success(None, "Course deleted"), status=200)
