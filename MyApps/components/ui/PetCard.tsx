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
import { getImageUrl } from "@/utils/urlHelper";

const { width } = Dimensions.get("window");
const cardWidth = (width - 64) / 2; // Menghitung lebar 2 kolom dengan gap

const PetCard = ({ name, breed, imageUri, onPress, gender }: any) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <Image source={{ uri: getImageUrl(imageUri) }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.breed}>{breed}</Text>
      </View>
      <View style={styles.petGender}>
        <Text style={styles.petGenderText}>{gender}</Text>
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
    borderWidth: 1,
    borderColor: "#E5E7EB",
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
  petGender: {
    backgroundColor: "#E5E7EB",
    alignSelf: "flex-start",
    paddingHorizontal: 5,
    paddingVertical: 4,
    borderRadius: 12,
    marginHorizontal: 10,
    marginBottom: 8,
  },
  petGenderText: {
    color: "#1A1A1A",
    fontSize: 12,
    fontWeight: "600",
  },
});

export default PetCard;
