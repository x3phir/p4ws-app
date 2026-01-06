import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface DonationListProps {
  id: string;
  title: string;
  community: string;
  collected: string;
  progress: number;
  imageUri?: string;
}

const DonationListCard = ({
  id,
  title,
  community,
  collected,
  progress,
  imageUri,
}: DonationListProps) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        router.push({
          pathname: "/donation/[id]",
          params: { id: id },
        })
      }
      style={styles.cardContainer}
    >
      {/* Thumbnail Gambar */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: imageUri || "https://via.placeholder.com/150" }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      {/* Info Content */}
      <View style={styles.contentWrapper}>
        <Text style={styles.titleText} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.communityText}>{community}</Text>

        {/* Progress Bar Section */}
        <View style={styles.progressSection}>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${Math.min(progress * 100, 100)}%` },
              ]}
            />
          </View>
          <Text style={styles.collectedLabel}>
            Terkumpul: <Text style={styles.collectedAmount}>{collected}</Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white", // Background putih agar bersih
    borderRadius: 20, // Radius besar agar modern
    padding: 12, // Ruang napas di dalam kartu
    marginBottom: 16, // Jarak antar kartu
    // Efek Bayangan (Shadow)
    elevation: 4, // Shadow untuk Android
    shadowColor: "#000", // Shadow untuk iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  imageWrapper: {
    width: 85,
    height: 85,
    backgroundColor: "#E5E7EB",
    borderRadius: 15,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  contentWrapper: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "center",
  },
  titleText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1F2937",
    lineHeight: 18,
  },
  communityText: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 2,
    fontWeight: "600",
  },
  progressSection: {
    marginTop: 8,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#AEE637",
  },
  collectedLabel: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 4,
  },
  collectedAmount: {
    fontWeight: "800",
    color: "#000",
  },
});

export default DonationListCard;
