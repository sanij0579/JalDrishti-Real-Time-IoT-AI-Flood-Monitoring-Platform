from django.contrib import admin
# from .models import SensorData  <-- Ye galat hai
from .models import WaterData  # ✅ Correct model name

@admin.register(WaterData)
class WaterDataAdmin(admin.ModelAdmin):
    list_display = ('water_level', 'location', 'timestamp')