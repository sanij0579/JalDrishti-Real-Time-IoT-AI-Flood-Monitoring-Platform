from django.urls import path
from .views import ZoneFlowWeatherAPIView

urlpatterns = [
    path("zone-flow-weather/", ZoneFlowWeatherAPIView.as_view(), name="zone-flow-weather"),
]