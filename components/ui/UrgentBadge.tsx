import React from "react";
import { StyleSheet, Text, View } from "react-native";

const UrgentBadge = () => {
  return (
    <View style={styles.badgeContainer}>
      <Text style={styles.badgeText}>BUTUH CEPAT</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badgeContainer: {
    position: "absolute",
    bottom: 50,
    right: 30,
    backgroundColor: "#FF4141",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    zIndex: 99,
    pointerEvents: "none",
  },
  badgeText: {
    fontSize: 9,
    fontWeight: "900",
    color: "#FFFFFF",
    fontStyle: "italic",
    letterSpacing: 0.5,
  },
});

export default UrgentBadge;
