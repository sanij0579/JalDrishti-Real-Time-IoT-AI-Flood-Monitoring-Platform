from django.urls import path
from .views import VulnerabilityPointsAPI, RainfallGridAPI  # ← Corrected

urlpatterns = [
    path('vulnerability-points/', VulnerabilityPointsAPI.as_view(), name='vulnerability-points'),
    path('realtime-rainfall/', RainfallGridAPI.as_view(), name='realtime-rainfall'),  # ← Corrected
]