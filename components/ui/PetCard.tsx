import { MapPin } from "lucide-react-native";
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const cardWidth = (width - 64) / 2; // Menghitung lebar 2 kolom dengan gap

const PetCard = ({ name, breed, location, imageUri, onPress }: any) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <Image source={{ uri: imageUri }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.breed}>{breed}</Text>
        <View style={styles.locationRow}>
          <MapPin size={12} color="#9CA3AF" />
          <Text style={styles.locationText} numberOfLines={1}>
            {location}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    backgroundColor: "white",
    borderRadius: 24,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  image: {
    width: "100%",
    height: 150,
    backgroundColor: "#E5E7EB",
  },
  info: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "900",
    color: "#1A1A1A",
  },
  breed: {
    fontSize: 12,
    color: "#6B7280",
    marginVertical: 2,
    fontWeight: "600",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 4,
  },
  locationText: {
    fontSize: 10,
    color: "#9CA3AF",
    fontWeight: "700",
    flex: 1,
  },
});

export default PetCard;
