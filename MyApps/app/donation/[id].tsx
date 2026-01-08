import { Campaign, getCampaignById } from "@/services/campaignService";
import { createDonation } from "@/services/donationService";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
import OrgCard from "@/components/ui/OrgCard";

const { width } = Dimensions.get("window");

const DonationDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const [modalVisible, setModalVisible] = useState(false);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch Campaign Detail
  const fetchCampaign = async () => {
    if (id) {
      setLoading(true);
      const data = await getCampaignById(String(id));
      setCampaign(data);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  const handleDonation = async (amount: number, proofUri: string) => {
    if (!campaign) return;
    try {
      await createDonation(campaign.id, amount, proofUri);
      alert(`Donasi sebesar Rp${amount.toLocaleString()} berhasil dikirim! Menunggu verifikasi admin.`);
      setModalVisible(false);
      // Refresh data
      fetchCampaign();
    } catch (error) {
      alert("Gagal mengirim donasi.");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#F5EFE6" }}>
        <ActivityIndicator size="large" color="#1EB00E" />
      </View>
    );
  }

  if (!campaign) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#F5EFE6" }}>
        <Text>Campaign tidak ditemukan.</Text>
      </View>
    );
  }

  const progress = Math.min(campaign.currentAmount / campaign.targetAmount, 1) * 100;

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <DetailHeader imageUri={campaign.imageUrl} />
        <View style={styles.bodyContainer}>
          <Text style={styles.titleText}>
            {campaign.title}
          </Text>

          <Text style={{ color: "#9CA3AF", fontSize: 10, marginTop: 4 }}>
            ID Campaign: {id}
          </Text>

          <Text style={styles.priceText}>Rp{campaign.currentAmount.toLocaleString()}</Text>
          <Text style={styles.subPriceText}>
            terkumpul dari <Text style={styles.targetText}>Rp{campaign.targetAmount.toLocaleString()}</Text>
          </Text>

          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Informasi Program</Text>
          <OrgCard name={campaign.shelter?.name || "Shelter"} type="Organization" />

          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Text style={styles.sectionTitle}>Latar Belakang Program</Text>
              {campaign.createdAt && (
                <Text style={styles.timeText}>{new Date(campaign.createdAt).toLocaleDateString()}</Text>
              )}
            </View>
            <Text style={styles.descriptionText}>
              {campaign.description}
            </Text>
          </View>

          <View style={styles.donorSection}>
            <View style={styles.donorHeaderRow}>
              <Text style={styles.sectionTitle}>Riwayat Donasi ({campaign.donations?.length || 0})</Text>
            </View>
            {campaign.donations && campaign.donations.length > 0 ? (
              campaign.donations.map((donation) => (
                <View key={donation.id} style={styles.donorCard}>
                  <View style={styles.donorAvatar}>
                    <Text style={styles.donorAvatarText}>{donation.user.name.charAt(0).toUpperCase()}</Text>
                  </View>
                  <View style={styles.donorInfo}>
                    <Text style={styles.donorName}>{donation.user.name}</Text>
                    <Text style={styles.donorDate}>{new Date(donation.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
                  </View>
                  <Text style={styles.donorAmount}>Rp{donation.amount.toLocaleString()}</Text>
                </View>
              ))
            ) : (
              <Text style={{ color: '#666', marginTop: 10, fontStyle: 'italic' }}>Belum ada riwayat donasi untuk program ini.</Text>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Tombol Donasi Sticky */}
      <View style={styles.stickyFooter}>
        <TouchableOpacity
          style={styles.donateButton}
          activeOpacity={0.8}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.donateButtonText}>Donasi Sekarang!</Text>
        </TouchableOpacity>
      </View>

      <DonationModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleDonation}
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
  donorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  donorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#32A85220',
    justifyContent: 'center',
    alignItems: 'center',
  },
  donorAvatarText: {
    color: '#32A852',
    fontWeight: 'bold',
    fontSize: 16,
  },
  donorInfo: {
    flex: 1,
    marginLeft: 12,
  },
  donorName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  donorDate: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  donorAmount: {
    fontSize: 14,
    fontWeight: '800',
    color: '#32A852',
  },
});

export default DonationDetailScreen;
