import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface OrgCardProps {
  name: string;
  type: string;
}

const OrgCard = ({ name, type }: OrgCardProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Penggalang Dana</Text>

      <View style={styles.card}>
        {/* Logo Container */}
        <View style={styles.logoWrapper}>
          <Image
            source={{ uri: "https://logo.clearbit.com/apple.com" }}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* Text Info */}
        <View style={styles.textWrapper}>
          <Text style={styles.orgName}>{name}</Text>
          <Text style={styles.orgType}>{type}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 4, // Sedikit padding biar gak terlalu nempel ke pinggir layar detail
  },
  label: {
    fontSize: 12,
    fontWeight: "800",
    color: "#9CA3AF", // Gray-500
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 24,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  logoWrapper: {
    width: 52,
    height: 52,
    backgroundColor: "#000000",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  logoImage: {
    width: 32,
    height: 32,
    // Jika logonya butuh warna putih (seperti invert di web)
    tintColor: "#FFFFFF",
  },
  textWrapper: {
    flex: 1,
  },
  orgName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1F2937",
  },
  orgType: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 2,
    fontWeight: "600",
  },
});

export default OrgCard;
