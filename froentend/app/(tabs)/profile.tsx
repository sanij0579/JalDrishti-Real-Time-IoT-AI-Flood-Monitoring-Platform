import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";

const Profile = () => {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: () => {
          console.log("User logged out");
          router.replace("/"); // 👈 redirects to main index.tsx
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/2202/2202112.png",
          }}
          style={styles.profileImage}
        />
        <View>
          <Text style={styles.userName}>Sani Jain</Text>
          <Text style={styles.userRole}>Citizen - Smart Flood System</Text>
          {/* <Text style={styles.userPhone}>📍 Indore, Madhya Pradesh</Text> */}
        </View>
      </View>

      {/* Stats / Info Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <MaterialCommunityIcons
            name="water-alert"
            size={22}
            color="#38bdf8"
          />
          <Text style={styles.statValue}>Active</Text>
          <Text style={styles.statLabel}>Flood Alerts</Text>
        </View>
        <View style={styles.statBox}>
          <MaterialCommunityIcons
            name="chip"
            size={22}
            color="#a855f7"
          />
          <Text style={styles.statValue}>3</Text>
          <Text style={styles.statLabel}>IoT Devices</Text>
        </View>
        <View style={styles.statBox}>
          <Ionicons name="cloudy-night-outline" size={22} color="#f59e0b" />
          <Text style={styles.statValue}>Rain: 0mm</Text>
          <Text style={styles.statLabel}>Current Level</Text>
        </View>
      </View>

      {/* Menu Section */}
      <View style={styles.menuContainer}>
        <MenuItem
          icon={<Ionicons name="map-outline" size={22} color="#2563eb" />}
          title="Flood Map Dashboard"
          onPress={() => console.log("Navigate to GIS map")}
        />
        <MenuItem
          icon={<MaterialIcons name="notifications" size={22} color="#f59e0b" />}
          title="Flood Alerts & Safety Tips"
          onPress={() => console.log("Navigate to Alerts")}
        />
        <MenuItem
          icon={<Ionicons name="hardware-chip-outline" size={22} color="#22c55e" />}
          title="Connected IoT Devices"
          onPress={() => console.log("Navigate to Devices")}
        />
        <MenuItem
          icon={<MaterialCommunityIcons name="account-cog-outline" size={22} color="#6b7280" />}
          title="Profile Settings"
          onPress={() => console.log("Navigate to Settings")}
        />
        <MenuItem
          icon={<Ionicons name="help-circle-outline" size={22} color="#0ea5e9" />}
          title="Help & Support"
          onPress={() => console.log("Navigate to Help")}
        />
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={22} color="#ef4444" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* Footer */}
      <Text style={styles.versionText}>
        Flash Flood Monitoring App • v1.0.0
      </Text>
      <Text style={styles.missionText}>
        🌊 Empowering Smart Cities • Protecting Lives • SDG 6 & 11
      </Text>
    </ScrollView>
  );
};

const MenuItem = ({ icon, title, onPress }: any) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuLeft}>
      {icon}
      <Text style={styles.menuText}>{title}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e3a8a",
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 50,
    marginRight: 16,
    borderWidth: 2,
    borderColor: "#93c5fd",
  },
  userName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  userRole: {
    fontSize: 14,
    color: "#e0e7ff",
    marginTop: 4,
  },
  userPhone: {
    fontSize: 13,
    color: "#c7d2fe",
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  statBox: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 6,
    color: "#111827",
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
  },
  menuContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 8,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e7eb",
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuText: {
    fontSize: 15,
    color: "#111827",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fee2e2",
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
  },
  logoutText: {
    fontSize: 15,
    color: "#ef4444",
    fontWeight: "600",
  },
  versionText: {
    textAlign: "center",
    color: "#9ca3af",
    marginTop: 14,
    fontSize: 12,
  },
  missionText: {
    textAlign: "center",
    color: "#2563eb",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 4,
    marginBottom: 20,
  },
});

export default Profile;