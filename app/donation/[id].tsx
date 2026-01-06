import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Import Components UI Rex ID
import DetailHeader from "@/components/ui/DetailHeader";
import DonationModal from "@/components/ui/DonationModal";
import DonorCard from "@/components/ui/DonorCard";
import OrgCard from "@/components/ui/OrgCard";

const { width } = Dimensions.get("window");

const DonationDetailScreen = () => {
  const { id } = useLocalSearchParams();

  // 3. State untuk kontrol visibilitas Modal
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <DetailHeader imageUri="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba" />

        <View style={styles.bodyContainer}>
          <Text style={styles.titleText}>
            Selamatkan Kucing Jalanan Korban Tabrak
          </Text>

          <Text style={{ color: "#9CA3AF", fontSize: 10, marginTop: 4 }}>
            ID Campaign: {id}
          </Text>

          <Text style={styles.priceText}>Rp125.000</Text>
          <Text style={styles.subPriceText}>
            terkumpul dari <Text style={styles.targetText}>Rp1.000.000</Text>
          </Text>

          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: "12.5%" }]} />
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Informasi Program</Text>
          <OrgCard name="Apple" type="Organization" />

          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Text style={styles.sectionTitle}>Latar Belakang Program</Text>
              <Text style={styles.timeText}>5 Menit lalu</Text>
            </View>
            <Text style={styles.descriptionText}>
              Seekor kucing jalanan ditemukan dengan kondisi kaki patah akibat
              tertabrak kendaraan. Dana ini digunakan untuk biaya operasi, rawat
              inap, dan pemulihan hingga kucing dapat kembali hidup layak.
            </Text>
          </View>

          <View style={styles.donorSection}>
            <View style={styles.donorHeaderRow}>
              <Text style={styles.sectionTitle}>Riwayat Donasi</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countText}>4</Text>
              </View>
            </View>

            <DonorCard name="Orang Baik" amount="Rp50.000" time="1 Jam lalu" />
            <DonorCard name="Orang Baik" amount="Rp50.000" time="2 Jam lalu" />
            <DonorCard
              name="Sobat Kucing"
              amount="Rp25.000"
              time="3 Jam lalu"
            />
          </View>
        </View>
      </ScrollView>

      {/* Tombol Donasi Sticky */}
      <View style={styles.stickyFooter}>
        <TouchableOpacity
          style={styles.donateButton}
          activeOpacity={0.8}
          onPress={() => setModalVisible(true)} // 4. Trigger Modal Buka
        >
          <Text style={styles.donateButtonText}>Donasi Sekarang!</Text>
        </TouchableOpacity>
      </View>

      {/* 5. Komponen Modal */}
      <DonationModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#F5EFE6" },
  scrollContent: { paddingBottom: 120 },
  bodyContainer: { paddingHorizontal: 24, paddingVertical: 24 },
  titleText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1A1A1A",
    lineHeight: 32,
  },
  priceText: {
    fontSize: 26,
    fontWeight: "900",
    color: "#32A852",
    marginTop: 8,
  },
  subPriceText: { fontSize: 12, color: "#9CA3AF", marginTop: 4 },
  targetText: { fontWeight: "800", color: "#1A1A1A" },
  progressBg: {
    height: 10,
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    marginTop: 16,
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: "#32A852" },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    width: "100%",
    marginVertical: 32,
  },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#1A1A1A" },
  infoSection: { marginTop: 32 },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeText: { fontSize: 10, color: "#9CA3AF" },
  descriptionText: {
    fontSize: 14,
    color: "#4B5563",
    marginTop: 12,
    lineHeight: 22,
    textAlign: "justify",
  },
  donorSection: { marginTop: 32 },
  donorHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  countBadge: {
    backgroundColor: "#B5E661",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 10,
  },
  countText: { fontSize: 12, fontWeight: "900", color: "#000" },
  stickyFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: "#F5EFE6",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  donateButton: {
    backgroundColor: "#1EB00E",
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  donateButtonText: { color: "#FFFFFF", fontSize: 18, fontWeight: "900" },
});

export default DonationDetailScreen;
