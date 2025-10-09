# rainfall/serializers.py
from rest_framework import serializers
from .models import RainfallData

class RainfallSerializer(serializers.ModelSerializer):
    class Meta:
        model = RainfallData
        fields = '__all__'