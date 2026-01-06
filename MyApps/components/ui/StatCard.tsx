import React from "react";
import {
  Dimensions,
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

interface StatCardProps {
  title: string;
  count: string;
  bgColor: string;
  size?: "small" | "large";
  image?: ImageSourcePropType; // Foto opsional
}

const StatCard = ({
  title,
  count,
  bgColor,
  size = "small",
  image,
}: StatCardProps) => {
  const isLarge = size === "large";
  const hasImage = !!image;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: bgColor },
        isLarge ? styles.largeCard : styles.smallCard,
      ]}
    >
      {/* Gambar latar belakang untuk small card */}
      {!isLarge && hasImage && (
        <Image
          source={image}
          style={styles.smallCardImage}
          resizeMode="cover"
        />
      )}

      {/* Gambar versi Large */}
      {isLarge && hasImage && (
        <Image
          source={image}
          style={styles.largeCardImage}
          resizeMode="cover"
        />
      )}

      <View style={[isLarge ? styles.largeInfo : styles.smallInfo]}>
        <Text
          style={[styles.titleText, isLarge && styles.largeTitle]}
          numberOfLines={1}
        >
          {title}
        </Text>
        <Text style={[styles.countText, isLarge && styles.largeCount]}>
          {count}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    overflow: "hidden",
  },
  smallCard: {
    flex: 1, // KUNCINYA DISINI: Dia akan mengisi ruang yang tersedia secara merata
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  smallCardImage: {
    position: "absolute",
    right: -10,
    bottom: 0,
    width: 120,
    height: 120,
    // opacity: 0.2, // Halus saja agar teks tetap terbaca
  },
  smallInfo: {
    alignItems: "center",
    paddingHorizontal: 5,
  },
  smallInfoWithImage: {
    alignItems: "flex-start",
    paddingLeft: 12,
  },
  // --- Versi Home ---
  largeCard: {
    width: "100%",
    height: 300,
    padding: 20,
    marginBottom: 15,
  },
  largeCardImage: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 250,
    height: 250,
  },
  largeInfo: {
    justifyContent: "center",
    height: "100%",
    gap: 100,
  },
  // --- Teks ---
  countText: {
    fontSize: 50,
    fontWeight: "900",
    color: "#1A1A1A",
  },
  largeCount: {
    fontSize: 100,
  },
  titleText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "rgba(0,0,0,0.6)",
    textTransform: "uppercase",
  },
  largeTitle: {
    fontSize: 16,
    marginTop: 2,
  },
});

export default StatCard;
