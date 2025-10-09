# rainfall/views.py
from rest_framework import viewsets
from .models import RainfallData
from .serializers import RainfallSerializer

class RainfallViewSet(viewsets.ModelViewSet):
    queryset = RainfallData.objects.all().order_by('year')
    serializer_class = RainfallSerializer