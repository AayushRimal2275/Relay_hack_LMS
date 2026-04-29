from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404

from administration.models import Employer
from administration.serializers import EmployerSerializer
from .utils import success, error


class EmployerPagination(PageNumberPagination):
    page_size = 20


class EmployerListCreateView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        qs = Employer.objects.all()
        is_active = request.query_params.get("is_active")
        search = request.query_params.get("search")

        if is_active is not None:
            qs = qs.filter(is_active=is_active.lower() == "true")
        if search:
            qs = qs.filter(company_name__icontains=search)

        paginator = EmployerPagination()
        page = paginator.paginate_queryset(qs, request)
        serializer = EmployerSerializer(page, many=True)
        return paginator.get_paginated_response(success(serializer.data))

    def post(self, request):
        serializer = EmployerSerializer(data=request.data)
        if serializer.is_valid():
            employer = serializer.save()
            return Response(success(EmployerSerializer(employer).data, "Employer created"), status=201)
        return Response(error(serializer.errors), status=400)


class EmployerDetailView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, pk):
        employer = get_object_or_404(Employer, pk=pk)
        return Response(success(EmployerSerializer(employer).data))

    def put(self, request, pk):
        employer = get_object_or_404(Employer, pk=pk)
        serializer = EmployerSerializer(employer, data=request.data, partial=True)
        if serializer.is_valid():
            employer = serializer.save()
            return Response(success(EmployerSerializer(employer).data, "Employer updated"))
        return Response(error(serializer.errors), status=400)

    def delete(self, request, pk):
        employer = get_object_or_404(Employer, pk=pk)
        employer.delete()
        return Response(success(None, "Employer deleted"), status=200)
