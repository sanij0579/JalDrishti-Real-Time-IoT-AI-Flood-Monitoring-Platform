from rest_framework import generics
from .models import Review
from .serializers import ReviewSerializer
from rest_framework.parsers import MultiPartParser, FormParser

# GET / POST
class ReviewListCreateAPIView(generics.ListCreateAPIView):
    queryset = Review.objects.all().order_by('-created_at')
    serializer_class = ReviewSerializer
    parser_classes = (MultiPartParser, FormParser) 

# DELETE / PUT / PATCH
class ReviewRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer