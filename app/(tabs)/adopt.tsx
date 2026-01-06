import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import CategoryTabs from "@/components/ui/CategoryTabs";
import PetCard from "@/components/ui/PetCard";
import SearchHeader from "@/components/ui/SearchBar";

const DUMMY_PETS = [
  {
    id: "molly-101",
    name: "Molly",
    breed: "Persia",
    location: "Braga, Bandung",
    imageUri: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba",
  },
  {
    id: "luna-102",
    name: "Luna",
    breed: "Siam",
    location: "Dago, Bandung",
    imageUri: "https://images.unsplash.com/photo-1513245533132-aa7f8176b202",
  },
  {
    id: "kuro-103",
    name: "Kuro",
    breed: "Domestic",
    location: "Lembang, Bandung",
    imageUri: "https://images.unsplash.com/photo-1511044568932-338cba0ad803",
  },
  {
    id: "bobi-104",
    name: "Bobi",
    breed: "Golden",
    location: "Ciumbuleuit, Bandung",
    imageUri: "https://images.unsplash.com/photo-1552053831-71594a27632d",
  },
];

const AdoptionScreen = () => {
  const router = useRouter();
  const [currentLocation, setCurrentLocation] = useState("Mencari lokasi...");
  const [searchQuery, setSearchQuery] = useState("");

  // Logika GPS Real-time
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setCurrentLocation("Izin ditolak");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      let address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (address.length > 0) {
        const city =
          address[0].city || address[0].region || "Lokasi tidak dikenal";
        setCurrentLocation(city);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      {/* 1. Header tetap di paling atas */}
      <SearchHeader
        location={currentLocation}
        onSearchChange={setSearchQuery}
        onFilterPress={() => alert("Filter Modal Terbuka!")}
      />

      {/* 2. Content Wrapper untuk menaikkan Tabs */}
      <View style={styles.contentWrapper}>
        <View style={styles.categoryContainer}>
          <CategoryTabs />
        </View>

        {/* 3. Area Scroll list pet */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {DUMMY_PETS.map((pet) => (
            <PetCard
              key={pet.id}
              name={pet.name}
              breed={pet.breed}
              location={pet.location}
              imageUri={pet.imageUri}
              onPress={() => router.push(`/adopt/${pet.id}` as any)}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5EFE6",
  },
  contentWrapper: {
    flex: 1,
    marginTop: -20, // Menaikkan seluruh area konten agar menyatu dengan SearchHeader
  },
  categoryContainer: {
    paddingVertical: 10,
    zIndex: 10, // Memastikan CategoryTabs berada di atas ScrollView
    backgroundColor: "#F5EFE6", // Memberi warna background agar tidak transparan saat di-scroll
  },
  scrollContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingBottom: 140, // Ruang untuk Navbar hijau di bawah
    paddingTop: 5,
  },
});

export default AdoptionScreen;
