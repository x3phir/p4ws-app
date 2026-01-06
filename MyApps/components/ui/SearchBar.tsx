import LocationHeader from "@/components/ui/Location";
import { SlidersHorizontal } from "lucide-react-native";
import React from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

interface SearchHeaderProps {
  location: string;
  onSearchChange: (text: string) => void;
  onFilterPress?: () => void; // Tambahkan props untuk menangani klik filter
}

const SearchHeader = ({
  location,
  onSearchChange,
  onFilterPress,
}: SearchHeaderProps) => (
  <View style={styles.headerWrapper}>
    <LocationHeader location={location} />

    <View style={styles.searchBarContainer}>
      <TextInput
        placeholder="Cari Nama, Ras, atau Gender"
        placeholderTextColor="#9CA3AF"
        style={styles.searchInput}
        onChangeText={onSearchChange}
      />

      <TouchableOpacity
        style={styles.filterButton}
        activeOpacity={0.8}
        onPress={onFilterPress}
      >
        <SlidersHorizontal color="white" size={20} />
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: "#B5E661",
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FDF6E9",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  filterButton: {
    backgroundColor: "#F6D061",
    padding: 10,
    borderRadius: 12,
  },
});

export default SearchHeader;
