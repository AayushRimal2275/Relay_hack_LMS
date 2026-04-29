from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404

from administration.models import Payment
from administration.serializers import PaymentSerializer
from .utils import success, error


class PaymentPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "page_size"


class PaymentListCreateView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        qs = Payment.objects.select_related("user", "course").all()
        status = request.query_params.get("status")
        method = request.query_params.get("payment_method")
        user_id = request.query_params.get("user_id")
        search = request.query_params.get("search")

        if status:
            qs = qs.filter(status=status)
        if method:
            qs = qs.filter(payment_method=method)
        if user_id:
            qs = qs.filter(user_id=user_id)
        if search:
            qs = qs.filter(transaction_id__icontains=search)

        paginator = PaymentPagination()
        page = paginator.paginate_queryset(qs, request)
        serializer = PaymentSerializer(page, many=True)
        return paginator.get_paginated_response(success(serializer.data))

    def post(self, request):
        serializer = PaymentSerializer(data=request.data)
        if serializer.is_valid():
            payment = serializer.save()
            return Response(success(PaymentSerializer(payment).data, "Payment recorded"), status=201)
        return Response(error(serializer.errors), status=400)


class PaymentDetailView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, pk):
        payment = get_object_or_404(Payment, pk=pk)
        return Response(success(PaymentSerializer(payment).data))

    def put(self, request, pk):
        payment = get_object_or_404(Payment, pk=pk)
        serializer = PaymentSerializer(payment, data=request.data, partial=True)
        if serializer.is_valid():
            payment = serializer.save()
            return Response(success(PaymentSerializer(payment).data, "Payment updated"))
        return Response(error(serializer.errors), status=400)

    def delete(self, request, pk):
        payment = get_object_or_404(Payment, pk=pk)
        payment.delete()
        return Response(success(None, "Payment deleted"), status=200)
