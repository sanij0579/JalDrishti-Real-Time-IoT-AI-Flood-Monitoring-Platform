from django.contrib import admin
from django.urls import path
from django.shortcuts import render

# Teeno apps ke models import karo
from sliders.models import Slider
from locations.models import Booking
from theme.models import AppTheme
from flood.models import VulnerabilityPoint
from reviews.models import Review



# Custom AdminSite
class CombinedAdminSite(admin.AdminSite):
    site_header = "Combined Admin"

    # Custom URL add karo
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('combined/', self.admin_view(self.combined_view), name='combined-view')
        ]
        return custom_urls + urls

    # Custom view function
    def combined_view(self, request):
        # Teeno models ka data fetch karo
        sliders = Slider.objects.all()
        bookings = Booking.objects.all()
        themes = AppTheme.objects.all()
        reviews = Review.objects.all()
        vulnerabilities = VulnerabilityPoint.objects.all()

        # Template context
        context = {
            'sliders': sliders,
            'bookings': bookings,
            'themes': themes,
        }

        return render(request, 'admin/combined.html', context)

# Custom admin site instance
combined_admin = CombinedAdminSite(name='combinedadmin')

# Models register karo (optional, default admin ke liye)
combined_admin.register(Slider)
combined_admin.register(Booking)
combined_admin.register(AppTheme)
combined_admin.register(Review)
combined_admin.register(VulnerabilityPoint)