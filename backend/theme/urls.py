from django.urls import path
from .views import ActiveThemeAPIView

urlpatterns = [
    path('active/', ActiveThemeAPIView.as_view(), name='active-theme'),
]



