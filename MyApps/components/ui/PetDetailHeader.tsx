import { useRouter } from "expo-router"; // Tambahkan router agar tombol back jalan
import { ArrowLeft, MoreVertical, Share2 } from "lucide-react-native";
import React from "react";
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getImageUrl } from "@/utils/urlHelper";

const { width } = Dimensions.get("window");

interface PetDetailHeaderProps {
  name: string;
  description: string;
  imageUri: string;
}

const PetDetailHeader = ({
  name,
  description,
  imageUri,
}: PetDetailHeaderProps) => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: getImageUrl(imageUri) }}
        style={styles.mainImage}
        resizeMode="cover"
      />

      {/* Action Buttons Overlay */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.back()}
        >
          <ArrowLeft color="white" size={24} />
        </TouchableOpacity>

        <View style={styles.rightActions}>
          <TouchableOpacity style={styles.iconButton}>
            <Share2 color="white" size={24} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <MoreVertical color="white" size={24} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Info Overlay dengan Background Krem Solid di bawah */}
      <View style={styles.infoOverlay}>
        <View style={styles.glassShape}>
          <Text style={styles.nameText}>{name}</Text>
        </View>
        <View style={styles.desc}>
          <Text style={styles.descText}>{description}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 450,
    position: "relative",
  },
  mainImage: {
    width: "100%",
    height: "100%",
  },
  actionContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 40, // Sesuaikan status bar
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  glassShape: {
    backgroundColor: "#bdbdbd4e", // Warna pink pastel tipis
    alignSelf: "flex-start",
    paddingHorizontal: 5,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
    borderColor: "#bdbdbd",
    borderWidth: 1,
  },
  desc: {
    backgroundColor: "#3bff72df", // Warna pink pastel tipis
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  descText: {
    color: "#000000ff",
    fontSize: 9,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  rightActions: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Black/30 untuk kontras lebih baik
    padding: 10,
    borderRadius: 50,
  },
  infoOverlay: {
    position: "absolute",
    bottom: -1, // Menghilangkan celah pixel
    left: 0,
    right: 0,
    paddingHorizontal: 30,
    paddingBottom: 20,
    paddingTop: 40,
  },
  nameText: {
    fontSize: 48,
    fontWeight: "900",
    color: "#dcdcdcff",
    letterSpacing: -1,
  },
});

export default PetDetailHeader;
