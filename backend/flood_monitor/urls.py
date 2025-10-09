from django.urls import path
from .views import water_data_api

urlpatterns = [
    path('api/data/', water_data_api, name='water_data_api'),
]