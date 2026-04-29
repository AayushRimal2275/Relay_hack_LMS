from rest_framework import generics
from apps.accounts.models import LearnerProfile
from .serializers import TalentPoolSerializer


class TalentPoolListView(generics.ListAPIView):
    serializer_class = TalentPoolSerializer

    def get_queryset(self):
        qs = LearnerProfile.objects.select_related('user').all()

        track = self.request.query_params.get('track')
        if track:
            qs = qs.filter(track=track)

        min_score = self.request.query_params.get('min_score')
        if min_score is not None:
            try:
                qs = qs.filter(score__gte=float(min_score))
            except ValueError:
                pass

        search = self.request.query_params.get('search')
        if search:
            from django.db.models import Q
            qs = qs.filter(
                Q(user__first_name__icontains=search) |
                Q(user__last_name__icontains=search) |
                Q(user__username__icontains=search)
            )

        return qs
