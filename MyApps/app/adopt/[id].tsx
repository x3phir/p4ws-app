import AdoptionModal from "@/components/ui/AdoptionModal";
import HealthCard from "@/components/ui/HealthCard";
import InfoSection from "@/components/ui/InfoSection";
import PetDetailHeader from "@/components/ui/PetDetailHeader";
import { createAdoptionRequest } from "@/services/adoptionService";
import { getPetById, Pet } from "@/services/petService";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
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

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  // Fetch Pet Detail
  useEffect(() => {
    const fetchPet = async () => {
      if (id) {
        setLoading(true);
        const data = await getPetById(String(id));
        setPet(data);
        setLoading(false);

        // Trigger animations when data loads
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
        ]).start();
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
    } catch (error: any) {
      alert("Gagal mengajukan adopsi: " + (error?.response?.data?.error || "Terjadi kesalahan"));
    } finally {
      setSubmitting(false);
    }
  };

  // Button press animation
  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
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
      <Animated.View
        style={{
          flex: 1,
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim }
          ],
        }}
      >
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
          </View>
        </ScrollView>

        <View style={styles.fixedFooter}>
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={styles.adoptButton}
              activeOpacity={0.9}
              onPress={() => setModalVisible(true)}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              <Text style={styles.adoptText}>Adopsi {pet.name} Sekarang</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Animated.View>

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