from django.urls import path
from .views import flood_risk

urlpatterns = [
    path('flood-risk/', flood_risk),
]
