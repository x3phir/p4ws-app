import AdoptionModal from "@/components/ui/AdoptionModal";
import HealthCard from "@/components/ui/HealthCard";
import InfoSection from "@/components/ui/InfoSection";
import PetDetailHeader from "@/components/ui/PetDetailHeader";
import { createAdoptionRequest } from "@/services/adoptionService";
import { getPetById, Pet } from "@/services/petService";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const PetProfileScreen = () => {
  const { id } = useLocalSearchParams();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch Pet Detail
  useEffect(() => {
    const fetchPet = async () => {
      if (id) {
        setLoading(true);
        const data = await getPetById(String(id));
        setPet(data);
        setLoading(false);
      }
    };
    fetchPet();
  }, [id]);

  const handleAdoptionSubmit = async (data: any) => {
    if (!pet) return;
    try {
      setSubmitting(true);
      await createAdoptionRequest({
        petId: pet.id,
        ...data,
      });
      alert("Pengajuan adopsi berhasil! Silakan cek status di menu Profil.");
      setModalVisible(false);
      // Optional: Navigate to profile
      // router.push("/profile");
    } catch (error: any) {
      alert("Gagal mengajukan adopsi: " + (error?.response?.data?.error || "Terjadi kesalahan"));
    } finally {
      setSubmitting(false);
    }
  };

  // Fungsi untuk membuka aplikasi Maps Luar
  const openExternalMap = () => {
    if (pet?.shelter?.address) {
      const scheme = Platform.select({
        ios: "maps:0,0?q=",
        android: "geo:0,0?q=",
      });
      const label = `Shelter ${pet.shelter.name}`;
      const query = encodeURIComponent(`${pet.shelter.address}`);
      const url = Platform.select({
        ios: `${scheme}${label}@${query}`,
        android: `${scheme}${query}(${label})`,
      });
      const simpleUrl = Platform.select({
        ios: `http://maps.apple.com/?q=${query}`,
        android: `geo:0,0?q=${query}`
      });

      if (simpleUrl) Linking.openURL(simpleUrl);
    } else {
      alert("Alamat shelter tidak tersedia.");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1EB00E" />
      </View>
    );
  }

  if (!pet) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Pet ID "{id}" tidak ditemukan</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        <PetDetailHeader
          name={pet.name}
          description={pet.description}
          imageUri={pet.imageUrl}
        />

        <View style={styles.body}>
          <InfoSection title={`Tentang ${pet.name}`} content={pet.about} />

          <InfoSection title="Riwayat Kesehatan">
            <View style={styles.healthRow}>
              <HealthCard type="vaccine" status={pet.vaccine || "Unknown"} />
              <HealthCard type="steril" status={pet.steril || "Unknown"} />
            </View>
          </InfoSection>

          {/* Bagian Lokasi Shelter */}
          {pet.shelter && (
            <InfoSection title="Lokasi Shelter">
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={openExternalMap}
                style={styles.locationCard}
              >
                <View style={styles.locationIconContainer}>
                  <Text style={styles.locationIcon}>📍</Text>
                </View>
                <View style={styles.locationInfo}>
                  <Text style={styles.locationTitle}>Shelter {pet.shelter.name}</Text>
                  <Text style={styles.locationCoords}>
                    {pet.shelter.address}
                  </Text>
                  <Text style={styles.locationHint}>
                    Ketuk untuk buka di Maps →
                  </Text>
                </View>
              </TouchableOpacity>
            </InfoSection>
          )}
        </View>
      </ScrollView>

      <View style={styles.fixedFooter}>
        <TouchableOpacity
          style={styles.adoptButton}
          activeOpacity={0.8}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.adoptText}>Adopsi {pet.name} Sekarang</Text>
        </TouchableOpacity>
      </View>

      <AdoptionModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleAdoptionSubmit}
        petName={pet.name}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#F5EFE6" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5EFE6",
  },
  errorText: { fontSize: 18, fontWeight: "bold", color: "#1A1A1A" },
  scrollView: { flex: 1 },
  body: { backgroundColor: "#F5EFE6", marginTop: -2, paddingBottom: 40 },
  healthRow: { flexDirection: "row", gap: 12, marginTop: 8 },
  locationCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  locationIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  locationIcon: {
    fontSize: 24,
  },
  locationInfo: {
    flex: 1,
    justifyContent: "center",
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  locationCoords: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  locationHint: {
    fontSize: 11,
    color: "#1EB00E",
    fontWeight: "600",
  },
  fixedFooter: {
    backgroundColor: "#F5EFE6",
    paddingHorizontal: 24,
    paddingTop: 15,
    paddingBottom: Platform.OS === "ios" ? 110 : 100,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  adoptButton: {
    backgroundColor: "#1EB00E",
    height: 60,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#1EB00E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  adoptText: { color: "white", fontSize: 18, fontWeight: "900" },
});

export default PetProfileScreen;
