import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

import CategoryTabs from "@/components/ui/CategoryTabs";
import PetCard from "@/components/ui/PetCard";
import SearchHeader from "@/components/ui/SearchBar";
import { getAllPets, Pet } from "@/services/petService";

const AdoptionScreen = () => {
  const router = useRouter();
  const [currentLocation, setCurrentLocation] = useState("Mencari lokasi...");
  const [searchQuery, setSearchQuery] = useState("");
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Logic GPS Real-time (keeping this for address display only, not filtering)
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

  // Filter logic (simple client-side filtering for now)
  const filteredPets = pets.filter(pet =>
    pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pet.breed?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pet.shelter?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#AEE637" />
            </View>
          ) : filteredPets.length > 0 ? (
            filteredPets.map((pet) => (
              <PetCard
                key={pet.id}
                name={pet.name}
                breed={pet.breed || "Unknown"}
                location={pet.shelter?.address.split(',')[0] || "Shelter"} // Show shelter city/address
                imageUri={pet.imageUrl}
                onPress={() => router.push(`/adopt/${pet.id}` as any)}
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text>Tidak ada kucing ditemukan.</Text>
            </View>
          )}
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
  loadingContainer: {
    flex: 1,
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  emptyContainer: {
    flex: 1,
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
});

export default AdoptionScreen;
