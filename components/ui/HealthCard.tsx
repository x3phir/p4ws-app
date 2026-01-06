import { HeartPulse, Scissors } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface HealthProps {
  type: "vaccine" | "steril";
  status: string;
}

const HealthCard = ({ type, status }: HealthProps) => {
  const isVaccine = type === "vaccine";

  return (
    <View style={styles.card}>
      {/* Icon Container */}
      <View
        style={[
          styles.iconWrapper,
          { backgroundColor: isVaccine ? "#DCFCE7" : "#DBEAFE" }, // bg-green-100 : bg-blue-100
        ]}
      >
        {isVaccine ? (
          <HeartPulse color="#22C55E" size={24} />
        ) : (
          <Scissors color="#3B82F6" size={24} />
        )}
      </View>

      {/* Text Content */}
      <View style={styles.textContainer}>
        <Text style={styles.label}>
          {isVaccine ? "Vaksinasi" : "Sterilisasi"}
        </Text>
        <Text style={styles.statusText} numberOfLines={1}>
          {status}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 30,
    padding: 16,
    // Shadow styling
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
    color: "#9CA3AF", // text-gray-400
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  statusText: {
    fontSize: 16, // Sedikit disesuaikan agar tidak terlalu sesak di hp kecil
    fontWeight: "900",
    color: "#1F2937", // text-gray-800
    lineHeight: 20,
  },
});

export default HealthCard;
