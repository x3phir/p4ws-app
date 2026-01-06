import { getAllCampaigns } from "@/services/campaignService";
import { getAllReports } from "@/services/reportService";
import { getAllShelters } from "@/services/shelterService";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

// Import Components
import CampaignCard from "@/components/ui/CampaignCard";
import Header from "@/components/ui/Header";
import ScreenWrapper from "@/components/ui/ScreenWrapper";
import ShelterItem from "@/components/ui/ShelterItem";

const { height } = Dimensions.get("window");

const ExploreScreen = () => {
  const INITIAL_POSITION = height / 2.5;
  const pan = useRef(new Animated.Value(INITIAL_POSITION)).current;
  const lastOffset = useRef(INITIAL_POSITION);

  const [reports, setReports] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [shelters, setShelters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [reportsData, campaignsData, sheltersData] = await Promise.all([
        getAllReports(),
        getAllCampaigns(),
        getAllShelters()
      ]);
      setReports(reportsData.slice(0, 3)); // Top 3
      setCampaigns(campaignsData.slice(0, 3)); // Top 3
      setShelters(sheltersData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

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

  // Render report card (simplified for horizontally scroll)
  const renderReportCard = (report: any) => (
    <View key={report.id} style={{ width: 150, marginRight: 15 }}>
      <View style={{ height: 100, borderRadius: 15, overflow: 'hidden', backgroundColor: '#ddd' }}>
        <Image source={{ uri: report.imageUrl }} style={{ width: '100%', height: '100%' }} />
      </View>
      <Text style={{ fontWeight: 'bold', marginTop: 8, fontSize: 14 }} numberOfLines={1}>
        {report.condition} - {report.location.split(',')[0]}
      </Text>
      <Text style={{ fontSize: 12, color: '#666' }}>{report.status}</Text>
    </View>
  );

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
          {/* REPLACE MAP WITH RECENT REPORTS */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Laporan Terbaru</Text>
            {loading ? (
              <ActivityIndicator color="#AEE637" />
            ) : reports.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalPadding}
              >
                {reports.map(renderReportCard)}
              </ScrollView>
            ) : (
              <Text style={{ marginHorizontal: 24, color: '#666' }}>Belum ada laporan.</Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Campaign Donasi Mendesak</Text>
            {loading ? (
              <ActivityIndicator color="#AEE637" />
            ) : campaigns.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalPadding}
              >
                {campaigns.map(c => (
                  <CampaignCard
                    key={c.id}
                    id={c.id}
                    title={c.title}
                    shelter={c.shelter?.name || "Shelter"}
                    collected={`Rp ${c.currentAmount.toLocaleString()}`}
                    daysLeft={30}
                    progress={Math.min(c.currentAmount / c.targetAmount, 1)}
                    imageUri={c.imageUrl}
                  />
                ))}
              </ScrollView>
            ) : (
              <Text style={{ marginHorizontal: 24, color: '#666' }}>Belum ada donasi.</Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Shelter Kami</Text>
            {loading ? (
              <ActivityIndicator color="#AEE637" />
            ) : shelters.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalPadding}
              >
                {shelters.map(s => (
                  <ShelterItem
                    key={s.id}
                    name={s.name}
                    imageUri={s.imageUrl}
                  />
                ))}
              </ScrollView>
            ) : (
              <Text style={{ marginHorizontal: 24, color: '#666' }}>Belum ada shelter.</Text>
            )}
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
  horizontalPadding: {
    paddingHorizontal: 24,
    gap: 12,
  },
});

export default ExploreScreen;
