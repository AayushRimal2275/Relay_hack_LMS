from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404

from administration.models import Event, EventRegistration
from administration.serializers import (
    EventSerializer, EventListSerializer, EventRegistrationSerializer,
)
from .utils import success, error


class EventPagination(PageNumberPagination):
    page_size = 20


class EventListCreateView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        qs = Event.objects.all()
        status = request.query_params.get("status")
        event_type = request.query_params.get("event_type")
        search = request.query_params.get("search")

        if status:
            qs = qs.filter(status=status)
        if event_type:
            qs = qs.filter(event_type=event_type)
        if search:
            qs = qs.filter(title__icontains=search)

        paginator = EventPagination()
        page = paginator.paginate_queryset(qs, request)
        serializer = EventListSerializer(page, many=True)
        return paginator.get_paginated_response(success(serializer.data))

    def post(self, request):
        serializer = EventSerializer(data=request.data)
        if serializer.is_valid():
            event = serializer.save()
            return Response(success(EventSerializer(event).data, "Event created"), status=201)
        return Response(error(serializer.errors), status=400)


class EventDetailView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, pk):
        event = get_object_or_404(Event, pk=pk)
        return Response(success(EventSerializer(event).data))

    def put(self, request, pk):
        event = get_object_or_404(Event, pk=pk)
        serializer = EventSerializer(event, data=request.data, partial=True)
        if serializer.is_valid():
            event = serializer.save()
            return Response(success(EventSerializer(event).data, "Event updated"))
        return Response(error(serializer.errors), status=400)

    def delete(self, request, pk):
        event = get_object_or_404(Event, pk=pk)
        event.delete()
        return Response(success(None, "Event deleted"), status=200)


class EventRegistrationListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, event_id):
        event = get_object_or_404(Event, pk=event_id)
        registrations = event.registrations.select_related("learner").all()
        serializer = EventRegistrationSerializer(registrations, many=True)
        return Response(success(serializer.data))


class EventRegistrationDetailView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        reg = get_object_or_404(EventRegistration, pk=pk)
        serializer = EventRegistrationSerializer(reg, data=request.data, partial=True)
        if serializer.is_valid():
            reg = serializer.save()
            return Response(success(EventRegistrationSerializer(reg).data, "Registration updated"))
        return Response(error(serializer.errors), status=400)
