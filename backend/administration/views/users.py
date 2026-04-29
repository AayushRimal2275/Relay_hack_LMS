from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from rest_framework.pagination import PageNumberPagination
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

from administration.serializers import UserSerializer, UserUpdateSerializer
from .utils import success, error


class UserPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "page_size"


class UserListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        qs = User.objects.select_related("learner_profile").filter(is_staff=False)
        is_active = request.query_params.get("is_active")
        search = request.query_params.get("search")

        if is_active is not None:
            qs = qs.filter(is_active=is_active.lower() == "true")
        if search:
            qs = qs.filter(
                username__icontains=search
            ) | qs.filter(email__icontains=search)

        paginator = UserPagination()
        page = paginator.paginate_queryset(qs.order_by("-date_joined"), request)
        serializer = UserSerializer(page, many=True)
        return paginator.get_paginated_response(success(serializer.data))


class UserDetailView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        return Response(success(UserSerializer(user).data))

    def put(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        serializer = UserUpdateSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            user = serializer.save()
            return Response(success(UserSerializer(user).data, "User updated"))
        return Response(error(serializer.errors), status=400)

    def patch(self, request, pk):
        return self.put(request, pk)
