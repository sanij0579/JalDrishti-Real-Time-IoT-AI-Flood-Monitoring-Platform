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
} from "react-native";
import Swiper from "react-native-swiper";
import axios from "axios";
import { useRouter } from "expo-router";

import LocationBar from "../../components/ui/LocationBar";
import CustomerLocation from "../../components/ CustomerLocation";

const { width } = Dimensions.get("window");

interface SliderItem {
  id: number;
  title: string;
  image: string;
}

interface FloodZone {
  zone: string;
  rain_mm: number;
  risk: string;
  risk_prob: number;
  notes: string[];
}

export default function HomeTab() {
  const router = useRouter();
  const [address, setAddress] = useState("Fetching location...");
  const [sliders, setSliders] = useState<SliderItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [floodZones, setFloodZones] = useState<FloodZone[]>([]);
  const [floodLoading, setFloodLoading] = useState(true);

  // Fetch sliders
  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    try {
      const res = await axios.get("http://10.25.97.81:8000/api/sliders/");
      setSliders(res.data);
    } catch (err) {
      console.log("Slider fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch flood risk data (multi-zone)
  useEffect(() => {
    fetchFloodData();
    const interval = setInterval(fetchFloodData, 10 * 60 * 1000); // refresh every 10 min
    return () => clearInterval(interval);
  }, []);

  const fetchFloodData = async () => {
    try {
      const res = await axios.get("http://10.25.97.81:8000/api/flood-risk/");
      setFloodZones(res.data.data);
    } catch (err) {
      console.log("Flood API error:", err);
    } finally {
      setFloodLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      {/* Top Location Bar */}
      <LocationBar address={address} />

      <ScrollView contentContainerStyle={{ padding: 15 }}>
        {/* Slider */}
        {loading ? (
          <ActivityIndicator size="large" style={{ marginVertical: 20 }} />
        ) : (
          <View style={{ height: 200, marginBottom: 20 }}>
            <Swiper
              autoplay
              loop
              showsPagination
              autoplayTimeout={3}
              containerStyle={{ borderRadius: 10, overflow: "hidden" }}
            >
              {sliders.map((item) => (
                <View key={item.id} style={styles.slide}>
                  <Image source={{ uri: item.image }} style={styles.image} />
                  {item.title && <Text style={styles.title}>{item.title}</Text>}
                </View>
              ))}
            </Swiper>
          </View>
        )}

        {/* Flood Risk Section */}
        <View style={styles.floodContainer}>
          <Text style={styles.sectionTitle}>🌧️ Flood Prediction</Text>
          {floodLoading ? (
            <ActivityIndicator size="small" />
          ) : floodZones.length > 0 ? (
            floodZones.map((zone, idx) => (
              <View key={idx} style={styles.floodCard}>
                <Text style={styles.zoneTitle}>{zone.zone}</Text>
                <Text>Rainfall: {zone.rain_mm} mm/hr</Text>
                <Text>
                  Risk: {zone.risk} ({zone.risk_prob}%)
                </Text>
                <View style={{ marginTop: 5 }}>
                  {zone.notes.slice(0, 2).map((note, i) => (
                    <Text key={i} style={styles.noteText}>
                      • {note}
                    </Text>
                  ))}
                </View>
                <View style={{ marginTop: 5 }}>
                  <Button
                    title="View Full Alert"
                    color="#dc2626"
                    onPress={() =>
                      router.push({
                        pathname: "/alert",
                        params: { notes: JSON.stringify(zone.notes) },
                      })
                    }
                  />
                </View>
              </View>
            ))
          ) : (
            <Text>No flood data available</Text>
          )}
        </View>

        {/* Customer Location Component */}
        <CustomerLocation setAddress={setAddress} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
  floodContainer: { marginVertical: 20, padding: 15, backgroundColor: "#fde68a", borderRadius: 10 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  floodCard: { backgroundColor: "#fef3c7", padding: 10, borderRadius: 8, marginBottom: 15 },
  noteText: { fontSize: 14, marginBottom: 4, color: "#991b1b" },
  zoneTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
});