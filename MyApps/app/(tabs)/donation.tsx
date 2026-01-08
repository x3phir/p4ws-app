import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Search, PawPrint } from "lucide-react-native";

import CampaignCard from "@/components/ui/CampaignCard";
import DonationListCard from "@/components/ui/DonationListCard";
import FilterBar from "@/components/ui/FilterBar";
import UrgentBadge from "@/components/ui/UrgentBadge";
import { Campaign, getAllCampaigns } from "@/services/campaignService";
import { Colors } from "@/constants/theme";
import ScreenWrapper from "@/components/ui/ScreenWrapper";

const { height } = Dimensions.get("window");

// Component Badge Complete
const CompleteBadge = () => (
  <View style={styles.completeBadge}>
    <Text style={styles.completeBadgeText}>✓ Selesai</Text>
  </View>
);

const DonationScreen = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("Terbaru");
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setIsLoading(true);
        const data = await getAllCampaigns();
        setCampaigns(data);
      } catch (error) {
        console.error("Failed to fetch campaigns:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  // Filter & Sort logic
  const filteredAndSortedCampaigns = campaigns
    .filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortOption === "Target") {
        return b.targetAmount - a.targetAmount;
      } else if (sortOption === "Progress") {
        const progressA = a.currentAmount / a.targetAmount;
        const progressB = b.currentAmount / b.targetAmount;
        return progressB - progressA;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  // Pisahkan berdasarkan status complete
  const completedCampaigns = filteredAndSortedCampaigns.filter(
    c => c.currentAmount >= c.targetAmount
  );
  const activeCampaigns = filteredAndSortedCampaigns.filter(
    c => c.currentAmount < c.targetAmount
  );

  const urgentCampaigns = activeCampaigns.filter(c => c.isUrgent);
  const otherCampaigns = activeCampaigns.filter(c => !c.isUrgent);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <ScreenWrapper backgroundColor={Colors.primary}>
      <View style={styles.headerDecoration} pointerEvents="none">
        <PawPrint size={100} color="rgba(255,255,255,0.1)" style={{ position: 'absolute', top: 20, right: -20, transform: [{ rotate: '15deg' }] }} />
        <View style={styles.bubble1} />
      </View>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Donasi Kucing</Text>
      </View>

      <View style={styles.contentCard}>
        <View style={styles.searchBarWrapper}>
          <View style={styles.searchContainer}>
            <Search color="#9CA3AF" size={20} />
            <TextInput
              placeholder="Cari program donasi..."
              placeholderTextColor="#9CA3AF"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#1A1A1A" />
              <Text style={styles.loadingText}>Memuat program donasi...</Text>
            </View>
          ) : (
            <>
              {urgentCampaigns.length > 0 && (
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>Dibutuhkan Cepat</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.horizontalScroll}
                  >
                    {urgentCampaigns.map((campaign) => (
                      <View key={campaign.id} style={styles.urgentCardWrapper}>
                        <CampaignCard
                          id={campaign.id}
                          title={campaign.title}
                          shelter={campaign.shelter?.name || "Shelter"}
                          collected={formatCurrency(campaign.currentAmount)}
                          progress={Math.min(campaign.currentAmount / campaign.targetAmount, 1)}
                          imageUri={campaign.imageUrl}
                        />
                        <UrgentBadge />
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}

              <View style={styles.listSection}>
                <Text style={styles.sectionTitle}>Program Lainnya</Text>

                <FilterBar
                  onSortPress={() => setIsSortModalVisible(true)}
                />

                <View style={styles.listContainer}>
                  {otherCampaigns.length > 0 ? (
                    otherCampaigns.map((campaign) => {
                      const isComplete = campaign.currentAmount >= campaign.targetAmount;
                      return (
                        <View key={campaign.id} style={styles.campaignCardWrapper}>
                          <DonationListCard
                            id={campaign.id}
                            title={campaign.title}
                            community={campaign.shelter?.name || "Komunitas"}
                            collected={formatCurrency(campaign.currentAmount)}
                            progress={Math.min(campaign.currentAmount / campaign.targetAmount, 1)}
                            imageUri={campaign.imageUrl}
                          />
                          {isComplete && <CompleteBadge />}
                        </View>
                      );
                    })
                  ) : (
                    urgentCampaigns.length === 0 && (
                      <View style={styles.emptyContainer}>
                        <Text style={styles.emptyEmoji}>📦</Text>
                        <Text style={styles.emptyText}>Belum ada program donasi.</Text>
                      </View>
                    )
                  )}
                </View>
              </View>

              {/* Section Program Selesai */}
              {completedCampaigns.length > 0 && (
                <View style={styles.listSection}>
                  <Text style={styles.sectionTitle}>Program Selesai</Text>
                  <View style={styles.listContainer}>
                    {completedCampaigns.map((campaign) => (
                      <View key={campaign.id} style={styles.campaignCardWrapper}>
                        <DonationListCard
                          id={campaign.id}
                          title={campaign.title}
                          community={campaign.shelter?.name || "Komunitas"}
                          collected={formatCurrency(campaign.currentAmount)}
                          progress={1}
                          imageUri={campaign.imageUrl}
                        />
                        <CompleteBadge />
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </>
          )}
        </ScrollView>
      </View>

      {/* Sort Modal */}
      <Modal
        visible={isSortModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsSortModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsSortModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalContent}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Urutkan Donasi</Text>
            <View style={styles.modalOptionsList}>
              {[
                { value: "Terbaru", label: "Terbaru", emoji: "🕐" },
                { value: "Target", label: "Target Tertinggi", emoji: "🎯" },
                { value: "Progress", label: "Progress Terbanyak", emoji: "📊" }
              ].map(option => (
                <TouchableOpacity
                  key={option.value}
                  style={[styles.modalOption, sortOption === option.value && styles.activeModalOption]}
                  onPress={() => {
                    setSortOption(option.value);
                    setIsSortModalVisible(false);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.modalOptionContent}>
                    <Text style={styles.modalOptionEmoji}>{option.emoji}</Text>
                    <Text style={[styles.modalOptionText, sortOption === option.value && styles.activeModalOptionText]}>
                      {option.label}
                    </Text>
                  </View>
                  {sortOption === option.value && (
                    <View style={styles.checkmark}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.closeModalBtn}
              onPress={() => setIsSortModalVisible(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.closeModalText}>Tutup</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#1A1A1A",
    letterSpacing: -0.5,
  },
  bubble1: {
    position: 'absolute',
    top: -50,
    left: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  headerDecoration: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    zIndex: 0,
  },
  contentCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 24,
    minHeight: height - 150,
  },
  searchBarWrapper: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "500",
    color: "#1A1A1A",
  },
  scrollContent: {
    paddingBottom: 100,
  },
  loadingContainer: {
    paddingVertical: 100,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "600",
  },
  sectionContainer: {
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1A1A1A",
    marginBottom: 16,
    paddingHorizontal: 24,
    letterSpacing: -0.3,
  },
  horizontalScroll: {
    paddingLeft: 24,
    paddingRight: 8,
  },
  urgentCardWrapper: {
    position: "relative",
    marginRight: 16,
  },
  listSection: {
    paddingTop: 8,
  },
  listContainer: {
    paddingHorizontal: 24,
  },
  campaignCardWrapper: {
    position: "relative",
    marginBottom: 12,
  },
  completeBadge: {
    position: "absolute",
    top: 80,
    right: 2,
    backgroundColor: "#10B981",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  completeBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#9CA3AF",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#1A1A1A",
    marginBottom: 20,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  modalOptionsList: {
    gap: 10,
    marginBottom: 16,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: "#F9FAFB",
    borderWidth: 2,
    borderColor: "#F3F4F6",
  },
  activeModalOption: {
    backgroundColor: "#FEF3C7",
    borderColor: "#FCD34D",
  },
  modalOptionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  modalOptionEmoji: {
    fontSize: 20,
  },
  modalOptionText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#6B7280",
  },
  activeModalOptionText: {
    color: "#92400E",
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#92400E",
    justifyContent: "center",
    alignItems: "center",
  },
  checkmarkText: {
    color: "#FEF3C7",
    fontSize: 14,
    fontWeight: "900",
  },
  closeModalBtn: {
    marginTop: 8,
    paddingVertical: 16,
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
  },
  closeModalText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#6B7280",
  },
});

export default DonationScreen;