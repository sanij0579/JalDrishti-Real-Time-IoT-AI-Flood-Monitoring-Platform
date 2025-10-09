# rainfall/admin.py
from django.contrib import admin
from .models import RainfallData

@admin.register(RainfallData)
class RainfallAdmin(admin.ModelAdmin):
    list_display = ('year', 'total')