from django.contrib import admin
from .models import Booking

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ("id", "user_id", "service_id", "latitude", "longitude", "status", "created_at")