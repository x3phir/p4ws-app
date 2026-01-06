import React from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";

// Import Components
import Header from "@/components/ui/Header";
import ScreenWrapper from "@/components/ui/ScreenWrapper";
import ShelterItem from "@/components/ui/ShelterItem";
import StatCard from "@/components/ui/StatCard";

const { height } = Dimensions.get("window");

export default function App() {
  return (
    <ScreenWrapper backgroundImage={require("@/assets/images/BG-1.png")}>
      <Header name="Rex ID" />

      {/* 2. Panel Krem Solid Utama */}
      <View style={styles.mainContent}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          <View style={styles.innerWrapper}>
            {/* Label Section */}
            <Text style={styles.sectionLabel}>Statistik Penyelamatan</Text>

            {/* Kartu Statistik Besar */}
            <StatCard
              title="Total Rescued"
              count="29"
              bgColor="#F6D061"
              size="large"
              image={require("@/assets/images/stats/image-01.png")}
            />

            {/* Baris Statistik Kecil */}
            <View style={styles.statsRow}>
              <StatCard
                title="Homeless"
                count="15"
                bgColor="#FF7E7E"
                image={require("@/assets/images/stats/image-02.png")}
              />
              <StatCard
                title="Ready to Adopt"
                count="10"
                bgColor="#7EB2FF"
                image={require("@/assets/images/stats/image-03.png")}
              />
            </View>

            {/* Section Shelters */}
            <View style={styles.headerRow}>
              <Text style={styles.sectionTitle}>Shelters</Text>
            </View>
          </View>

          {/* List Shelter Horizontal */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalPadding}
          >
            <ShelterItem
              name="Paw Care"
              imageUri="https://images.unsplash.com/photo-1543852786-1cf6624b9987"
            />
            <ShelterItem
              name="Kitten Home"
              imageUri="https://images.unsplash.com/photo-1573865668131-974279df4045"
            />
            <ShelterItem
              name="Pet House"
              imageUri="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba"
            />
            <ShelterItem
              name="Pet House"
              imageUri="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba"
            />
          </ScrollView>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    backgroundColor: "#F5EFE6", // Tetap krem solid sesuai request
    borderTopLeftRadius: 45, // Radius lebih besar biar makin modern
    borderTopRightRadius: 45,
    marginTop: 20, // Jarak aman agar Header tetap Floating
    elevation: 20, // Shadow biar berasa nindih background
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    overflow: "hidden",
  },
  scrollContainer: {
    paddingTop: 30,
    paddingBottom: 120, // Ruang untuk Bottom Navbar
  },
  innerWrapper: {
    paddingHorizontal: 24,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
    marginBottom: 35,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#1A1A1A",
  },
  horizontalPadding: {
    paddingHorizontal: 24,
    gap: 12,
  },
});
