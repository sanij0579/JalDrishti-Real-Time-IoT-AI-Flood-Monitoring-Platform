from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import Booking
from .serializers import BookingSerializer
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [AllowAny]
    
class CustomerLocationViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]
    def create(self, request):
        # request.data contains user_id, latitude, longitude, address
        data = request.data
        # Optional: save to DB here if you have a model
        return Response(data, status=201)