import { Bell } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface HeaderProps {
  name: string;
}

const Header = ({ name }: HeaderProps) => {
  return (
    <View style={styles.headerWrapper}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.welcomeText}>Hello, {name}!</Text>
          {/* Tambahkan subtitle "Rex ID" jika ingin persis seperti di foto */}
          <Text style={styles.subText}></Text>
        </View>

        {/* Tombol Notifikasi sesuai foto iPhone 16 */}
        <TouchableOpacity style={styles.iconContainer}>
          <Bell color="black" size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: "transparent", // Warna hijau solid dari foto
    paddingTop: 40, // Menyesuaikan status bar
    paddingBottom: 40, // Ruang untuk lengkungan bawah
    paddingHorizontal: 24,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  subText: {
    fontSize: 14,
    color: "#333",
    marginTop: -2,
  },
  iconContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.5)", // Putih transparan
    padding: 10,
    borderRadius: 50,
  },
});

export default Header;
