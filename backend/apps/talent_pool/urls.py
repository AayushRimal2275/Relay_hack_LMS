from django.urls import path
from .views import TalentPoolListView

urlpatterns = [
    path('talent-pool/', TalentPoolListView.as_view(), name='talent_pool'),
]
