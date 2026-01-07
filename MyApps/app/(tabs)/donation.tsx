
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import CampaignCard from "@/components/ui/CampaignCard";
import DonationListCard from "@/components/ui/DonationListCard";
import FilterBar from "@/components/ui/FilterBar";
import UrgentBadge from "@/components/ui/UrgentBadge";
import { Campaign, getAllCampaigns } from "@/services/campaignService";

const { width, height } = Dimensions.get("window");

const DonationScreen = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("Terbaru"); // Terbaru, Target, Progress
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
      // Default: Terbaru
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  // Divide into Urgent and Others based on backend flag
  const urgentCampaigns = filteredAndSortedCampaigns.filter(c => c.isUrgent);
  const otherCampaigns = filteredAndSortedCampaigns.filter(c => !c.isUrgent);

  // Helper to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

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
          <View style={{ marginTop: 50 }}>
            <ActivityIndicator size="large" color="#B5E661" />
          </View>
        ) : (
          <>
            {/* --- HORIZONTAL SECTION (URGENT) --- */}
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

            {/* --- VERTICAL LIST SECTION --- */}
            <View style={styles.listSection}>
              <Text style={[styles.sectionTitle, { paddingHorizontal: 24 }]}>
                Program Lainnya
              </Text>

              <FilterBar
                onSortPress={() => setIsSortModalVisible(true)}
                onFilterPress={() => alert("Filter functionality coming soon!")}
              />

              <View style={styles.listContainer}>
                {otherCampaigns.length > 0 ? (
                  otherCampaigns.map((campaign) => (
                    <DonationListCard
                      key={campaign.id}
                      id={campaign.id}
                      title={campaign.title}
                      community={campaign.shelter?.name || "Komunitas"}
                      collected={formatCurrency(campaign.currentAmount)}
                      progress={Math.min(campaign.currentAmount / campaign.targetAmount, 1)}
                      imageUri={campaign.imageUrl}
                    />
                  ))
                ) : (
                  urgentCampaigns.length === 0 && (
                    <Text style={{ textAlign: "center", marginTop: 20, color: "#666" }}>
                      Belum ada campaign lainnya.
                    </Text>
                  )
                )}
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* Sort Modal */}
      {isSortModalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Urutkan Donasi</Text>
            {["Terbaru", "Target", "Progress"].map(option => (
              <TouchableOpacity
                key={option}
                style={styles.modalOption}
                onPress={() => {
                  setSortOption(option);
                  setIsSortModalVisible(false);
                }}
              >
                <Text style={[styles.modalOptionText, sortOption === option && styles.activeModalOptionText]}>{option}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.closeModalBtn}
              onPress={() => setIsSortModalVisible(false)}
            >
              <Text style={styles.closeModalText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#4B5563',
  },
  activeModalOptionText: {
    color: '#B5E661',
    fontWeight: 'bold',
  },
  closeModalBtn: {
    marginTop: 16,
    paddingVertical: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    alignItems: 'center',
  },
  closeModalText: {
    color: '#4B5563',
    fontWeight: '600',
  },
});

export default DonationScreen;
