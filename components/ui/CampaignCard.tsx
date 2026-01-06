import { useRouter } from "expo-router"; // 1. Import router
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CampaignProps {
  id: string; // 2. Tambahkan id agar bisa navigasi
  title: string;
  shelter: string;
  collected: string;
  daysLeft: number;
  imageUri: string;
  progress: number;
}

const CampaignCard = ({
  id, // Terima prop id
  title,
  shelter,
  collected,
  daysLeft,
  imageUri,
  progress,
}: CampaignProps) => {
  const router = useRouter(); // 3. Inisialisasi router

  return (
    // 4. Bungkus dengan TouchableOpacity agar bisa diklik
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() =>
        router.push({
          pathname: "/donation/[id]",
          params: { id: id },
        })
      }
      style={styles.card}
    >
      {/* Gambar Campaign */}
      <Image
        source={{ uri: imageUri }}
        style={styles.bannerImage}
        resizeMode="cover"
      />

      <View style={styles.contentPadding}>
        <Text style={styles.titleText} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.shelterText}>Shelter {shelter}</Text>

        <View style={styles.footerRow}>
          <View style={styles.progressSection}>
            <Text style={styles.collectedText}>
              Terkumpul : <Text style={styles.boldBlack}>{collected}</Text>
            </Text>

            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${progress * 100}%` },
                ]}
              />
            </View>
          </View>

          <Text style={styles.daysLeftText}>
            Sisa Hari : <Text style={styles.boldBlack}>{daysLeft}</Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    padding: 8,
    marginRight: 16,
    width: 280,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  bannerImage: {
    width: "100%",
    height: 144,
    borderRadius: 25,
  },
  contentPadding: {
    padding: 12,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a1a1a",
    lineHeight: 22,
  },
  shelterText: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 4,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 16,
  },
  progressSection: {
    flex: 1,
  },
  collectedText: {
    fontSize: 10,
    color: "#9CA3AF",
  },
  boldBlack: {
    fontWeight: "bold",
    color: "#000000",
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    marginTop: 6,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#22C55E",
    borderRadius: 10,
  },
  daysLeftText: {
    fontSize: 10,
    color: "#9CA3AF",
    marginLeft: 16,
  },
});

export default CampaignCard;
