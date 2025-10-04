from rest_framework import serializers
from .models import AppTheme

class AppThemeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppTheme
        fields = ['name', 'is_active']
