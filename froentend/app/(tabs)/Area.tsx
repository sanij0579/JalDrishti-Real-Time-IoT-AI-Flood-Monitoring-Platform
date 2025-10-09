import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from "react-native-maps";
import axios from "axios";

type ZoneData = {
  zone: string;
  lat: number;
  lon: number;
  rain_1h: number;
  upstream_rain: number;
  downstream_rain: number;
};

type SensorData = {
  id: number;
  water_level: number;
  location: string;
  timestamp: string;
};

export default function MapScreen() {
  const [zones, setZones] = useState<ZoneData[]>([]);
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const mapRef = useRef<MapView>(null);

  const [region, setRegion] = useState({
    latitude: 28.6139,
    longitude: 77.209,
    latitudeDelta: 0.3,
    longitudeDelta: 0.3,
  });

  // ===== Fetch Zones + Sensor Data =====
  const fetchAllData = async () => {
    try {
      const [zonesRes, sensorsRes] = await Promise.all([
        axios.get("http://10.107.0.142:8000/api/zone-flow-weather/"),
        axios.get("http://10.107.0.142:8000/api/data/"),
      ]);

      // Process zone data
      const zoneArray = Object.entries(zonesRes.data).map(([zone, info]: any) => ({
        zone,
        ...info,
      }));

      setZones(zoneArray);

      // Sort sensor data by timestamp desc (latest first)
      const sortedSensors: SensorData[] = sensorsRes.data.sort(
        (a: SensorData, b: SensorData) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setSensorData(sortedSensors);

      // Auto-fit map to all zones
      if (zoneArray.length > 0) {
        const coordinates = zoneArray.map((z) => ({
          latitude: z.lat,
          longitude: z.lon,
        }));
        mapRef.current?.fitToCoordinates(coordinates, {
          edgePadding: { top: 60, bottom: 80, left: 60, right: 60 },
          animated: true,
        });
      }
    } catch (err) {
      console.log("Error fetching data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 5000); // every 5 seconds → live update
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAllData();
  };

  const zoomIn = () => {
    setRegion((prev) => ({
      ...prev,
      latitudeDelta: prev.latitudeDelta / 2,
      longitudeDelta: prev.longitudeDelta / 2,
    }));
  };

  const zoomOut = () => {
    setRegion((prev) => ({
      ...prev,
      latitudeDelta: prev.latitudeDelta * 2,
      longitudeDelta: prev.longitudeDelta * 2,
    }));
  };

  const getLevelColor = (level: number) => {
    if (level > 80) return "#ef4444"; // red
    if (level > 50) return "#facc15"; // yellow
    return "#22c55e"; // green
  };

  if (loading)
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#60a5fa" />
        <Text style={{ color: "#94a3b8", marginTop: 10 }}>Loading map data...</Text>
      </View>
    );

  return (
    <View style={{ flex: 1, backgroundColor: "#0f172a" }}>
      {/* ===== Map Section ===== */}
      <View style={{ flex: 1 }}>
        <MapView
          provider={PROVIDER_GOOGLE}
          ref={mapRef}
          style={styles.map}
          region={region}
        >
          {zones.map((zone, index) => (
            <Marker
              key={index}
              coordinate={{ latitude: zone.lat, longitude: zone.lon }}
              pinColor={
                zone.rain_1h + zone.upstream_rain > 10
                  ? "red"
                  : zone.rain_1h + zone.upstream_rain > 5
                  ? "yellow"
                  : "green"
              }
            >
              <Callout>
                <Text>
                  {zone.zone}{"\n"}
                  Rain: {zone.rain_1h} mm{"\n"}
                  Upstream: {zone.upstream_rain} mm{"\n"}
                  Downstream: {zone.downstream_rain} mm
                </Text>
              </Callout>
            </Marker>
          ))}
        </MapView>

        {/* Zoom Buttons */}
        <View style={styles.zoomContainer}>
          <TouchableOpacity style={styles.zoomButton} onPress={zoomIn}>
            <Text style={styles.zoomText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.zoomButton} onPress={zoomOut}>
            <Text style={styles.zoomText}>-</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ===== Water Level Section ===== */}
      <View style={styles.dataContainer}>
        <Text style={styles.sectionTitle}>💧 Live Water Level Data</Text>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {sensorData.length === 0 ? (
            <Text style={styles.noDataText}>No sensor data available</Text>
          ) : (
            sensorData.map((item) => (
              <View
                key={item.id}
                style={[styles.card, { borderLeftColor: getLevelColor(item.water_level) }]}
              >
                <Text style={styles.cardTitle}>{item.location}</Text>
                <Text style={styles.cardValue}>
                  {item.water_level.toFixed(1)} cm
                </Text>
                <Text style={styles.timestamp}>
                  {new Date(item.timestamp).toLocaleString()}
                </Text>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  map: { width: "100%", height: "100%" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0f172a" },
  zoomContainer: {
    position: "absolute",
    top: 70,
    right: 10,
    backgroundColor: "rgba(30,41,59,0.7)",
    borderRadius: 8,
    padding: 5,
  },
  zoomButton: {
    padding: 6,
    marginVertical: 3,
    backgroundColor: "#2563eb",
    borderRadius: 4,
    alignItems: "center",
  },
  zoomText: { color: "white", fontSize: 18, fontWeight: "bold" },
  dataContainer: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.95)",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 14,
    paddingTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#e2e8f0",
    marginBottom: 8,
    textAlign: "center",
  },
  card: {
    backgroundColor: "rgba(30,41,59,0.8)",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 5,
  },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: "#f1f5f9" },
  cardValue: { fontSize: 20, fontWeight: "600", color: "#60a5fa" },
  timestamp: { fontSize: 12, color: "#94a3b8", marginTop: 2 },
  noDataText: {
    textAlign: "center",
    color: "#94a3b8",
    marginTop: 10,
    fontSize: 14,
  },
});