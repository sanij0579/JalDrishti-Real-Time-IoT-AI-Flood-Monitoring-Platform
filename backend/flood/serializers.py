from rest_framework import serializers
from .models import VulnerabilityPoint

class VulnerabilityPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = VulnerabilityPoint
        fields = "__all__"