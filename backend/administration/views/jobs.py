from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404

from administration.models import JobPosting
from administration.serializers import JobPostingSerializer
from .utils import success, error


class JobPagination(PageNumberPagination):
    page_size = 20


class JobPostingListCreateView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        qs = JobPosting.objects.select_related("employer").all()
        status = request.query_params.get("status")
        employer_id = request.query_params.get("employer_id")
        search = request.query_params.get("search")

        if status:
            qs = qs.filter(status=status)
        if employer_id:
            qs = qs.filter(employer_id=employer_id)
        if search:
            qs = qs.filter(title__icontains=search)

        paginator = JobPagination()
        page = paginator.paginate_queryset(qs, request)
        serializer = JobPostingSerializer(page, many=True)
        return paginator.get_paginated_response(success(serializer.data))

    def post(self, request):
        serializer = JobPostingSerializer(data=request.data)
        if serializer.is_valid():
            job = serializer.save()
            return Response(success(JobPostingSerializer(job).data, "Job posting created"), status=201)
        return Response(error(serializer.errors), status=400)


class JobPostingDetailView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, pk):
        job = get_object_or_404(JobPosting, pk=pk)
        return Response(success(JobPostingSerializer(job).data))

    def put(self, request, pk):
        job = get_object_or_404(JobPosting, pk=pk)
        serializer = JobPostingSerializer(job, data=request.data, partial=True)
        if serializer.is_valid():
            job = serializer.save()
            return Response(success(JobPostingSerializer(job).data, "Job updated"))
        return Response(error(serializer.errors), status=400)

    def delete(self, request, pk):
        job = get_object_or_404(JobPosting, pk=pk)
        job.delete()
        return Response(success(None, "Job deleted"), status=200)
