from rest_framework import viewsets, permissions
from ..serializers import PaymentSerializer
from ..models import Payment


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']
