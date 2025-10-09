import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Image,
  Dimensions,
  ActivityIndicator,
  StyleSheet,
  Text,
  Button,
  TouchableOpacity,
  Modal as RNModal,
} from "react-native";
import Swiper from "react-native-swiper";
import axios from "axios";
import { useRouter } from "expo-router";
import MapView, { Marker, Callout } from "react-native-maps";
import Modal from "react-native-modal";
import * as Location from "expo-location";

import LocationBar from "../../components/ui/LocationBar";

const { width } = Dimensions.get("window");

interface SliderItem {
  id: number;
  title: string;
  image: string;
}

interface FloodPoint {
  lat: number;
  lon: number;
  rain_mm: number;
  risk: string;
  risk_prob: number;
  notes: string[];
  name?: string;
}

export default function HomeTab() {
  const router = useRouter();
  const [address, setAddress] = useState("Fetching location...");
  const [sliders, setSliders] = useState<SliderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [floodPoints, setFloodPoints] = useState<FloodPoint[]>([]);
  const [floodLoading, setFloodLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationName, setLocationName] = useState<string>("");
  const [mapFullScreen, setMapFullScreen] = useState(false);

  const [region, setRegion] = useState({
    latitude: 28.6139,
    longitude: 77.209,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  // Reverse geocode current location
  const fetchLocationName = async (lat: number, lon: number) => {
    try {
      const [addr] = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon });
      if (addr) {
        const parts = [
          addr.name,
          addr.street,
          addr.subregion,
          addr.city,
          addr.region,
          addr.postalCode,
          addr.country,
        ].filter(Boolean);
        setLocationName(parts.join(", "));
      }
    } catch (err) {
      console.log("Reverse geocode error:", err);
      setLocationName(`Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`);
    }
  };

  // Fetch device location
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setAddress("Permission denied");
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setCurrentLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      setRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setAddress(`Lat: ${loc.coords.latitude.toFixed(4)}, Lon: ${loc.coords.longitude.toFixed(4)}`);
      fetchLocationName(loc.coords.latitude, loc.coords.longitude);
    })();
  }, []);

  // Fetch sliders
  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    try {
      const res = await axios.get("http://10.107.0.142:8000/api/sliders/");
      setSliders(res.data);
    } catch (err) {
      console.log("Slider fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch flood data
  useEffect(() => {
    if (!currentLocation) return;
    fetchFloodData();
    const interval = setInterval(fetchFloodData, 10 * 60 * 1000); // every 10 mins
    return () => clearInterval(interval);
  }, [currentLocation]);

  const fetchFloodData = async () => {
    if (!currentLocation) return;
    try {
      const { latitude, longitude } = currentLocation;
      const res = await axios.get(`http://10.107.0.142:8000/api/flood_risk/?lat=${latitude}&lon=${longitude}`);

      if (res.data?.data) {
        const pointsWithName = await Promise.all(
          res.data.data.map(async (point: FloodPoint) => {
            try {
              const [addr] = await Location.reverseGeocodeAsync({ latitude: point.lat, longitude: point.lon });
              const parts = [
                addr.name,
                addr.street,
                addr.subregion,
                addr.city,
                addr.region,
                addr.postalCode,
                addr.country,
              ].filter(Boolean);
              return { ...point, name: parts.join(", ") };
            } catch {
              return point;
            }
          })
        );
        setFloodPoints(pointsWithName);
      }
    } catch (err) {
      console.log("Flood API error:", err);
    } finally {
      setFloodLoading(false);
    }
  };

  const getMarkerColor = (point: FloodPoint) => (point.risk === "HIGH" ? "red" : "green");

  const getRainfallStatus = (rain: number) => {
    if (rain >= 20) return { label: "🌧️ Heavy Rainfall", color: "#b91c1c" };
    if (rain >= 5) return { label: "🌦️ Moderate Rainfall", color: "#eab308" };
    if (rain > 0) return { label: "☁️ Light Rainfall", color: "#2563eb" };
    return { label: "☀️ No Rain", color: "#16a34a" };
  };

  if (!currentLocation) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LocationBar address={locationName || address} />

      <ScrollView contentContainerStyle={{ padding: 15, paddingBottom: 100 }}>
        {/* Slider */}
        {loading ? (
          <ActivityIndicator size="large" style={{ marginVertical: 20 }} />
        ) : (
          <View style={{ height: 200, marginBottom: 20 }}>
            <Swiper autoplay loop showsPagination autoplayTimeout={3} containerStyle={{ borderRadius: 10, overflow: "hidden" }}>
              {sliders.map((item) => (
                <View key={item.id} style={styles.slide}>
                  <Image source={{ uri: item.image }} style={styles.image} />
                  {item.title && <Text style={styles.title}>{item.title}</Text>}
                </View>
              ))}
            </Swiper>
          </View>
        )}

        {/* Map Section */}
        <View style={{ position: "relative", marginBottom: 20 }}>
          <Text style={styles.sectionTitle}>Flood Risk Map 💧</Text>
          <TouchableOpacity
            style={styles.fullScreenButton}
            onPress={() => setMapFullScreen(true)}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Full Screen Map</Text>
          </TouchableOpacity>

          <MapView style={styles.map} region={region} showsUserLocation followsUserLocation>
            {floodPoints.map((point, idx) => (
              <Marker
                key={idx}
                coordinate={{ latitude: point.lat, longitude: point.lon }}
                pinColor={getMarkerColor(point)}
                onPress={() => {
                  setSelectedNotes(point.notes);
                  setModalVisible(true);
                }}
              >
                <Callout>
                  <Text>{point.name || `Lat: ${point.lat}, Lon: ${point.lon}`}</Text>
                  <Text>Rain: {point.rain_mm?.toFixed(2) ?? "0.00"} mm</Text>
                  <Text>Risk: {point.risk} ({point.risk_prob}%)</Text>
                </Callout>
              </Marker>
            ))}
          </MapView>
        </View>

        {/* Flood Info Cards */}
        <View style={{ marginTop: 20 }}>
          <Text style={styles.sectionTitle}>Flood Information</Text>
          {floodPoints.map((point, idx) => {
            const rainStatus = getRainfallStatus(point.rain_mm || 0);
            return (
              <View key={idx} style={styles.floodCard}>
                <Text style={styles.locationText}>📍 {point.name || `Lat: ${point.lat}, Lon: ${point.lon}`}</Text>
                <Text style={[styles.rainText, { color: rainStatus.color }]}>
                  {rainStatus.label}: {point.rain_mm?.toFixed(2) ?? "0.00"} mm
                </Text>
                <Text>
                  Risk Level: {point.risk} ({point.risk_prob}%)
                </Text>
                {(point.notes || []).map((note, i) => (
                  <Text key={i} style={styles.noteText}>• {note}</Text>
                ))}
                <View style={{ marginTop: 8 }}>
                  <Button
                    title="View Full Alert"
                    onPress={() =>
                      router.push({
                        pathname: "/alert",
                        params: {
                          location: point.name,
                          rainfall: point.rain_mm.toString(),
                          risk: point.risk_prob.toString(),
                          notes: JSON.stringify(point.notes),
                        },
                      })
                    }
                  />
                </View>
              </View>
            );
          })}
        </View>

        {/* Modal for Safety Notes */}
        <Modal isVisible={modalVisible} onBackdropPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>🚨 Safety Notes</Text>
            {(selectedNotes || []).map((note, i) => (
              <Text key={i} style={styles.modalText}>• {note}</Text>
            ))}
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </Modal>

        {/* Full Screen Map Modal */}
        <RNModal visible={mapFullScreen} animationType="slide">
          <View style={{ flex: 1 }}>
            <MapView style={{ flex: 1 }} region={region} showsUserLocation followsUserLocation>
              {floodPoints.map((point, idx) => (
                <Marker
                  key={idx}
                  coordinate={{ latitude: point.lat, longitude: point.lon }}
                  pinColor={getMarkerColor(point)}
                  onPress={() => setSelectedNotes(point.notes)}
                />
              ))}
            </MapView>
            <View style={styles.mapOverlay}>
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>Legend:</Text>
              <View style={{ flexDirection: "row", marginTop: 5 }}>
                <View style={[styles.colorBox, { backgroundColor: "green" }]} />
                <Text style={{ marginRight: 10 }}>LOW Flood</Text>
                <View style={[styles.colorBox, { backgroundColor: "red" }]} />
                <Text>HIGH Flood</Text>
              </View>
              <Button title="Close" onPress={() => setMapFullScreen(false)} />
            </View>
          </View>
        </RNModal>

        {/* Footer */}
        <View style={{ alignItems: "center", marginTop: 40, marginBottom: 40 }}>
          <Text style={{
            fontSize: 40,
            fontWeight: "bold",
            color: "#FF6B00",
            textAlign: "center",
            letterSpacing: 1.5,
          }}>
            🌊 Live It Up — Stay Safe, Stay Aware ⚡
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  slide: { flex: 1, justifyContent: "center", alignItems: "center" },
  image: { width: width - 30, height: 200, borderRadius: 10, resizeMode: "cover" },
  title: {
    position: "absolute",
    bottom: 10,
    left: 15,
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginVertical: 10 },
  map: { width: width - 30, height: 400, borderRadius: 10 },
  floodCard: {
    backgroundColor: "#E0F2FE",
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftColor: "#0284C7",
    borderLeftWidth: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  locationText: { fontWeight: "bold", fontSize: 18, color: "#1E3A8A", marginBottom: 6 },
  rainText: { fontWeight: "600", fontSize: 16, marginBottom: 4 },
  noteText: { fontSize: 14, marginBottom: 4, color: "#991b1b" },
  modalContainer: { backgroundColor: "#fff", padding: 20, borderRadius: 12 },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10, color: "#dc2626" },
  modalText: { fontSize: 16, marginBottom: 6 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  fullScreenButton: {
    position: "absolute",
    top: 50,
    right: 60,
    backgroundColor: "#2563eb",
    padding: 6,
    borderRadius: 6,
    zIndex: 100,
  },
  mapOverlay: {
    position: "absolute",
    top: 60,
    left: 20,
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: 15,
    borderRadius: 10,
  },
  colorBox: { width: 20, height: 20, marginRight: 5, borderRadius: 4 },
});