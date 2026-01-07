import { getAllCampaigns } from "@/services/campaignService";
import { getAllReports } from "@/services/reportService";
import { getAllShelters } from "@/services/shelterService";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
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
  const CARD_HEIGHT = height - 100;
  const COLLAPSED_POSITION = height - 230;
  const EXPANDED_POSITION = 190;

  const pan = useRef(new Animated.Value(COLLAPSED_POSITION)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  const [isExpanded, setIsExpanded] = useState(false);

  // Individual fade animations for stats
  const statsFadeAnims = useRef(
    [0, 1, 2, 3].map(() => new Animated.Value(0))
  ).current;

  const [reports, setReports] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [shelters, setShelters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Dynamic statistics
  const [stats, setStats] = useState([
    { label: "Kucing Diselamatkan", value: "0", icon: <Cat size={20} color={Colors.primary} />, color: "#E8F5E9" },
    { label: "Total Donasi", value: "Rp 0", icon: <Heart size={20} color="#FF6B6B" />, color: "#FFF5F5" },
    { label: "Shelter Partner", value: "0", icon: <Home size={20} color="#4DABF7" />, color: "#F0F7FF" },
    { label: "Relawan Aktif", value: "0", icon: <Users size={20} color="#FAB005" />, color: "#FFF9DB" },
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Animate stats cards in sequence
    if (!loading && stats[0].value !== "0") {
      Animated.stagger(
        100,
        statsFadeAnims.map((anim) =>
          Animated.spring(anim, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          })
        )
      ).start();
    }
  }, [loading, stats]);

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

      // Calculate dynamic statistics
      const totalCats = reportsData.filter((r: any) => r.status === 'resolved').length;
      const totalDonations = campaignsData.reduce((sum: number, c: any) => sum + (c.currentAmount || 0), 0);
      const totalShelters = sheltersData.length;
      const totalVolunteers = sheltersData.reduce((sum: number, s: any) => sum + (s.volunteers || 0), 0) || 350;

      setStats([
        {
          label: "Kucing Diselamatkan",
          value: totalCats.toString(),
          icon: <Cat size={20} color={Colors.primary} />,
          color: "#E8F5E9"
        },
        {
          label: "Total Donasi",
          value: `Rp ${formatCurrency(totalDonations)}`,
          icon: <Heart size={20} color="#FF6B6B" />,
          color: "#FFF5F5"
        },
        {
          label: "Shelter Partner",
          value: totalShelters.toString(),
          icon: <Home size={20} color="#4DABF7" />,
          color: "#F0F7FF"
        },
        {
          label: "Relawan Aktif",
          value: totalVolunteers.toString(),
          icon: <Users size={20} color="#FAB005" />,
          color: "#FFF9DB"
        },
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}jt`;
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}rb`;
    }
    return amount.toLocaleString();
  };

  const toggleCard = () => {
    const toValue = isExpanded ? COLLAPSED_POSITION : EXPANDED_POSITION;
    Animated.spring(pan, {
      toValue,
      tension: 40,
      friction: 8,
      useNativeDriver: false,
    }).start();
    setIsExpanded(!isExpanded);
  };

  // Interpolate opacity for header elements based on scroll
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  return (
    <ScreenWrapper backgroundColor={Colors.primary}>
      <Header name="Rex ID" />

      <Animated.View
        style={[
          styles.mainCard,
          {
            transform: [{ translateY: pan }],
            height: CARD_HEIGHT,
          },
        ]}
      >
        <TouchableOpacity
          onPress={toggleCard}
          style={styles.handleContainer}
          activeOpacity={0.8}
        >
          <View style={styles.handleBar} />
        </TouchableOpacity>

        <Animated.ScrollView
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          bounces={true}
          decelerationRate="normal"
        >
          {/* STATISTICS SECTION */}
          <Animated.View style={[styles.section, { opacity: headerOpacity }]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Statistik Aplikasi</Text>
            </View>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color={Colors.primary} size="large" />
              </View>
            ) : (
              <View style={styles.statsGrid}>
                {stats.map((item, index) => (
                  <Animated.View
                    key={index}
                    style={[
                      styles.statsCard,
                      {
                        backgroundColor: item.color,
                        opacity: statsFadeAnims[index],
                        transform: [
                          {
                            translateY: statsFadeAnims[index].interpolate({
                              inputRange: [0, 1],
                              outputRange: [20, 0],
                            }),
                          },
                          {
                            scale: statsFadeAnims[index].interpolate({
                              inputRange: [0, 1],
                              outputRange: [0.9, 1],
                            }),
                          },
                        ],
                      },
                    ]}
                  >
                    <View style={styles.statsIcon}>{item.icon}</View>
                    <Text style={styles.statsValue}>{item.value}</Text>
                    <Text style={styles.statsLabel}>{item.label}</Text>
                  </Animated.View>
                ))}
              </View>
            )}
          </Animated.View>

          {/* CAMPAIGNS SECTION */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Donasi Mendesak</Text>
              <Text style={styles.seeAll}>Bantu Sekarang</Text>
            </View>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color={Colors.primary} />
              </View>
            ) : campaigns.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalPadding}
                decelerationRate="fast"
                snapToInterval={width * 0.8}
                snapToAlignment="start"
              >
                {campaigns.map(c => (
                  <CampaignCard
                    key={c.id}
                    id={c.id}
                    title={c.title}
                    shelter={c.shelter?.name || "Shelter"}
                    collected={`Rp ${c.currentAmount.toLocaleString()}`}
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
              <View style={styles.loadingContainer}>
                <ActivityIndicator color={Colors.primary} />
              </View>
            ) : shelters.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalPadding}
                decelerationRate="fast"
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
        </Animated.ScrollView>
      </Animated.View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  mainCard: {
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 15,
  },
  handleContainer: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  handleBar: {
    width: 45,
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1a1a1a",
    letterSpacing: -0.5,
  },
  seeAll: {
    fontSize: 14,
    color: Colors.primary,
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
    padding: 18,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statsIcon: {
    marginBottom: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  statsValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 4,
  },
  statsLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
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
    textAlign: 'center',
    paddingVertical: 20,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ExploreScreen;