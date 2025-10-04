# locations/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BookingViewSet, CustomerLocationViewSet

router = DefaultRouter()
router.register(r'bookings', BookingViewSet)
router.register(r'customer-location', CustomerLocationViewSet, basename='customer-location')

urlpatterns = [
    path('', include(router.urls)),  # <-- no need for extra 'api/' here
]