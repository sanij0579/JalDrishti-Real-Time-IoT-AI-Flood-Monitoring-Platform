import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import VulnerabilityPoint
from .serializers import VulnerabilityPointSerializer

# 🔹 Existing endpoint for vulnerability points
class VulnerabilityPointsAPI(APIView):
    def get(self, request):
        points = VulnerabilityPoint.objects.all()
        serializer = VulnerabilityPointSerializer(points, many=True)
        return Response(serializer.data)

# 🔹 New endpoint: Rainfall grid for map overlay
class RainfallGridAPI(APIView):
    def get(self, request):
        # Define map bounding box (adjust according to city/region)
        lat_min = float(request.GET.get("lat_min", 28.5))
        lat_max = float(request.GET.get("lat_max", 28.7))
        lon_min = float(request.GET.get("lon_min", 77.0))
        lon_max = float(request.GET.get("lon_max", 77.3))
        step = float(request.GET.get("step", 0.03))  # grid resolution (~3km)
        api_key = "b5c6985e937ffc08242fcbee251174ba"

        grid_data = []

        lat = lat_min
        while lat <= lat_max:
            lon = lon_min
            while lon <= lon_max:
                try:
                    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric"
                    data = requests.get(url, timeout=5).json()
                    rainfall = data.get("rain", {}).get("1h", 0)
                    grid_data.append({"lat": lat, "lon": lon, "rainfall_mm": rainfall})
                except Exception as e:
                    print(f"Error fetching rainfall at {lat},{lon}: {e}")
                    grid_data.append({"lat": lat, "lon": lon, "rainfall_mm": 0})
                lon += step
            lat += step

        return Response(grid_data)