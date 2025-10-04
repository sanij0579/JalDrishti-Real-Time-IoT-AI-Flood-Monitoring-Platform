# sliders/urls.py
from django.urls import path
from .views import SliderListAPIView

urlpatterns = [
    path('api/sliders/', SliderListAPIView.as_view(), name='slider-list'),
]