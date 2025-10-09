from rest_framework.decorators import api_view
from rest_framework.response import Response
import requests, joblib

# Load trained model
model = joblib.load("api/flood_model.pkl")

# OpenWeather API key
API_KEY = "b5c6985e937ffc08242fcbee251174ba"

# Small offset to generate nearby points (approx 1 km ~ 0.01 degrees)
OFFSET = 0.01


@api_view(['GET'])
def flood_risk(request):
    """
    🌧️ Dynamic location-based flood risk API
    Client can pass ?lat=...&lon=...
    Example: /api/flood_risk?lat=28.6139&lon=77.2090
    """

    # 1️⃣ Get client location (default = Delhi)
    try:
        LAT = float(request.GET.get("lat", 28.6139))
        LON = float(request.GET.get("lon", 77.2090))
    except:
        return Response({"error": "Invalid latitude or longitude"}, status=400)

    # 2️⃣ Generate nearby coordinates (simple 2x2 grid)
    nearby_coords = [
        (LAT, LON),
        (LAT + OFFSET, LON),
        (LAT, LON + OFFSET),
        (LAT - OFFSET, LON),
        (LAT, LON - OFFSET),
    ]

    results = []

    # 3️⃣ Fetch weather and predict for each point
    for idx, (lat, lon) in enumerate(nearby_coords):
        try:
            # Get live weather data
            url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}&units=metric"
            data = requests.get(url, timeout=5).json()

            # 🔹 Extract rainfall intelligently
            rain_data = data.get("rain", {})
            rain_mm = rain_data.get("1h") or rain_data.get("3h") or 0

            # If rainfall missing but condition says 'Rain', assume light rain
            if rain_mm == 0 and data.get("weather"):
                main_weather = data["weather"][0]["main"].lower()
                if "rain" in main_weather:
                    rain_mm = 0.5

        except Exception as e:
            print("❌ Weather fetch failed:", e)
            rain_mm = 0

        # 🔹 Dummy static data for demo (can connect to GIS later)
        elevation = 5       # meters
        drainage = 50       # arbitrary scale

        # 4️⃣ Predict flood risk
        try:
            risk = model.predict([[rain_mm, elevation, drainage]])[0]
            risk_prob = model.predict_proba([[rain_mm, elevation, drainage]])[0][1] * 100
        except Exception as e:
            print("⚠️ Prediction error:", e)
            risk = 0
            risk_prob = 0

        # 5️⃣ Generate safety messages
        if risk == 1:
            notes = [
                f"⚠️ High flood risk detected near ({lat:.4f}, {lon:.4f})",
                "Avoid low-lying areas and basements",
                "Keep emergency contacts ready",
                "Follow official alerts for evacuation"
            ]
        else:
            notes = [
                f"✅ Low risk near ({lat:.4f}, {lon:.4f})",
                "Monitor rainfall updates regularly"
            ]

        # 6️⃣ Add to result
        results.append({
            "lat": round(lat, 6),
            "lon": round(lon, 6),
            "rain_mm": rain_mm,
            "risk": "HIGH" if risk == 1 else "LOW",
            "risk_prob": round(risk_prob, 2),
            "notes": notes
        })

    # ✅ Return all nearby results
    return Response({"data": results})