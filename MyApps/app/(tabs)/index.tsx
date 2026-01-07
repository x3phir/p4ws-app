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
import { Colors } from "@/constants/theme";
import { Cat, Heart, Home, Users } from "lucide-react-native";

// Import Components
import CampaignCard from "@/components/ui/CampaignCard";
import Header from "@/components/ui/Header";
import ScreenWrapper from "@/components/ui/ScreenWrapper";
import ShelterItem from "@/components/ui/ShelterItem";

const { height, width } = Dimensions.get("window");

const ExploreScreen = () => {
  const INITIAL_POSITION = height / 2.8;
  const pan = useRef(new Animated.Value(INITIAL_POSITION)).current;
  const lastOffset = useRef(INITIAL_POSITION);

  // Animation values - useNativeDriver: false for all to avoid conflict with pan
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const [reports, setReports] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [shelters, setShelters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Statistics data (Mocked for now)
  const stats = [
    { label: "Kucing Diselamatkan", value: "128", icon: <Cat size={20} color={Colors.primary} />, color: "#E8F5E9" },
    { label: "Total Donasi", value: "Rps 45jt+", icon: <Heart size={20} color="#FF6B6B" />, color: "#FFF5F5" },
    { label: "Shelter Partner", value: "12", icon: <Home size={20} color="#4DABF7" />, color: "#F0F7FF" },
    { label: "Relawan Aktif", value: "350", icon: <Users size={20} color="#FAB005" />, color: "#FFF9DB" },
  ];

  useEffect(() => {
    fetchData();
    // Start entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: false, // Unified to false to avoid error
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: false, // Unified to false
      })
    ]).start();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [reportsData, campaignsData, sheltersData] = await Promise.all([
        getAllReports(),
        getAllCampaigns(),
        getAllShelters()
      ]);
      setReports(reportsData);
      setCampaigns(campaignsData.slice(0, 5));
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

        if (lastOffset.current > INITIAL_POSITION) {
          lastOffset.current = INITIAL_POSITION;
          Animated.spring(pan, {
            toValue: INITIAL_POSITION,
            useNativeDriver: false,
          }).start();
        }

        if (lastOffset.current < 0) {
          lastOffset.current = 0;
          Animated.spring(pan, { toValue: 0, useNativeDriver: false }).start();
        }

        pan.flattenOffset();
      },
    })
  ).current;

  return (
    <ScreenWrapper backgroundColor={Colors.primary}>
      <Header name="Rex ID" />

      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.mainCard,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: pan },
              { translateY: slideAnim }
            ],
            height: height,
          },
        ]}
      >
        <View style={styles.handleBar} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          nestedScrollEnabled={true}
        >
          {/* STATISTICS SECTION */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Statistik Aplikasi</Text>
            </View>
            <View style={styles.statsGrid}>
              {stats.map((item, index) => (
                <View key={index} style={[styles.statsCard, { backgroundColor: item.color }]}>
                  <View style={styles.statsIcon}>{item.icon}</View>
                  <Text style={styles.statsValue}>{item.value}</Text>
                  <Text style={styles.statsLabel}>{item.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* CAMPAIGNS SECTION */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Donasi Mendesak</Text>
              <Text style={styles.seeAll}>Bantu Sekarang</Text>
            </View>
            {loading ? (
              <ActivityIndicator color={Colors.primary} />
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
              <Text style={styles.emptyText}>Belum ada donasi aktif.</Text>
            )}
          </View>

          {/* SHELTER SECTION */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Shelter Partner</Text>
            </View>
            {loading ? (
              <ActivityIndicator color={Colors.primary} />
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
              <Text style={styles.emptyText}>Belum ada shelter partner.</Text>
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
    top: 150, // Slightly higher
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingTop: 15,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  handleBar: {
    width: 40,
    height: 5,
    backgroundColor: "#F3F4F6", // Lighter gray
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 20,
  },
  scrollContent: {
    paddingBottom: 350,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1a1a1a",
    letterSpacing: -0.5,
  },
  seeAll: {
    fontSize: 14,
    color: '#34D399',
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    gap: 12,
  },
  statsCard: {
    width: (width - 52) / 2,
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsIcon: {
    marginBottom: 8,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 12,
  },
  statsValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  statsLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
    textAlign: 'center',
  },
  horizontalPadding: {
    paddingHorizontal: 24,
    gap: 16,
  },
  emptyText: {
    marginHorizontal: 24,
    color: '#9CA3AF',
    fontSize: 14,
    fontStyle: 'italic',
  }
});

export default ExploreScreen;
