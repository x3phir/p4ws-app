import { User } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface DonorProps {
  name: string;
  amount: string;
  time: string;
}

const DonorCard = ({ name, amount, time }: DonorProps) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.avatarWrapper}>
        <User color="#FFFFFF" size={24} />
      </View>

      <View style={styles.infoWrapper}>
        <Text style={styles.nameText}>{name}</Text>
        <Text style={styles.amountLabel}>
          Berdonasi sebesar <Text style={styles.amountValue}>{amount}</Text>
        </Text>
        <Text style={styles.timeText}>{time}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#EBE3D5",
    borderRadius: 25,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  avatarWrapper: {
    width: 48,
    height: 48,
    backgroundColor: "#9CA3AF",
    borderRadius: 24,
    // INI YANG SUDAH DIPERBAIKI:
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  infoWrapper: {
    flex: 1,
  },
  nameText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1F2937",
  },
  amountLabel: {
    fontSize: 13,
    color: "#4B5563",
    marginTop: 2,
  },
  amountValue: {
    fontWeight: "800",
    color: "#000000",
  },
  timeText: {
    fontSize: 10,
    color: "#9CA3AF",
    marginTop: 4,
    fontWeight: "600",
  },
});

export default DonorCard;
