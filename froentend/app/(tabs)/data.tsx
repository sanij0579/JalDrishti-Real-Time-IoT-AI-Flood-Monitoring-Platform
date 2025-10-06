import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity, Dimensions, Switch } from "react-native";
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";

const BASE_URL = "http://10.55.240.81:8000/api";
const { width, height } = Dimensions.get("window");

type VulnerabilityPoint = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  risk_level: "low" | "medium" | "high";
};

type RainfallData = {
  lat: number;
  lon: number;
  rainfall_mm: number;
};

const getHybridColor = (risk: string, rainfall: number) => {
  let baseColor: [number, number, number];
  switch (risk) {
    case "high": baseColor = [255, 0, 0]; break;
    case "medium": baseColor = [255, 165, 0]; break;
    case "low": baseColor = [0, 200, 0]; break;
    default: baseColor = [0, 0, 255];
  }
  const alpha = Math.min(0.2 + rainfall / 20, 0.7);
  return `rgba(${baseColor[0]},${baseColor[1]},${baseColor[2]},${alpha})`;
};

export default function MapPage() {
  const mapRef = useRef<MapView>(null);
  const [points, setPoints] = useState<VulnerabilityPoint[]>([]);
  const [rainfallData, setRainfallData] = useState<RainfallData[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [fullScreen, setFullScreen] = useState(false);
  const [liveData, setLiveData] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Location permission not granted");
        setLoading(false);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setUserLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
    })();
  }, []);

  const fetchVulnerabilityPoints = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/vulnerability-points/`);
      setPoints(res.data);
    } catch (err) {
      console.error("Error fetching points:", err);
    }
  };

  const fetchRainfallData = async () => {
    if (!liveData) return;
    try {
      const results = await Promise.all(
        points.map(async (p) => {
          const res = await axios.get(`${BASE_URL}/realtime-rainfall/?lat=${p.latitude}&lon=${p.longitude}`);
          return res.data;
        })
      );
      setRainfallData(results);
    } catch (err) {
      console.error("Error fetching rainfall:", err);
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchVulnerabilityPoints();
      await fetchRainfallData();
      setLoading(false);
    };
    load();
  }, [liveData]);

  useEffect(() => {
    if (!liveData) return;
    const interval = setInterval(() => fetchRainfallData(), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [points, liveData]);

  if (loading || !userLocation) {
    return (
      <View style={styles.loadingOverlay}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={{ marginTop: 10, fontWeight: "bold", color: "#2563eb" }}>Loading Map...</Text>
      </View>
    );
  }

  const zoomIn = () => mapRef.current?.animateCamera({ zoom: 1.2 }, { duration: 300 });
  const zoomOut = () => mapRef.current?.animateCamera({ zoom: 0.8 }, { duration: 300 });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <Text style={styles.navTitle}>Flood Risk Map  </Text>
        <View style={styles.liveSwitch}>
          <Text style={{ fontSize: 12, color: "#fff", marginRight: 5 }}>{liveData ? "Live" : "Offline"}</Text>
          <Switch
            value={liveData}
            onValueChange={setLiveData}
            thumbColor={liveData ? "#2563eb" : "#f3f3f3"}
            trackColor={{ false: "#999", true: "#a5b4fc" }}
          />
        </View>
      </View>

      {/* Map */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={[styles.map, { height: fullScreen ? height : height / 2.5 }]}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 10,
          longitudeDelta: 10,
        }}
      >
        {points.map((p, idx) => {
          const rainfall = rainfallData[idx]?.rainfall_mm || 0;
          const radius = 20000 + rainfall * 1000;
          const fillColor = getHybridColor(p.risk_level, rainfall);
          return <Circle key={p.id} center={{ latitude: p.latitude, longitude: p.longitude }} radius={radius} fillColor={fillColor} strokeColor="rgba(0,0,0,0.1)" />;
        })}
        {points.map((p) => (
          <Marker key={p.id} coordinate={{ latitude: p.latitude, longitude: p.longitude }} title={`${p.name} - Risk: ${p.risk_level}`} />
        ))}
        {userLocation && <Marker coordinate={userLocation} title="You" pinColor="blue" />}
      </MapView>

      {/* Legend */}
      <View style={styles.legendContainer}>
        <Text style={styles.legendTitle}>Flood Risk</Text>
        <View style={styles.legendRow}><View style={[styles.colorBox, { backgroundColor: "rgba(255,0,0,0.5)" }]} /><Text style={{ fontSize: 12 }}>High / Heavy Rain</Text></View>
        <View style={styles.legendRow}><View style={[styles.colorBox, { backgroundColor: "rgba(255,165,0,0.5)" }]} /><Text style={{ fontSize: 12 }}>Medium / Moderate Rain</Text></View>
        <View style={styles.legendRow}><View style={[styles.colorBox, { backgroundColor: "rgba(0,200,0,0.5)" }]} /><Text style={{ fontSize: 12 }}>Low / Light Rain</Text></View>
      </View>

      {/* Zoom buttons */}
      <View style={styles.zoomContainer}>
        <TouchableOpacity style={styles.zoomBtn} onPress={zoomIn}><Text style={styles.zoomText}>+</Text></TouchableOpacity>
        <TouchableOpacity style={styles.zoomBtn} onPress={zoomOut}><Text style={styles.zoomText}>-</Text></TouchableOpacity>
      </View>

      {/* Full Screen button below navbar */}
      <TouchableOpacity
        style={[styles.fullScreenBtn, { top: 60, left: 10 }]}
        onPress={() => setFullScreen((prev) => !prev)}
      >
        <Text style={styles.fullScreenText}>{fullScreen ? "Exit Full Screen" : "Full Screen"}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  map: { width: width },
  navbar: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: 50,
    backgroundColor: "#2563eb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    zIndex: 10,
  },
  navTitle: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  liveSwitch: { flexDirection: "row", alignItems: "center" },
  legendContainer: {
    position: "absolute",
    top: 120,
    right: 10,
    backgroundColor: "white",
    padding: 6,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  legendTitle: { fontWeight: "bold", marginBottom: 4, fontSize: 12 },
  legendRow: { flexDirection: "row", alignItems: "center", marginBottom: 3 },
  colorBox: { width: 16, height: 16, marginRight: 5, borderWidth: 1, borderColor: "#000" },
  zoomContainer: { position: "absolute", bottom: 80, right: 10, flexDirection: "column" },
  zoomBtn: {
    backgroundColor: "white",
    width: 35,
    height: 35,
    marginBottom: 8,
    borderRadius: 17.5,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
  },
  zoomText: { fontSize: 18, fontWeight: "bold" },
  fullScreenBtn: {
    position: "absolute",
    backgroundColor: "#2563eb",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    elevation: 5,
    zIndex: 10,
  },
  fullScreenText: { color: "#fff", fontWeight: "bold", fontSize: 12 },
  loadingOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
});