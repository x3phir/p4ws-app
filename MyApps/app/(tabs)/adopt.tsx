import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { Search, SlidersHorizontal } from "lucide-react-native";
import { PawPrint } from "lucide-react-native";

import CategoryTabs from "@/components/ui/CategoryTabs";
import PetCard from "@/components/ui/PetCard";
import { getAllPets, Pet } from "@/services/petService";
import { Colors } from "@/constants/theme";
import ScreenWrapper from "@/components/ui/ScreenWrapper";

const { height } = Dimensions.get("window");

const AdoptionScreen = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeCategory, setActiveCategory] = useState("Semua");
  const [sortOption, setSortOption] = useState("Terbaru"); // Terbaru, Ras, Nama
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);

  // Fetch Pets from API
  useEffect(() => {
    const fetchPets = async () => {
      try {
        setIsLoading(true);
        const data = await getAllPets({ status: 'AVAILABLE' });
        setPets(data);
      } catch (error) {
        console.error("Failed to fetch pets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPets();
  }, []);

  // Filter & Sort logic
  const filteredAndSortedPets = pets
    .filter(pet => {
      // Search Query Filter
      const matchesSearch =
        pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pet.breed?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pet.shelter?.name.toLowerCase().includes(searchQuery.toLowerCase());

      // Category Filter
      let matchesCategory = true;
      if (activeCategory === "Kitten") {
        matchesCategory = !!pet.age?.toLowerCase().includes("bulan");
      } else if (activeCategory === "Dewasa") {
        matchesCategory = !!pet.age?.toLowerCase().includes("tahun");
      }

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortOption === "Nama") {
        return a.name.localeCompare(b.name);
      } else if (sortOption === "Ras") {
        return (a.breed || "").localeCompare(b.breed || "");
      }
      return b.id.localeCompare(a.id);
    });

  return (
    <ScreenWrapper backgroundColor={Colors.primary}>

      <View style={styles.headerDecoration} pointerEvents="none">
        <PawPrint size={100} color="rgba(255,255,255,0.1)" style={{ position: 'absolute', top: 20, right: -20, transform: [{ rotate: '15deg' }] }} />
        <View style={styles.bubble1} />
      </View>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Adopsi Kucing</Text>
      </View>

      <View style={styles.contentCard}>
        <View style={styles.searchBarWrapper}>
          <View style={styles.searchContainer}>
            <Search color="#9CA3AF" size={20} />
            <TextInput
              placeholder="Cari Nama, Ras, atau Gender"
              placeholderTextColor="#9CA3AF"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <View style={styles.categoryContainer}>
          <CategoryTabs onSelect={setActiveCategory} active={activeCategory} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#1A1A1A" />
              <Text style={styles.loadingText}>Memuat data kucing...</Text>
            </View>
          ) : filteredAndSortedPets.length > 0 ? (
            <View style={styles.petsGrid}>
              {filteredAndSortedPets.map((pet) => (
                <PetCard
                  key={pet.id}
                  name={pet.name}
                  breed={pet.breed || "Tanpa Ras"}
                  location={pet.shelter?.address.split(',')[0] || "Shelter"}
                  imageUri={pet.imageUrl}
                  onPress={() => router.push(`/adopt/${pet.id}` as any)}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>😿</Text>
              <Text style={styles.emptyText}>Tidak ada kucing ditemukan.</Text>
              <Text style={styles.emptySubtext}>Coba gunakan kata kunci pencarian yang lain.</Text>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Sort Modal */}
      {isSortModalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Urutkan Berdasarkan</Text>
            <View style={styles.modalOptionsList}>
              {["Terbaru", "Nama", "Ras"].map(option => (
                <TouchableOpacity
                  key={option}
                  style={[styles.modalOption, sortOption === option && styles.activeModalOption]}
                  onPress={() => {
                    setSortOption(option);
                    setIsSortModalVisible(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.modalOptionText, sortOption === option && styles.activeModalOptionText]}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.closeModalBtn}
              onPress={() => setIsSortModalVisible(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.closeModalText}>Batal</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
  contentCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 24,
    minHeight: height - 150,
  },
  searchBarWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 16,
  },
  searchContainer: {
    flex: 1,
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
  headerDecoration: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    zIndex: 0,
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
  bubble2: {
    position: 'absolute',
    bottom: 50,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  filterButton: {
    width: 52,
    height: 52,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryContainer: {
    marginBottom: 8,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  petsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  loadingContainer: {
    flex: 1,
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
  emptyContainer: {
    flex: 1,
    paddingVertical: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyEmoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 32,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#1A1A1A",
    marginBottom: 24,
    textAlign: "center",
  },
  modalOptionsList: {
    gap: 12,
  },
  modalOption: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  activeModalOption: {
    backgroundColor: "#1A1A1A",
    borderColor: "#1A1A1A",
  },
  modalOptionText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#6B7280",
    textAlign: "center",
  },
  activeModalOptionText: {
    color: Colors.primary,
  },
  closeModalBtn: {
    marginTop: 24,
    paddingVertical: 16,
    alignItems: "center",
  },
  closeModalText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#EF4444",
  },
});

export default AdoptionScreen;
