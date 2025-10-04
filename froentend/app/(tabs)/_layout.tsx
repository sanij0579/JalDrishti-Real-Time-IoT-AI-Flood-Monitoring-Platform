import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import { lightColors, darkColors,} from "../../constants/colors"; // ✅ adjust path

export default function TabLayout() {
  // 👉 abhi ke liye manually ek theme pick kar rahe hain
  const colors = lightColors; // change to darkColors, diwaliColors, etc.

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.placeholder,
        tabBarStyle: {
          backgroundColor: colors.background,
          height: 60,
          borderTopWidth: 0.5,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: { fontSize: 12, marginBottom: 5, fontWeight: "bold" },
        headerShown: true,
        headerStyle: { backgroundColor: colors.background },
        headerTitleStyle: { color: colors.text },
      } satisfies BottomTabNavigationOptions}
    >
      {/* Home */}
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Cart */}
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}