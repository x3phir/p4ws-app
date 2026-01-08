import { useRouter } from "expo-router"; // Import router
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getImageUrl } from "@/utils/urlHelper";

interface ShelterItemProps {
  name: string;
  imageUri: string;
}

const ShelterItem = ({ name, imageUri }: ShelterItemProps) => {
  return (
    <View style={styles.container}>
      {/* Container Gambar dengan Border Radius Eksplisit */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: getImageUrl(imageUri) }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      {/* Label Nama di bawah gambar */}
      <Text style={styles.nameText} numberOfLines={1}>
        {name}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 20,
    alignItems: "center",
    width: 128,
  },
  imageWrapper: {
    width: 128,
    height: 128,
    borderRadius: 30,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    // Shadow agar terlihat melayang (Floating)
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  nameText: {
    marginTop: 8,
    fontWeight: "700", // Saya buat sedikit lebih tebal biar tegas
    color: "#1F2937",
    fontSize: 14,
  },
});

export default ShelterItem;
