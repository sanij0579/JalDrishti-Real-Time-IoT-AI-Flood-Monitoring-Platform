from django.urls import path
from .views import flood_risk

urlpatterns = [
    path('flood_risk/', flood_risk, name='flood-risk')
]
