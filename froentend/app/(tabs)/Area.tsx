import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import axios from "axios";

type ZoneData = {
  zone: string;
  lat: number;
  lon: number;
  rain_1h: number;
  upstream_rain: number;
  downstream_rain: number;
};

export default function MapScreen() {
  const [zones, setZones] = useState<ZoneData[]>([]);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState({
    latitude: 28.6139,
    longitude: 77.209,
    latitudeDelta: 0.3,
    longitudeDelta: 0.3,
  });

  const fetchZones = () => {
    axios
      .get("http://10.55.240.81:8000/api/zone-flow-weather/") // change YOUR_BACKEND_IP
      .then((res) => {
        const dataArray = Object.entries(res.data).map(([zone, info]: any) => ({
          zone,
          ...info,
        }));
        setZones(dataArray);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchZones();
    const interval = setInterval(fetchZones, 300000); // refresh every 5 mins
    return () => clearInterval(interval);
  }, []);

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

  if (loading)
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );

  return (
    <View style={{ flex: 1 }}>
      {/* Top Heading */}
      {/* <View style={styles.headingContainer}>
        <Text style={styles.headingText}>Upstream / Downstream Area of Your City</Text>
      </View> */}

      {/* Map */}
      <MapView style={styles.map} region={region}>
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

      {/* Legend / Flow Info */}
      <View style={styles.legendContainer}>
        <Text style={styles.legendTitle}>Legend / Flow Info:</Text>
        <ScrollView style={{ maxHeight: 120 }}>
          {zones.map((zone, index) => {
            const totalRain = zone.rain_1h + zone.upstream_rain;
            let color = totalRain > 10 ? "red" : totalRain > 5 ? "yellow" : "green";
            return (
              <View style={styles.legendRow} key={index}>
                <View style={[styles.colorBox, { backgroundColor: color }]} />
                <View>
                  <Text style={styles.legendText}>
                    {zone.zone} → Rain: {zone.rain_1h} mm
                  </Text>
                  <Text style={styles.legendSubText}>
                    Upstream: {zone.upstream_rain} mm | Downstream: {zone.downstream_rain} mm
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headingContainer: {
    padding: 10,
    backgroundColor: "#2563eb",
    alignItems: "center",
  },
  headingText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },
  map: { flex: 1 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  zoomContainer: {
    position: "absolute",
    top: 70,
    right: 10,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 8,
    padding: 5,
  },
  zoomButton: {
    padding: 5,
    marginVertical: 2,
    backgroundColor: "#2563eb",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  zoomText: { color: "white", fontSize: 18, fontWeight: "bold" },
  legendContainer: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 8,
    elevation: 5,
  },
  legendTitle: { fontWeight: "bold", marginBottom: 5, fontSize: 16 },
  legendRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 5 },
  colorBox: { width: 20, height: 20, marginRight: 8, marginTop: 2 },
  legendText: { fontSize: 14, fontWeight: "bold" },
  legendSubText: { fontSize: 12, color: "#555" },
});