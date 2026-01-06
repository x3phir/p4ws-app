import { Bell, MapPin } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface LocationHeaderProps {
  location: string;
}

const LocationHeader = ({ location }: LocationHeaderProps) => (
  <View style={styles.topRow}>
    <View>
      <Text style={styles.locationLabel}>LOKASI ANDA</Text>
      <View style={styles.locationContainer}>
        <MapPin color="black" size={18} fill="black" />
        <Text style={styles.locationText}>{location}</Text>
      </View>
    </View>

    <TouchableOpacity style={styles.notificationButton} activeOpacity={0.7}>
      <Bell color="black" size={20} />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  locationLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#4B5563",
    letterSpacing: 1.5,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  locationText: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 4,
    color: "#1a1a1a",
  },
  notificationButton: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 50,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
});

export default LocationHeader;
