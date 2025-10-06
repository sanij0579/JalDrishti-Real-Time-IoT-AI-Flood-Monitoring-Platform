from rest_framework.decorators import api_view
from rest_framework.response import Response
import requests, joblib

model = joblib.load("api/flood_model.pkl")
API_KEY = "b5c6985e937ffc08242fcbee251174ba"

# Small offset to generate nearby points (approx 1 km ~ 0.01 degrees)
OFFSET = 0.01

@api_view(['GET'])
def flood_risk(request):
    """
    Dynamic location-based flood risk.
    Client can pass ?lat=...&lon=... 
    If not provided, default Delhi coordinates used.
    """

    # 1️⃣ Get client location
    try:
        LAT = float(request.GET.get("lat", 28.6139))  # default Delhi
        LON = float(request.GET.get("lon", 77.2090))
    except:
        return Response({"error": "Invalid latitude or longitude"}, status=400)

    # 2️⃣ Generate nearby points (simple 2x2 grid)
    nearby_coords = [
        (LAT, LON),
        (LAT + OFFSET, LON),
        (LAT, LON + OFFSET),
        (LAT - OFFSET, LON),
        (LAT, LON - OFFSET),
    ]

    results = []

    for idx, (lat, lon) in enumerate(nearby_coords):
        # 3️⃣ Fetch live rainfall for each point
        try:
            url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}&units=metric"
            data = requests.get(url, timeout=5).json()
            rain_mm = data.get("rain", {}).get("1h", 0)
        except:
            rain_mm = 0  # fallback

        # 4️⃣ Dummy elevation & drainage
        # Ideally, fetch from GIS database based on lat/lon
        elevation = 5  # meters
        drainage = 50  # arbitrary units

        # 5️⃣ Predict risk
        risk = model.predict([[rain_mm, elevation, drainage]])[0]
        risk_prob = model.predict_proba([[rain_mm, elevation, drainage]])[0][1]*100

        # 6️⃣ Generate safety notes
        if risk == 1:
            notes = [
                f"Stay alert at coordinates ({lat:.4f}, {lon:.4f}), avoid low-lying areas",
                "Use main roads only",
                "Nearest shelter: Check local community center",
                "Keep emergency kit ready"
            ]
        else:
            notes = ["Minor water logging possible", "Stay alert"]

        results.append({
            "lat": round(lat, 6),
            "lon": round(lon, 6),
            "rain_mm": rain_mm,
            "risk": "HIGH" if risk==1 else "LOW",
            "risk_prob": round(risk_prob,2),
            "notes": notes
        })

    return Response({"data": results})