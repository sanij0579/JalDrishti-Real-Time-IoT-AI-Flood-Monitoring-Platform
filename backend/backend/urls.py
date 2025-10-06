from django.contrib import admin
from django.urls import path,include
from django.shortcuts import render
from django.contrib.admin.views.decorators import staff_member_required

# Models import
from sliders.models import Slider
from locations.models import Booking
from theme.models import AppTheme
from django.conf import settings
from django.conf.urls.static import static

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
    path('combined-admin/', combined_view), 
    path('api/', include('api.urls')),
    path('api/theme/', include('theme.urls')),
    path("api/", include("locations.urls")),
    path('', include('sliders.urls')),
    path('api/', include('flood.urls')),
    path('api/', include('weather.urls')),
    path('api/', include('reviews.urls')),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)