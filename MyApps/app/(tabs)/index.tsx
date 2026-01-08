import { getAllCampaigns } from "@/services/campaignService";
import { getAllReports } from "@/services/reportService";
import { getAllShelters } from "@/services/shelterService";
import { getAllPets, Pet } from "@/services/petService";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { Colors } from "@/constants/theme";
import { Cat, Heart, Home, Users, Search, PawPrint } from "lucide-react-native";
import { getImageUrl } from "@/utils/urlHelper";

// Import Components
import CampaignCard from "@/components/ui/CampaignCard";
import Header from "@/components/ui/Header";
import ScreenWrapper from "@/components/ui/ScreenWrapper";
import ShelterItem from "@/components/ui/ShelterItem";

const { height, width } = Dimensions.get("window");

const ExploreScreen = () => {
  const router = useRouter();
  const CARD_HEIGHT = height - 130;
  const COLLAPSED_POSITION = height - 570;
  const EXPANDED_POSITION = 170;

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
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  // Dynamic statistics
  const [stats, setStats] = useState([
    { label: "Kucing Diselamatkan", value: "0", icon: <Cat size={20} color={Colors.primary} />, color: "#E8F5E9" },
    { label: "Donasi Terkumpul", value: "Rp 0", icon: <Heart size={20} color="#FF6B6B" />, color: "#FFF5F5" },
    { label: "Shelter Partner", value: "0", icon: <Home size={20} color="#4DABF7" />, color: "#F0F7FF" },
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Animate stats cards in sequence
    if (!loading) {
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
      const [reportsData, campaignsData, sheltersData, petsData] = await Promise.all([
        getAllReports(),
        getAllCampaigns(),
        getAllShelters(),
        getAllPets({ status: 'AVAILABLE' })
      ]);

      setReports(reportsData);
      setCampaigns(campaignsData.slice(0, 5));
      setShelters(sheltersData);
      setPets(petsData.slice(0, 5));

      // Calculate dynamic statistics
      const totalCats = reportsData.filter((r: any) =>
        r.status === 'COMPLETED' || r.status === 'resolved'
      ).length;
      const totalDonations = campaignsData.reduce((sum: number, c: any) => sum + (c.currentAmount || 0), 0);
      const totalShelters = sheltersData.length;

      setStats([
        {
          label: "Kucing Diselamatkan",
          value: totalCats.toString(),
          icon: <Cat size={20} color={Colors.primary} />,
          color: "#E8F5E9"
        },
        {
          label: "Donasi Terkumpul",
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
    <ScreenWrapper backgroundImage={"https://res.cloudinary.com/dm9xspnbe/image/upload/v1767842412/iPhone_16_-_1_w6bic9.jpg"}>
      <Header name="Rex ID" />
      {/* Background decoration - Simplified */}
      <View style={styles.headerDecoration} pointerEvents="none">
        <PawPrint size={100} color="rgba(255,255,255,0.1)" style={{ position: 'absolute', top: 20, right: -20, transform: [{ rotate: '15deg' }] }} />
        <View style={styles.bubble1} />
      </View>

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
          {/* PET CAROUSEL SECTION (NEW) */}
          <View style={styles.carouselContainer}>
            <View style={styles.carouselHeader}>
              <View>
                <Text style={styles.carouselTitle}>Kucing Gemas Menunggumu</Text>
                <Text style={styles.carouselSubtitle}>Siap diadopsi & cari rumah baru 🏠</Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/adopt' as any)}>
                <Text style={styles.seeAll}>Semua</Text>
              </TouchableOpacity>
            </View>

            {loading ? (
              <View style={[styles.loadingContainer, { height: 180 }]}>
                <ActivityIndicator color={Colors.primary} />
              </View>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalPadding}
                decelerationRate="fast"
                snapToInterval={width * 0.7 + 16}
                snapToAlignment="start"
              >
                {pets.map(pet => (
                  <TouchableOpacity
                    key={pet.id}
                    style={styles.petSlide}
                    activeOpacity={0.9}
                    onPress={() => router.push(`/adopt/${pet.id}` as any)}
                  >
                    <Image
                      source={{ uri: getImageUrl(pet.imageUrl) }}
                      style={styles.petSlideImage}
                    />
                    <View style={styles.petSlideInfo}>
                      <Text style={styles.petSlideName}>{pet.name}</Text>
                      <View style={styles.petSlideTag}>
                        <Text style={styles.petSlideTagText}>{pet.gender}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          {/* QUICK ACTIONS MOVED INSIDE CARD */}
          <View style={styles.cardActions}>
            <TouchableOpacity style={styles.actionBox} onPress={() => router.push('/lapor' as any)}>
              <View style={[styles.actionIconBg, { backgroundColor: '#E8F5E9' }]}>
                <Search size={24} color="#2E7D32" />
              </View>
              <Text style={styles.actionBoxText}>Lapor</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBox} onPress={() => router.push('/adopt' as any)}>
              <View style={[styles.actionIconBg, { backgroundColor: '#F3E5F5' }]}>
                <Cat size={24} color="#7B1FA2" />
              </View>
              <Text style={styles.actionBoxText}>Adopsi</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBox} onPress={() => router.push('/donation' as any)}>
              <View style={[styles.actionIconBg, { backgroundColor: '#FFF3E0' }]}>
                <Heart size={24} color="#E65100" />
              </View>
              <Text style={styles.actionBoxText}>Donasi</Text>
            </TouchableOpacity>
          </View>

          {/* STATISTICS SECTION */}
          <Animated.View style={styles.section}>
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
                    imageUri={getImageUrl(c.imageUrl)}
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
                    imageUri={getImageUrl(s.imageUrl)}
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
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    gap: 10,
  },
  statsCard: {
    flex: 1, // Menggunakan flex agar ukuran tiap kartu otomatis menyesuaikan lebar layar
    minHeight: 110,
    paddingVertical: 14,
    paddingHorizontal: 8,
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 4,
    textAlign: 'center',
  },
  statsLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
    textAlign: 'center',
    fontWeight: '500',
  },
  horizontalPadding: {
    paddingHorizontal: 24,
    gap: 16,
  },
  carouselContainer: {
    paddingBottom: 20,
  },
  carouselHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  carouselTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  carouselSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  petSlide: {
    width: width * 0.7,
    marginRight: 16,
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  petSlideImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  petSlideInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: 'rgba(255,255,255,0.9)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  petSlideName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  petSlideTag: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  petSlideTagText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 28,
  },
  actionBox: {
    alignItems: 'center',
    width: (width - 72) / 3,
  },
  actionIconBg: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  actionBoxText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerDecoration: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    zIndex: 0,
  },
  paw1: {
    position: 'absolute',
    top: 80,
    right: -20,
    transform: [{ rotate: '25deg' }],
  },
  paw2: {
    position: 'absolute',
    top: 150,
    left: 10,
    transform: [{ rotate: '-15deg' }],
  },
  paw3: {
    position: 'absolute',
    top: 120,
    right: 80,
    transform: [{ rotate: '45deg' }],
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
  heroTextContainer: {
    paddingHorizontal: 24,
    marginTop: 0,
    marginBottom: 20,
    zIndex: 1,
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#1a1a1a',
    letterSpacing: -1,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(0,0,0,0.6)',
    marginTop: 4,
    fontWeight: '500',
    maxWidth: '80%',
  },
  searchBarMock: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  searchPlaceholder: {
    marginLeft: 10,
    color: 'rgba(0,0,0,0.4)',
    fontWeight: '500',
    fontSize: 14,
  },
  quickActions: {
    flexDirection: 'row',
    marginTop: 15,
    gap: 10,
  },
  actionChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
  },
  actionChipText: {
    color: '#AEE637',
    fontWeight: 'bold',
    fontSize: 13,
  },
});

export default ExploreScreen;