import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function GalleryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gallery Screen</Text>
      <Text style={styles.subtitle}>Coming soon...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0E27",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  subtitle: {
    fontSize: 16,
    color: "#9CA3AF",
    marginTop: 8,
  },
});
