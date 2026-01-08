import { Feather } from "@expo/vector-icons"; // Tambah ikon biar cakep
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface FilterBarProps {
  onSortPress: () => void;
  onFilterPress?: () => void;
}

const FilterBar = ({ onSortPress, onFilterPress }: FilterBarProps) => {
  return (
    <View style={[styles.container, !onFilterPress && { justifyContent: "center" }]}>
      {/* Tombol Urutkan */}
      <TouchableOpacity
        style={[styles.button, !!onFilterPress && styles.borderRight]}
        activeOpacity={0.7}
        onPress={onSortPress}
      >
        <Feather name="list" size={16} color="#374151" style={styles.icon} />
        <Text style={styles.buttonText}>Urutkan</Text>
      </TouchableOpacity>

      {/* Tombol Filter */}
      {onFilterPress && (
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.7}
          onPress={onFilterPress}
        >
          <Feather name="sliders" size={16} color="#374151" style={styles.icon} />
          <Text style={styles.buttonText}>Filter</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    // borderTopWidth: 1,
    // borderBottomWidth: 1,
    // borderColor: "#E5E7EB", // Warna abu-abu halus
    paddingVertical: 12,
    marginBottom: 20,
    // Shadow tipis biar kelihatan melayang dikit
    // elevation: 2,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.05,
    // shadowRadius: 2,
  },
  button: {
    flex: 1,
    flexDirection: "row", // Agar ikon dan teks sejajar horizontal
    alignItems: "center",
    justifyContent: "center",
  },
  borderRight: {
    borderRightWidth: 1,
    borderColor: "#E5E7EB",
  },
  icon: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "700", // Pakai 700 biar tegas kaya Rex ID
    color: "#374151",
  },
});

export default FilterBar;
