import React from "react";
import { ScrollView, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function AlertScreen() {
  const params = useLocalSearchParams<{
    location?: string;
    rainfall?: string;
    risk?: string;
    notes?: string;
  }>();

  const locationName = params.location || "Current Location";
  const rainfall = params.rainfall ? parseFloat(params.rainfall) : 0;
  const riskPercentage = params.risk ? parseFloat(params.risk) : 0;
  const parsedNotes: string[] = params.notes ? JSON.parse(params.notes) : [];

  let riskLevel = "Low";
  if (riskPercentage > 70) riskLevel = "High";
  else if (riskPercentage > 40) riskLevel = "Medium";

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🚨 Flood Alert: {locationName}</Text>

      <Text style={styles.infoText}>Rainfall: {rainfall} mm</Text>
      <Text style={styles.infoText}>
        Risk Level: {riskLevel} ({riskPercentage}%)
      </Text>

      {parsedNotes.length > 0 &&
        parsedNotes.map((note, i) => (
          <Text key={i} style={styles.text}>
            • {note}
          </Text>
        ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 60, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10, color: "#dc2626" },
  infoText: { fontSize: 16, fontWeight: "600", color: "#b45309", marginBottom: 5 },
  text: { fontSize: 16, marginBottom: 10 },
});