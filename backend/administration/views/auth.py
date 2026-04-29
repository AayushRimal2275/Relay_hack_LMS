from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from administration.serializers import LoginSerializer
from .utils import success, error


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(error("Invalid input", 400), status=400)

        user = authenticate(
            username=serializer.validated_data["username"],
            password=serializer.validated_data["password"],
        )
        if not user:
            return Response(error("Invalid credentials", 401), status=401)

        if not user.is_staff and not user.is_superuser:
            return Response(error("Admin access required", 403), status=403)

        refresh = RefreshToken.for_user(user)
        return Response(success({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "full_name": user.get_full_name() or user.username,
                "is_superuser": user.is_superuser,
            },
        }, "Login successful"))


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Client-side logout — token blacklisting is optional for hackathon
        return Response(success(None, "Logged out successfully"))
