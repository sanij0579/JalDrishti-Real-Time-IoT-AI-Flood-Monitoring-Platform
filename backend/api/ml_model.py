import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib

# Historical + synthetic data
data = pd.DataFrame({
    "rain_mm": [0,5,10,20,35,50,70],
    "elevation": [15,12,10,5,3,2,1],
    "drainage_capacity": [100,90,80,60,50,30,10],
    "flood_occurred": [0,0,0,0,1,1,1]
})

X = data[["rain_mm","elevation","drainage_capacity"]]
y = data["flood_occurred"]

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X,y)

joblib.dump(model, "api/flood_model.pkl")
print("Model trained and saved ✅")