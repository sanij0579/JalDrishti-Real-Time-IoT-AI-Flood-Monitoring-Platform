from rest_framework.decorators import api_view
from rest_framework.response import Response
import requests, joblib

model = joblib.load("api/flood_model.pkl")

API_KEY = "b5c6985e937ffc08242fcbee251174ba"
LAT = 28.6139  # Delhi example
LON = 77.2090

# Example GIS data for multiple zones
zones = [
    {"name":"Zone A","elevation":3,"drainage":50},
    {"name":"Zone B","elevation":10,"drainage":80},
    {"name":"Zone C","elevation":1,"drainage":20},
]

@api_view(['GET'])
def flood_risk(request):
    # 1️⃣ Fetch live rainfall
    url = f"https://api.openweathermap.org/data/2.5/weather?lat={LAT}&lon={LON}&appid={API_KEY}&units=metric"
    data = requests.get(url).json()
    rain_mm = data.get("rain", {}).get("1h", 0)

    # 2️⃣ Predict risk per zone
    results = []
    for zone in zones:
        risk = model.predict([[rain_mm, zone["elevation"], zone["drainage"]]])[0]
        risk_prob = model.predict_proba([[rain_mm, zone["elevation"], zone["drainage"]]])[0][1]*100

        # Generate safety notes
        if risk == 1:
            notes = [
                f"Stay alert in {zone['name']}, avoid low-lying areas",
                "Use main roads only",
                f"Nearest shelter: Community Hall near {zone['name']}",
                "Keep emergency kit ready"
            ]
        else:
            notes = ["Minor water logging possible", "Stay alert"]

        results.append({
            "zone": zone["name"],
            "rain_mm": rain_mm,
            "risk": "HIGH" if risk==1 else "LOW",
            "risk_prob": round(risk_prob,2),
            "notes": notes
        })

    return Response({"data": results})