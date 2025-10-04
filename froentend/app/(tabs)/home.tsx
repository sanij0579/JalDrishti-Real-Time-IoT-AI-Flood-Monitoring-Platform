import React, { useEffect, useState } from "react";
import { View, ScrollView, Image, Dimensions, ActivityIndicator, StyleSheet, Text } from "react-native";
import Swiper from "react-native-swiper";
import axios from "axios";

import LocationBar from "../../components/ui/LocationBar";
import CustomerLocation from "../../components/ CustomerLocation";

const { width } = Dimensions.get("window");

interface SliderItem {
  id: number;
  title: string;
  image: string;
}

export default function HomeTab() {
  const [address, setAddress] = useState("Fetching location...");
  const [sliders, setSliders] = useState<SliderItem[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      {/* Top Location Bar */}
      <LocationBar address={address} />

      {/* Scrollable content */}
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
                  {item.title ? <Text style={styles.title}>{item.title}</Text> : null}
                </View>
              ))}
            </Swiper>
          </View>
        )}

        {/* Customer Location Component */}
        <CustomerLocation setAddress={setAddress} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: width - 30,
    height: 200,
    borderRadius: 10,
    resizeMode: "cover",
  },
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
});