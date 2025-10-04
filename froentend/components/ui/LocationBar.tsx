import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

type LocationBarProps = {
  address: string;
  onPress?: () => void; // optional callback when pressed
};

export default function LocationBar({ address, onPress }: LocationBarProps) {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      Alert.alert("Current Location", address);
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.8}>
      <View style={styles.left}>
        <MaterialIcons name="location-on" size={24} color="#ff6347" />
        <Text style={styles.text} numberOfLines={1}>
          {address}
        </Text>
      </View>
      <MaterialIcons name="keyboard-arrow-down" size={24} color="#888" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderRadius: 15,
    marginHorizontal: 15,
    marginTop: 10,
    // Modern subtle shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  text: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flexShrink: 1,
  },
});