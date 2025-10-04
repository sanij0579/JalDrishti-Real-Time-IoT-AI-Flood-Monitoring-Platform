# sliders/admin.py
from django.contrib import admin
from .models import Slider

@admin.register(Slider)
class SliderAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('title',)
    ordering = ('-created_at',)