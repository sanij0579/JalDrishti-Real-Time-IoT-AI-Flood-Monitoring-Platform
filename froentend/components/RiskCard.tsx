import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface Props {
  title: string;
  value: string | number;
}

export default function RiskCard({ title, value }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card:{
    backgroundColor:"#fef3c7",
    padding:15,
    borderRadius:10,
    marginBottom:10,
    width:"100%"
  },
  title:{ fontSize:16, fontWeight:"bold" },
  value:{ fontSize:18, marginTop:5 }
});