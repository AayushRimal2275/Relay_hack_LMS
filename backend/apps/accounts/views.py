from django.contrib.auth.models import User
from django.db import transaction
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from apps.companies.models import Company
from .serializers import EmployerRegisterSerializer


class EmployerRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = EmployerRegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        with transaction.atomic():
            user = User.objects.create_user(
                username=data['username'],
                email=data['email'],
                password=data['password'],
            )
            company = Company.objects.create(
                user=user,
                name=data['name'],
                industry=data['industry'],
                website=data.get('website', ''),
                contact_email=data['contact_email'],
            )

        refresh = RefreshToken.for_user(user)
        return Response(
            {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'company_id': company.pk,
                'name': company.name,
            },
            status=status.HTTP_201_CREATED,
        )
