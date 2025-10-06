import json, os, requests
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response

OPENWEATHER_API_KEY = "YOUR_OPENWEATHER_API_KEY"

ZONE_GRAPH = {
    "Karol Bagh": {"upstream": [], "downstream": ["Lajpat Nagar"]},
    "Lajpat Nagar": {"upstream": ["Karol Bagh"], "downstream": ["Dwarka"]},
    "Dwarka": {"upstream": ["Lajpat Nagar"], "downstream": []},
}

class ZoneFlowWeatherAPIView(APIView):
    def get(self, request):
        geojson_path = os.path.join(settings.BASE_DIR, "weather/static/delhi_zones.geojson")
        with open(geojson_path, "r") as f:
            geojson_data = json.load(f)

        zones_data = {}

        # 1️⃣ Fetch real-time rain data
        for feature in geojson_data["features"]:
            name = feature["properties"]["name"]
            lon, lat = feature["geometry"]["coordinates"]
            weather_res = requests.get(
                f"https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&units=metric"
            )
            weather_json = weather_res.json()
            rain = weather_json.get("current", {}).get("rain", {"1h": 0})
            zones_data[name] = {
                "lat": lat,
                "lon": lon,
                "rain_1h": rain.get("1h", 0)
            }

        # 2️⃣ Calculate upstream/downstream impact
        for zone, neighbors in ZONE_GRAPH.items():
            upstream_rain = sum([zones_data[up]["rain_1h"] for up in neighbors["upstream"]])
            downstream_rain = sum([zones_data[down]["rain_1h"] for down in neighbors["downstream"]])
            zones_data[zone]["upstream_rain"] = upstream_rain
            zones_data[zone]["downstream_rain"] = downstream_rain

        return Response(zones_data)