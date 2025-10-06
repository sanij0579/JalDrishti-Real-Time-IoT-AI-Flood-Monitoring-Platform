import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

type CardProps = {
  text: string;
  rating?: number;
  children?: React.ReactNode; // for images or other content
  timestamp?: string;         // optional timestamp
};

const Card: React.FC<CardProps> = ({ text, rating, children, timestamp }) => {
  return (
    <View style={styles.card}>
      {/* Text content */}
      <Text style={styles.text}>{text}</Text>

      {/* Optional rating */}
      {rating !== undefined && <Text style={styles.rating}>Rating: {rating} ⭐</Text>}

      {/* Children (like image) */}
      {children && <View style={styles.childrenContainer}>{children}</View>}

      {/* Timestamp */}
      {timestamp && <Text style={styles.timestamp}>{timestamp}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  rating: {
    fontSize: 14,
    fontWeight: "600",
    color: "#f59e0b",
    marginBottom: 8,
  },
  childrenContainer: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    color: "#777",
    textAlign: "right",
  },
});

export default Card;