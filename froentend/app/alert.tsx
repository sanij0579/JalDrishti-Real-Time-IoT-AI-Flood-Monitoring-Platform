import React from "react";
import { ScrollView, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function AlertScreen() {
  const params = useLocalSearchParams<{ notes: string }>();
  const parsedNotes: string[] = params.notes ? JSON.parse(params.notes) : [];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🚨 Flood Alert Details</Text>
      {parsedNotes.length > 0 ? (
        parsedNotes.map((note, i) => (
          <Text key={i} style={styles.text}>
            • {note}
          </Text>
        ))
      ) : (
        <>
          <Text style={styles.text}>• Avoid low-lying areas</Text>
          <Text style={styles.text}>• Follow safe routes</Text>
          <Text style={styles.text}>• Nearest shelter: Community Hall</Text>
          <Text style={styles.text}>• Keep emergency kit ready</Text>
          <Text style={styles.text}>• Stay updated with live alerts</Text>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15, color: "#dc2626" },
  text: { fontSize: 16, marginBottom: 10 },
});