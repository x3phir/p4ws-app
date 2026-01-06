import React from "react";
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import CampaignCard from "@/components/ui/CampaignCard";
import DonationListCard from "@/components/ui/DonationListCard";
import FilterBar from "@/components/ui/FilterBar";
import UrgentBadge from "@/components/ui/UrgentBadge";

const { width } = Dimensions.get("window");

const DonationScreen = () => {
  return (
    <View style={styles.container}>
      {/* --- HEADER HIJAU --- */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Donasi <Text style={styles.headerBold}>Kucing</Text>
        </Text>
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Cari Campaign"
            placeholderTextColor="#999"
            style={styles.searchInput}
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* --- HORIZONTAL SECTION (URGENT) --- */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Dibutuhkan Cepat</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {/* ID ditambahkan agar CampaignCard bisa diklik */}
            <View style={styles.urgentCardWrapper}>
              <CampaignCard
                id="pakan-shelter-01"
                title="Pakan kucing di shelter"
                shelter="Paw Care"
                collected="Rp 125.000"
                daysLeft={3}
                progress={0.4}
                imageUri="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba"
              />
              <UrgentBadge />
            </View>

            <View style={styles.urgentCardWrapper}>
              <CampaignCard
                id="vaksin-massal-02"
                title="Vaksinasi Massal Kucing"
                shelter="Kitten Home"
                collected="Rp 2.500.000"
                daysLeft={5}
                progress={0.6}
                imageUri="https://images.unsplash.com/photo-1573865668131-974279df4045"
              />
              <UrgentBadge />
            </View>
          </ScrollView>
        </View>

        {/* --- VERTICAL LIST SECTION --- */}
        <View style={styles.listSection}>
          <Text style={[styles.sectionTitle, { paddingHorizontal: 24 }]}>
            Program Lainnya
          </Text>

          <FilterBar />

          <View style={styles.listContainer}>
            {/* DonationListCard menggunakan ID untuk navigasi ke detail */}
            <DonationListCard
              id="kucing-tabrak-01"
              title="Selamatkan Kucing Jalanan Korban Tabrak"
              community="Peduli Kucing Bandung"
              collected="Rp 325.000"
              progress={0.7}
              imageUri="https://images.unsplash.com/photo-1533733319232-246a744b0d3e"
            />

            <DonationListCard
              id="kucing-sakit-02"
              title="Operasi Mata Kucing Liar"
              community="Sahabat Meow"
              collected="Rp 850.000"
              progress={0.3}
              imageUri="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5EFE6",
  },
  header: {
    backgroundColor: "#B5E661",
    paddingTop: Platform.OS === "ios" ? 60 : 50,
    paddingBottom: 35,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 28,
    color: "black",
  },
  headerBold: {
    fontWeight: "900",
  },
  searchContainer: {
    marginTop: 25,
  },
  searchInput: {
    backgroundColor: "#FDF6E9",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  sectionContainer: {
    paddingVertical: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 15,
    paddingHorizontal: 24,
    color: "#1A1A1A",
  },
  horizontalScroll: {
    paddingLeft: 24,
    paddingRight: 10,
  },
  urgentCardWrapper: {
    position: "relative",
    marginRight: 15,
  },
  listSection: {
    marginTop: 10,
  },
  listContainer: {
    paddingTop: 5,
    paddingHorizontal: 20,
  },
});

export default DonationScreen;
