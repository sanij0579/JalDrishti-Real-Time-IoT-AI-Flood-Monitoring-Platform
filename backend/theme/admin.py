from django.contrib import admin
from .models import AppTheme

@admin.register(AppTheme)
class AppThemeAdmin(admin.ModelAdmin):
    list_display = ['name', 'is_active']
    actions = ['make_active']

    def make_active(self, request, queryset):
        # Reset all to inactive
        AppTheme.objects.update(is_active=False)
        # Set selected theme as active
        queryset.update(is_active=True)
    make_active.short_description = "Set selected theme as active"
