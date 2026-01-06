import HealthCard from "@/components/ui/HealthCard";
import InfoSection from "@/components/ui/InfoSection";
import PetDetailHeader from "@/components/ui/PetDetailHeader";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

const ALL_PETS = [
  {
    id: "molly-101",
    name: "Molly",
    description: "Si Kecil Aktif",
    about:
      "Molly adalah kucing betina yang penuh kasih sayang dan anggun. Ia sangat suka bermain bola bulu di pagi hari.",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba",
    vaccine: "Lengkap",
    steril: "Sudah",
    lat: -6.9175,
    lng: 107.6191,
  },
  {
    id: "luna-102",
    name: "Luna",
    description: "Pendiam & Manis",
    about:
      "Luna kucing yang tenang. Cocok untuk pemilik yang suka suasana rumah yang damai.",
    image: "https://images.unsplash.com/photo-1513245533132-aa7f8176b202",
    vaccine: "Tahap 1",
    steril: "Belum",
    lat: -6.9034,
    lng: 107.6433,
  },
];

const PetProfileScreen = () => {
  const { id } = useLocalSearchParams();
  const pet = ALL_PETS.find((item) => String(item.id) === String(id));

  // Fungsi untuk membuka aplikasi Maps Luar
  const openExternalMap = () => {
    if (pet) {
      const scheme = Platform.select({
        ios: "maps:0,0?q=",
        android: "geo:0,0?q=",
      });
      const latLng = `${pet.lat},${pet.lng}`;
      const label = `Shelter ${pet.name}`;
      const url = Platform.select({
        ios: `${scheme}${label}@${latLng}`,
        android: `${scheme}${latLng}(${label})`,
      });

      if (url) Linking.openURL(url);
    }
  };

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
          imageUri={pet.image}
        />

        <View style={styles.body}>
          <InfoSection title={`Tentang ${pet.name}`} content={pet.about} />

          <InfoSection title="Riwayat Kesehatan">
            <View style={styles.healthRow}>
              <HealthCard type="vaccine" status={pet.vaccine} />
              <HealthCard type="steril" status={pet.steril} />
            </View>
          </InfoSection>

          {/* Bagian Peta yang bisa diklik */}
          <InfoSection title="Lokasi Shelter">
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={openExternalMap}
              style={[styles.mapPlaceholder, { overflow: "hidden" }]}
            >
              <MapView
                style={{ flex: 1 }}
                region={{
                  latitude: pet.lat,
                  longitude: pet.lng,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
                pitchEnabled={false}
                rotateEnabled={false}
                pointerEvents="none" // Agar sentuhan diteruskan ke TouchableOpacity
              >
                <Marker
                  coordinate={{ latitude: pet.lat, longitude: pet.lng }}
                  title={`Shelter ${pet.name}`}
                />
              </MapView>

              {/* Petunjuk Visual */}
              <View style={styles.mapHint}>
                <Text style={styles.mapHintText}>Klik untuk Petunjuk Arah</Text>
              </View>
            </TouchableOpacity>
          </InfoSection>
        </View>
      </ScrollView>

      <View style={styles.fixedFooter}>
        <TouchableOpacity style={styles.adoptButton} activeOpacity={0.8}>
          <Text style={styles.adoptText}>Adopsi {pet.name} Sekarang</Text>
        </TouchableOpacity>
      </View>
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
  mapPlaceholder: {
    height: 180,
    backgroundColor: "#E5E7EB",
    borderRadius: 35,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  mapHint: {
    position: "absolute",
    bottom: 12,
    alignSelf: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  mapHintText: { fontSize: 10, fontWeight: "700", color: "#1EB00E" },
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
