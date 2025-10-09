import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

type ZoneData = {
  zone: string;
  lat: number;
  lon: number;
  rain_1h: number;
  upstream_rain: number;
  downstream_rain: number;
};

// Fix default marker icon issue in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const Services: React.FC = () => {
  const [zones, setZones] = useState<ZoneData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchZones = async () => {
    try {
      const res = await axios.get(
        "http://10.107.0.142:8000/api/zone-flow-weather/"
      );
      const dataArray = Object.entries(res.data).map(([zone, info]: any) => ({
        zone,
        ...info,
      }));
      setZones(dataArray);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
    const interval = setInterval(fetchZones, 300000); // refresh every 5 min
    return () => clearInterval(interval);
  }, []);

  const getColor = (zone: ZoneData) => {
    const totalRain = zone.rain_1h + zone.upstream_rain;
    if (totalRain > 10) return "red";
    if (totalRain > 5) return "orange";
    return "green";
  };

  const styles: { [key: string]: React.CSSProperties } = {
    container: { width: "90%", margin: "20px auto", fontFamily: "Arial, sans-serif" },
    title: { textAlign: "center", marginBottom: 20, color: "#2563eb" },
    loader: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: 400,
      fontSize: 18,
      color: "#2563eb",
    },
    mapContainer: { height: 500, width: "100%", borderRadius: 8 },
    legend: {
      marginTop: 15,
      padding: 15,
      borderRadius: 8,
      backgroundColor: "#f9f9f9",
      boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
    },
    legendTitle: { marginBottom: 10, color: "#333" },
    legendScroll: { maxHeight: 200, overflowY: "auto" },
    legendRow: { display: "flex", alignItems: "flex-start", marginBottom: 8 },
    colorBox: { width: 20, height: 20, marginRight: 10, marginTop: 3, borderRadius: 4 },
    zoneName: { fontSize: 14, color: "#111" },
    zoneInfo: { fontSize: 13, color: "#555", margin: "2px 0 0 0" },
  };

  if (loading)
    return (
      <div style={styles.loader}>
        <h2>Loading Zones...</h2>
      </div>
    );

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>City Zones - Rain & Flow Info</h2>

      <MapContainer
        center={[28.6139, 77.209]}
        zoom={10}
        style={styles.mapContainer}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {zones.map((zone, idx) => (
          <Marker key={idx} position={[zone.lat, zone.lon]}>
            <Popup>
              <div>
                <h4>{zone.zone}</h4>
                <p>Rain: {zone.rain_1h} mm</p>
                <p>Upstream: {zone.upstream_rain} mm</p>
                <p>Downstream: {zone.downstream_rain} mm</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Legend */}
      <div style={styles.legend}>
        <h3 style={styles.legendTitle}>Legend / Flow Info</h3>
        <div style={styles.legendScroll}>
          {zones.map((zone, idx) => (
            <div style={styles.legendRow} key={idx}>
              <div style={{ ...styles.colorBox, backgroundColor: getColor(zone) }} />
              <div>
                <strong style={styles.zoneName}>{zone.zone}</strong>
                <p style={styles.zoneInfo}>
                  Rain: {zone.rain_1h} mm | Upstream: {zone.upstream_rain} mm |
                  Downstream: {zone.downstream_rain} mm
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;