import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a React Query client
const queryClient = new QueryClient();

export default function TabLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#00f6ff", // neon blue for modern look
          tabBarInactiveTintColor: "#a5b4fc", // soft violet
          tabBarStyle: {
            backgroundColor: "#1e3a8a", // deep tech-blue
            height: Platform.OS === "ios" ? 80 : 65,
            borderTopWidth: 0,
            paddingBottom: Platform.OS === "ios" ? 20 : 10,
            shadowColor: "#000",
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 6,
          },
          tabBarLabelStyle: { fontSize: 13, fontWeight: "bold" },
          tabBarActiveBackgroundColor: "#2563eb",
          headerStyle: {
            backgroundColor: "#1e40af", // modern header color
          },
          headerTitleStyle: {
            color: "#00f6ff", // neon/modern color
            fontWeight: "bold",
            fontSize: 18,
            marginTop: 10,
          },
        }}
      >
        {/* 🏠 Home */}
        <Tabs.Screen
          name="home"
          options={{
            headerTitle: "🌊 Flood Dashboard",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={size + (focused ? 2 : 0)}
                color={color}
              />
            ),
          }}
        />

        {/* ➕ Add Post / Upstream-Downstream */}
        <Tabs.Screen
          name="Area"
          options={{
            headerTitle: "Up/Downstream Area",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "water" : "water-outline"}
                size={size + (focused ? 2 : 0)}
                color={focused ? "#00f6ff" : color}
              />
            ),
          }}
        />

        {/* 📊 Data */}
        <Tabs.Screen
          name="data"
          options={{
            headerTitle: "Data Overview",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "analytics" : "analytics-outline"}
                size={size + (focused ? 2 : 0)}
                color={focused ? "#00f6ff" : color}
              />
            ),
          }}
        />

        {/* 🚦 Traffic */}
        <Tabs.Screen
          name="traffic"
          options={{
            headerTitle: "Traffic Info",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "camera" : "camera-outline"}
                size={size + (focused ? 2 : 0)}
                color={focused ? "#00f6ff" : color}
              />
            ),
          }}
        />

        {/* 👤 Profile */}
        <Tabs.Screen
          name="profile"
          options={{
            headerTitle: "Profile",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "person" : "person-circle-outline"}
                size={size + (focused ? 2 : 0)}
                color={focused ? "#00f6ff" : color}
              />
            ),
          }}
        />
      </Tabs>
    </QueryClientProvider>
  );
}