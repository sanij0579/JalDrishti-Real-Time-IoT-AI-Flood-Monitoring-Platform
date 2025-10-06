import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

type LocationBarProps = {
  address: string;
  onPress?: () => void;
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
    <TouchableOpacity activeOpacity={0.9} onPress={handlePress} style={styles.wrapper}>
      <LinearGradient
        colors={["#ffffff", "#f8f9ff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <View style={styles.left}>
          <View style={styles.iconBox}>
            <MaterialIcons name="location-on" size={22} color="#2563eb" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Your Location</Text>
            <Text style={styles.address} numberOfLines={1}>
              {address}
            </Text>
          </View>
        </View>

        <View style={styles.right}>
          <MaterialIcons name="keyboard-arrow-down" size={26} color="#6b7280" />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    marginTop: 10,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255,255,255,0.9)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#e0e7ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  label: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  address: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  right: {
    marginLeft: 10,
  },
});