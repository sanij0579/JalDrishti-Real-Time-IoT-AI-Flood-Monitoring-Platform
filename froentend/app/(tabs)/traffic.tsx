import React, { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
  TouchableOpacity,
  Text,
  ScrollView,
  TextInput,
  Button,
  Image,
} from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Card from "../../components/ui/Card";
import { getReviews, createReview } from "../../services/reviews";

const { width, height } = Dimensions.get("window");

type TrafficPoint = {
  id: number;
  latitude: number;
  longitude: number;
  traffic_level: "low" | "medium" | "high";
};

type Review = {
  id: number;
  comment: string;
  image?: string;
  created_at: string;
};

const getTrafficColor = (level: string) => {
  switch (level) {
    case "high": return "rgba(255,0,0,0.5)";
    case "medium": return "rgba(255,255,0,0.5)";
    case "low": return "rgba(0,255,0,0.5)";
    default: return "rgba(0,0,255,0.3)";
  }
};

// Haversine formula
const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function TrafficAndReviews() {
  const queryClient = useQueryClient();

  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [mapRef, setMapRef] = useState<MapView | null>(null);
  const [fullScreen, setFullScreen] = useState(false);
  const [pulse] = useState(new Animated.Value(0));
  const [trafficPoints, setTrafficPoints] = useState<TrafficPoint[]>([]);

  const [inputText, setInputText] = useState("");
  const [pickedImage, setPickedImage] = useState<string | null>(null);

  const { data: reviews, isLoading: reviewsLoading } = useQuery<Review[]>({
    queryKey: ["reviews"],
    queryFn: getReviews,
  });

  const addReview = useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      setInputText("");
      setPickedImage(null);
    },
  });

  // Pulse animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1000, useNativeDriver: true, easing: Easing.ease }),
        Animated.timing(pulse, { toValue: 0, duration: 1000, useNativeDriver: true, easing: Easing.ease }),
      ])
    ).start();
  }, []);

  // Get device location
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const loc = await Location.getCurrentPositionAsync({});
      setCurrentLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
    })();
  }, []);

  // Example traffic data
  const demoTraffic: TrafficPoint[] = [
    { id: 1, latitude: 20.5937, longitude: 78.9629, traffic_level: "high" },
    { id: 2, latitude: 20.7, longitude: 78.97, traffic_level: "medium" },
    { id: 3, latitude: 20.65, longitude: 79.0, traffic_level: "low" },
  ];

  // Filter nearby traffic points
  useEffect(() => {
    if (currentLocation) {
      const nearby = demoTraffic.filter(
        t => getDistanceFromLatLonInKm(currentLocation.latitude, currentLocation.longitude, t.latitude, t.longitude) <= 20
      );
      setTrafficPoints(nearby);
    }
  }, [currentLocation]);

  const pulseScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 2.2] });

  const recenterMap = () => {
    if (mapRef && currentLocation) {
      mapRef.animateToRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
    if (!result.canceled) setPickedImage(result.assets[0].uri);
  };

  const submitReview = () => {
    if (!inputText) return;
    const formData = new FormData();
    formData.append("comment", inputText);
    if (pickedImage) {
      const filename = pickedImage.split("/").pop()!;
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;
      formData.append("image", { uri: pickedImage, name: filename, type } as any);
    }
    addReview.mutate(formData);
  };

  if (!currentLocation || reviewsLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      {/* Map */}
      <MapView
        ref={setMapRef}
        style={{ width, height: fullScreen ? height : height / 2.5 }}
        initialRegion={{
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        showsTraffic={true}
      >
        <Marker coordinate={currentLocation}>
          <View style={styles.markerContainer}>
            <Animated.View style={[styles.pulse, { transform: [{ scale: pulseScale }], backgroundColor: "rgba(0,0,255,0.3)" }]} />
            <View style={[styles.dot, { backgroundColor: "#0000ff" }]} />
          </View>
        </Marker>

        {trafficPoints.map((point) => (
          <Circle
            key={point.id}
            center={{ latitude: point.latitude, longitude: point.longitude }}
            radius={500}
            fillColor={getTrafficColor(point.traffic_level)}
            strokeColor={getTrafficColor(point.traffic_level)}
          />
        ))}
      </MapView>

      {/* Buttons */}
      <View style={styles.overlayBtnContainer}>
        <TouchableOpacity style={styles.currentLocBtn} onPress={recenterMap}><Text style={styles.btnText}>📍</Text></TouchableOpacity>
        <TouchableOpacity style={styles.fullScreenBtn} onPress={() => setFullScreen(p => !p)}>
          <Text style={styles.fullScreenText}>{fullScreen ? "Exit Full Screen" : "Full Screen"}</Text>
        </TouchableOpacity>
      </View>

      {/* Legend */}
      <View style={styles.legendContainer}>
        <Text style={styles.legendTitle}>Traffic Legend</Text>
        <View style={styles.legendRow}><View style={[styles.colorBox, { backgroundColor: "rgba(255,0,0,0.5)" }]} /><Text>High</Text></View>
        <View style={styles.legendRow}><View style={[styles.colorBox, { backgroundColor: "rgba(255,255,0,0.5)" }]} /><Text>Medium</Text></View>
        <View style={styles.legendRow}><View style={[styles.colorBox, { backgroundColor: "rgba(0,255,0,0.5)" }]} /><Text>Low</Text></View>
      </View>

      {/* Reviews */}
      <ScrollView style={{ padding: 16 }}>
        {reviews?.map(r => (
          <Card key={r.id} text={r.comment}>
            {r.image && <Image source={{ uri: r.image }} style={styles.reviewImage} />}
            <Text style={styles.timestamp}>{new Date(r.created_at).toLocaleString()}</Text>
          </Card>
        ))}

        <TextInput
          placeholder="Write your review..."
          value={inputText}
          onChangeText={setInputText}
          style={styles.input}
        />

        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
          <Text>{pickedImage ? "Change Image" : "Pick an Image"}</Text>
        </TouchableOpacity>

        {pickedImage && <Image source={{ uri: pickedImage }} style={styles.reviewImage} />}

        <Button title="Add Post" onPress={submitReview} />
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  markerContainer: { alignItems: "center", justifyContent: "center" },
  pulse: { position: "absolute", width: 20, height: 20, borderRadius: 10 },
  dot: { width: 14, height: 14, borderRadius: 7 },
  overlayBtnContainer: { position: "absolute", width: width, height: height },
  currentLocBtn: { position: "absolute", top: 20, right: 15, backgroundColor: "#fff", padding: 10, borderRadius: 8, elevation: 5 },
  fullScreenBtn: { position: "absolute", top: 20, left: 15, backgroundColor: "#2563eb", paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10, elevation: 5 },
  btnText: { color: "#000", fontWeight: "bold", fontSize: 16 },
  fullScreenText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  legendContainer: { position: "absolute", top: 80, right: 15, backgroundColor: "white", padding: 10, borderRadius: 8, elevation: 5 },
  legendTitle: { fontWeight: "bold", marginBottom: 6 },
  legendRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  colorBox: { width: 20, height: 20, marginRight: 6, borderWidth: 1, borderColor: "#000" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginVertical: 10, borderRadius: 8 },
  imagePicker: { backgroundColor: "#eee", padding: 10, marginBottom: 10, borderRadius: 8, alignItems: "center" },
  reviewImage: { width: "100%", height: 200, borderRadius: 8, marginVertical: 6 },
  timestamp: { fontSize: 12, color: "#555", marginTop: 4 },
});