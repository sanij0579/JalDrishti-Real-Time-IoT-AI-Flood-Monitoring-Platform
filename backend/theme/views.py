from rest_framework.views import APIView
from rest_framework.response import Response
from .models import AppTheme
from .serializers import AppThemeSerializer

class ActiveThemeAPIView(APIView):
    """
    Returns the currently active theme
    """
    def get(self, request):
        try:
            active_theme = AppTheme.objects.get(is_active=True)
            serializer = AppThemeSerializer(active_theme)
            return Response(serializer.data)
        except AppTheme.DoesNotExist:
            # fallback
            return Response({'name': 'light', 'is_active': True})
