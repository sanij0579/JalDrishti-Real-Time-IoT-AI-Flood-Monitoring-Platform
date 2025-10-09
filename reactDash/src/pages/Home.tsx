import { useEffect, useState } from "react";
import axios from "axios";

interface FloodPoint {
  lat: number;
  lon: number;
  rain_mm: number;
  risk: string;
  risk_prob: number;
  notes: string[];
  name?: string;
}

export default function Home() {
  const [floodPoints, setFloodPoints] = useState<FloodPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFloodData = async () => {
      try {
        const res = await axios.get("http://10.107.0.142:8000/api/flood_risk/?lat=28.6139&lon=77.209");
        if (res.data?.data) {
          setFloodPoints(res.data.data);
        }
      } catch (err) {
        console.error("Flood API error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFloodData();
  }, []);

  const getRainfallStatus = (rain: number) => {
    if (rain >= 20) return { label: "🌧️ Heavy Rainfall", color: "#b91c1c" };
    if (rain >= 5) return { label: "🌦️ Moderate Rainfall", color: "#eab308" };
    if (rain > 0) return { label: "☁️ Light Rainfall", color: "#2563eb" };
    return { label: "☀️ No Rain", color: "#16a34a" };
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", background: "#f5f5f5" }}>
      <h1 style={{ color: "#1E3A8A" }}>🌊 Flood Information</h1>

      {loading ? (
        <p>Loading flood data...</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {floodPoints.map((point, idx) => {
            const rainStatus = getRainfallStatus(point.rain_mm || 0);
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: "#E0F2FE",
                  padding: "15px",
                  borderRadius: "8px",
                  borderLeft: `6px solid #0284C7`,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                }}
              >
                <h2 style={{ color: "#1E3A8A", marginBottom: "6px" }}>
                  📍 {point.name || `Lat: ${point.lat}, Lon: ${point.lon}`}
                </h2>
                <p style={{ color: rainStatus.color, fontWeight: 600 }}>
                  {rainStatus.label}: {point.rain_mm?.toFixed(2) ?? "0.00"} mm
                </p>
                <p>
                  Risk Level: {point.risk} ({point.risk_prob}%)
                </p>
                {point.notes?.map((note, i) => (
                  <p key={i} style={{ color: "#991b1b", margin: "2px 0" }}>
                    • {note}
                  </p>
                ))}
                <button
                  style={{
                    marginTop: "8px",
                    padding: "6px 12px",
                    backgroundColor: "#2563eb",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  onClick={() => alert(JSON.stringify(point, null, 2))}
                >
                  View Full Alert
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}