# sliders/views.py
from rest_framework import generics
from .models import Slider
from .serializers import SliderSerializer

class SliderListAPIView(generics.ListAPIView):
    queryset = Slider.objects.filter(is_active=True)
    serializer_class = SliderSerializer