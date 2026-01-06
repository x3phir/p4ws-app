import React, { useRef } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

// Import Components
import CampaignCard from "@/components/ui/CampaignCard";
import Header from "@/components/ui/Header";
import MapPreview from "@/components/ui/MapPreview";
import ScreenWrapper from "@/components/ui/ScreenWrapper";
import ShelterItem from "@/components/ui/ShelterItem";

const { height } = Dimensions.get("window");

const ExploreScreen = () => {
  const INITIAL_POSITION = height / 2.5;
  const pan = useRef(new Animated.Value(INITIAL_POSITION)).current;
  const lastOffset = useRef(INITIAL_POSITION);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dy) > 5,

      onPanResponderGrant: () => {
        pan.setOffset(lastOffset.current);
        pan.setValue(0);
      },

      onPanResponderMove: Animated.event([null, { dy: pan }], {
        useNativeDriver: false,
      }),

      onPanResponderRelease: (_, gestureState) => {
        lastOffset.current += gestureState.dy;

        // BATAS BAWAH: Jangan sampai lewat dari posisi tengah awal
        if (lastOffset.current > INITIAL_POSITION) {
          lastOffset.current = INITIAL_POSITION;
          Animated.spring(pan, {
            toValue: INITIAL_POSITION,
            useNativeDriver: false,
          }).start();
        }

        // BATAS ATAS: Berhenti tepat di bawah Header
        if (lastOffset.current < 0) {
          lastOffset.current = 0;
          Animated.spring(pan, { toValue: 0, useNativeDriver: false }).start();
        }

        pan.flattenOffset();
      },
    })
  ).current;

  return (
    <ScreenWrapper backgroundImage={require("@/assets/images/BG-1.png")}>
      <Header name="Rex ID" />

      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.mainCard,
          {
            transform: [{ translateY: pan }],
            height: height,
          },
        ]}
      >
        <View style={styles.handleBar} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          // Agar scrollview tidak mematikan fungsi tarik kartu saat di atas
          nestedScrollEnabled={true}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Laporan Terdekat</Text>
            <View style={styles.mapContainer}>
              <MapPreview />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Campaign Donasi Mendesak</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalPadding}
            >
              <CampaignCard
                id="1" // ID untuk navigasi ke /donation/1
                title="Pakan kucing"
                shelter="Paw Care"
                collected="Rp 125.000"
                daysLeft={30}
                progress={0.4}
                imageUri="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba"
              />
              <CampaignCard
                id="2" // ID untuk navigasi ke /donation/2
                title="Obat-obatan"
                shelter="Paw Care"
                collected="Rp 250.000"
                daysLeft={12}
                progress={0.7}
                imageUri="https://images.unsplash.com/photo-1573865668131-974279df4045"
              />
            </ScrollView>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Shelter Kami</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalPadding}
            >
              <ShelterItem
                name="Paw Care"
                imageUri="https://images.unsplash.com/photo-1543852786-1cf6624b9987"
              />
              <ShelterItem
                name="Kitten Home"
                imageUri="https://images.unsplash.com/photo-1573865668131-974279df4045"
              />
            </ScrollView>
          </View>
        </ScrollView>
      </Animated.View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  mainCard: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 220,
    backgroundColor: "#F5EFE6",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 15,
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  handleBar: {
    width: 45,
    height: 6,
    backgroundColor: "#D1D5DB",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 15,
  },
  scrollContent: {
    paddingBottom: 450, // Tambah padding agar konten paling bawah tidak tertutup
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a1a1a",
    paddingHorizontal: 24,
    marginBottom: 15,
  },
  mapContainer: {
    marginHorizontal: 24,
    height: 180,
    borderRadius: 30,
    overflow: "hidden",
  },
  horizontalPadding: {
    paddingHorizontal: 24,
    gap: 12,
  },
});

export default ExploreScreen;
