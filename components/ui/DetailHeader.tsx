import { useRouter } from "expo-router";
import { ArrowLeft, MoreVertical, Share2 } from "lucide-react-native";
import React from "react";
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

interface DetailHeaderProps {
  imageUri: string;
}

const DetailHeader = ({ imageUri }: DetailHeaderProps) => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Background Image Utama */}
      <Image
        source={{ uri: imageUri }}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {/* Overlay Navigation Buttons */}
      <View style={styles.actionContainer}>
        {/* Tombol Kembali */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft color="white" size={24} />
        </TouchableOpacity>

        {/* Tombol Kanan (Share & More) */}
        <View style={styles.rightActions}>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
            <Share2 color="white" size={24} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
            <MoreVertical color="white" size={24} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    height: 320, // Sedikit lebih tinggi agar visualnya lebih sinematik
    position: "relative",
    backgroundColor: "#ddd",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
  },
  actionContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 40, // Menyesuaikan Notch
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rightActions: {
    flexDirection: "row",
    gap: 12, // Jarak antar tombol di sisi kanan
  },
  iconButton: {
    width: 44,
    height: 44,
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Black/30 overlay
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    // Bayangan halus agar tombol terlihat melayang
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default DetailHeader;
