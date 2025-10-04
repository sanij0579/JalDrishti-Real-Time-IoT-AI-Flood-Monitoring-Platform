from django.contrib import admin
from django.urls import path
from django.shortcuts import render
from django.contrib.admin.views.decorators import staff_member_required

# Models import
from sliders.models import Slider
from locations.models import Booking
from theme.models import AppTheme

# Custom combined view (admin login required)
@staff_member_required
def combined_view(request):
    sliders = Slider.objects.all()
    bookings = Booking.objects.all()
    themes = AppTheme.objects.all()
    return render(request, 'admin/combined.html', {
        'sliders': sliders,
        'bookings': bookings,
        'themes': themes,
    })

urlpatterns = [
    path('admin/', admin.site.urls),          # default admin
    path('combined-admin/', combined_view),   # custom combined page
]