import React, { useEffect, useState } from "react";
import { View, Text, Button, Alert } from "react-native";
import * as Location from "expo-location";
import axios from "axios";

type CustomerLocationProps = {
  setAddress?: (addr: string) => void; // optional callback to update parent
};

export default function CustomerLocation({ setAddress: setParentAddress }: CustomerLocationProps) {
  const [address, setAddress] = useState("Fetching location...");
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    const fetchAndSendLocation = async () => {
      try {
        // Request permission
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setAddress("Permission denied");
          if (setParentAddress) setParentAddress("Permission denied");
          return;
        }

        // Get current coordinates
        const loc = await Location.getCurrentPositionAsync({});
        setCoords({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });

        // Reverse geocode
        const reverse = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });

        let fullAddress = "Unknown location";
        if (reverse.length > 0) {
          const r = reverse[0];
          fullAddress = [
            r.name,
            r.street,
            r.subregion,
            r.city,
            r.region,
            r.postalCode,
          ].filter(Boolean).join(", ");
        }

        const displayAddress = `📍 ${fullAddress}`;
        setAddress(displayAddress);
        if (setParentAddress) setParentAddress(displayAddress); // update top bar

        // Send to server
        const payload = {
          user_id: 1,
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          address: fullAddress,
        };
        await axios.post("http://10.25.97.81:8000/api/customer-location/", payload);
      } catch (err: any) {
        console.log(err);
        setAddress("Error fetching location");
        if (setParentAddress) setParentAddress("Error fetching location");
      }
    };

    fetchAndSendLocation();
    const interval = setInterval(fetchAndSendLocation, 2 * 60 * 1000); // refresh every 2 min
    return () => clearInterval(interval);
  }, []);

  // Booking function
  const sendBooking = async () => {
    if (!coords) return Alert.alert("Location not ready");
    try {
      const res = await axios.post("http://10.25.97.81:8000/api/bookings/", {
        user_id: 1,
        service_id: 5,
        latitude: coords.latitude,
        longitude: coords.longitude,
        address,
      });
      Alert.alert("Booking saved!", JSON.stringify(res.data));
    } catch (err) {
      console.log(err);
      Alert.alert("Error saving booking");
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#fff",
        borderRadius: 10,
        elevation: 2,
        marginTop: 10,
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: "500", marginBottom: 15 }}>{address}</Text>
      <Button title="Book Service" onPress={sendBooking} color="#ff6347" />
    </View>
  );
}