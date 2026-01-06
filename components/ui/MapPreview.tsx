import React from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const MapPreview = () => (
  <View style={styles.container}>
    <ImageBackground
      source={{
        // Gunakan placeholder peta yang stabil jika token Mapbox belum ada
        uri: "https://www.google.com/maps/vt/pb=!1m4!1m3!1i12!2i2625!3i1612!2m3!1e0!2sm!3i600000000!3m8!2sen!3sus!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m1!1f2",
      }}
      style={styles.mapBackground}
      resizeMode="cover"
    >
      {/* Tombol "Lihat Peta Lengkap" di tengah peta */}
      <TouchableOpacity style={styles.previewButton} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Lihat Peta Lengkap</Text>
      </TouchableOpacity>
    </ImageBackground>
  </View>
);

const styles = StyleSheet.create({
  container: {
    height: 180, // Menyesuaikan h-40 atau desain di iPhone 16
    borderRadius: 30, // rounded-[30px]
    overflow: "hidden", // KUNCI: Memotong gambar agar melengkung sempurna
    backgroundColor: "#E5E7EB", // bg-gray-200
    borderWidth: 1,
    borderColor: "#F3F4F6", // border-gray-100
  },
  mapBackground: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  previewButton: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    // Shadow agar tombol terlihat menonjol di atas peta
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  blueDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#3B82F6", // bg-blue-500
    marginRight: 8,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
});

export default MapPreview;
