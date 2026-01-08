// MyApps/app/(tabs)/profile.tsx
import ScreenWrapper from "@/components/ui/ScreenWrapper";
import { Colors } from "@/constants/theme";
import { AdoptionRequest, getMyAdoptions } from "@/services/adoptionService";
import { Donation, getMyDonations } from "@/services/donationService";
import { getUserProfile, updateProfile, UserProfile } from "@/services/userService";
import { CatReport, getMyReports } from "@/services/reportService";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Camera, Shield, ShieldCheck, LogOut, Pencil, Mail, Phone } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useAuth } from "../../context/AuthContext";

const { height } = Dimensions.get("window");

const ProfileScreen = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("adopsi");
  const [adoptions, setAdoptions] = useState<AdoptionRequest[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [reports, setReports] = useState<CatReport[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editForm, setEditForm] = useState<{ name: string, phone: string, email: string, avatarUri?: string }>({
    name: "", phone: "", email: ""
  });
  const { logout, setIsLoggedIn } = useAuth();

  const fetchData = async () => {
    try {
      const [profileData, adoptionsData, donationsData, reportsData] = await Promise.all([
        getUserProfile(),
        getMyAdoptions(),
        getMyDonations(),
        getMyReports()
      ]);
      setProfile(profileData);
      setEditForm({
        name: profileData.name,
        phone: profileData.phone || "",
        email: profileData.email
      });
      setAdoptions(adoptionsData);
      setDonations(donationsData);
      setReports(reportsData);
    } catch (error: any) {
      console.error(error);
      if (error.response?.status === 401) {
        setIsLoggedIn(false);
      } else {
        Alert.alert("Error", "Gagal memuat data profil");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePickAvatar = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && result.assets[0].uri) {
        setEditForm(prev => ({ ...prev, avatarUri: result.assets[0].uri }));
        Alert.alert(
          "Update Foto Profil",
          "Simpan foto ini sebagai foto profil baru?",
          [
            { text: "Batal", style: "cancel" },
            {
              text: "Ya, Simpan",
              onPress: async () => {
                try {
                  setLoading(true);
                  await updateProfile({ avatarUri: result.assets[0].uri });
                  await fetchData();
                  Alert.alert("Sukses", "Foto profil diperbarui");
                } catch (error: any) {
                  Alert.alert("Error", error.message || "Gagal mengupdate foto");
                } finally {
                  setLoading(false);
                }
              }
            }
          ]
        );
      }
    } catch (error) {
      Alert.alert("Error", "Gagal mengambil gambar");
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleEditProfile = () => {
    setEditModalVisible(true);
  };

  const handleVerification = () => {
    router.push("/verification" as any);
  };

  const handleLogout = () => {
    Alert.alert(
      "Konfirmasi",
      "Apakah Anda yakin ingin keluar?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Keluar",
          style: "destructive",
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              Alert.alert("Error", "Gagal keluar");
            }
          }
        }
      ]
    );
  };

  const renderStatusBadge = (status: string) => {
    const statusConfig = {
      APPROVED: { color: "#DCFCE7", text: "Disetujui", textColor: "#166534" },
      VERIFIED: { color: "#DCFCE7", text: "Terverifikasi", textColor: "#166534" },
      COMPLETED: { color: "#DCFCE7", text: "Selesai", textColor: "#166534" },
      ADOPTED: { color: "#DCFCE7", text: "Selesai", textColor: "#166534" },
      REJECTED: { color: "#FEE2E2", text: "Ditolak", textColor: "#991B1B" },
      CANCELLED: { color: "#FEE2E2", text: "Dibatalkan", textColor: "#991B1B" },
      PROCESSING: { color: "#DBEAFE", text: "Diproses", textColor: "#1E40AF" },
      PENDING: { color: "#FEF3C7", text: "Menunggu", textColor: "#92400E" }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;

    return (
      <View style={[styles.badge, { backgroundColor: config.color }]}>
        <Text style={[styles.badgeText, { color: config.textColor }]}>{config.text}</Text>
      </View>
    );
  };

  const renderVerificationBadge = () => {
    if (!profile) return null;

    const badgeConfig = {
      VERIFIED: {
        icon: <ShieldCheck size={16} color="#059669" />,
        text: "Terverifikasi",
        bgColor: "#D1FAE5",
        textColor: "#059669",
        onPress: undefined
      },
      PENDING: {
        icon: <Shield size={16} color="#D97706" />,
        text: "Menunggu Verifikasi",
        bgColor: "#FEF3C7",
        textColor: "#D97706",
        onPress: undefined
      },
      default: {
        icon: <Shield size={16} color="#DC2626" />,
        text: "Belum Terverifikasi",
        bgColor: "#FEE2E2",
        textColor: "#DC2626",
        onPress: handleVerification
      }
    };

    const config = badgeConfig[profile.verificationStatus as keyof typeof badgeConfig] || badgeConfig.default;

    const Wrapper = config.onPress ? TouchableOpacity : View;

    return (
      <Wrapper
        style={[styles.verifiedBadge, { backgroundColor: config.bgColor }]}
        onPress={config.onPress}
      >
        {config.icon}
        <Text style={[styles.verifiedText, { color: config.textColor }]}>
          {config.text}
        </Text>
      </Wrapper>
    );
  };

  const renderAdoptionItem = (item: AdoptionRequest) => {
    const statusMessages = {
      APPROVED: { emoji: "✅", text: "Disetujui", color: "#059669" },
      REJECTED: { emoji: "❌", text: "Permintaan ditolak", color: "#DC2626" },
      COMPLETED: { emoji: "🎉", text: "Adopsi selesai", color: "#059669" },
      CANCELLED: { emoji: "⏹️", text: "Dibatalkan", color: "#6B7280" },
      PENDING: { emoji: "⏳", text: "Menunggu persetujuan admin", color: "#F59E0B" }
    };

    const statusMsg = statusMessages[item.status as keyof typeof statusMessages];

    return (
      <View key={item.id} style={styles.card}>
        <Image source={{ uri: item.pet?.imageUrl }} style={styles.petImage} />
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.petName} numberOfLines={1}>{item.pet?.name}</Text>
            {renderStatusBadge(item.status)}
          </View>
          <Text style={styles.shelterName}>📍 {item.pet?.shelter?.name}</Text>

          {item.status === "APPROVED" && item.adminNote && (
            <View style={styles.noteContainer}>
              <Text style={styles.noteLabel}>💬 Catatan Admin:</Text>
              <Text style={styles.noteText}>{item.adminNote}</Text>
            </View>
          )}

          {statusMsg && (
            <View style={styles.statusMessage}>
              <Text style={[styles.statusMessageText, { color: statusMsg.color }]}>
                {statusMsg.emoji} {statusMsg.text}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderDonationItem = (item: Donation) => (
    <View key={item.id} style={styles.card}>
      <Image source={{ uri: item.campaign?.imageUrl }} style={styles.petImage} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.petName} numberOfLines={2}>{item.campaign?.title}</Text>
          {renderStatusBadge(item.status)}
        </View>
        <Text style={styles.amountText}>💰 Rp {item.amount.toLocaleString("id-ID")}</Text>
      </View>
    </View>
  );

  const renderReportItem = (item: CatReport) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.card, { flexDirection: 'column' }]}
      onPress={() => router.push(`/report/${item.id}` as any)}
      activeOpacity={0.7}
    >
      <View style={{ flexDirection: 'row', width: '100%' }}>
        <Image source={{ uri: item.imageUrl || item.imageUri }} style={styles.petImage} />
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.petName} numberOfLines={1}>📍 {item.location}</Text>
            {renderStatusBadge(item.status)}
          </View>
          <Text style={styles.shelterName}>🏥 {item.shelter?.name}</Text>
        </View>
      </View>

      {item.status === 'REJECTED' && item.adminNote && (
        <View style={[styles.noteContainer, { marginTop: 12, backgroundColor: '#FEE2E2', borderLeftColor: '#EF4444' }]}>
          <Text style={[styles.noteLabel, { color: '#991B1B' }]}>💬 Alasan Penolakan:</Text>
          <Text style={[styles.noteText, { color: '#B91C1C' }]}>{item.adminNote}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <ScreenWrapper backgroundColor={Colors.primary}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1A1A1A" />
          <Text style={styles.loadingText}>Memuat profil...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper backgroundColor={Colors.primary}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil Saya</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn} activeOpacity={0.7}>
          <LogOut size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>

      {/* Content Card */}
      <View style={styles.contentCard}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#1A1A1A"
            />
          }
        >
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                {profile?.avatar ? (
                  <Image source={{ uri: profile.avatar }} style={styles.avatar} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarPlaceholderText}>
                      {profile?.name?.charAt(0).toUpperCase() || "👤"}
                    </Text>
                  </View>
                )}
                <TouchableOpacity
                  style={styles.editAvatarBtn}
                  onPress={handlePickAvatar}
                  activeOpacity={0.8}
                >
                  <Camera size={16} color="white" />
                </TouchableOpacity>
              </View>

              <View style={styles.profileInfo}>
                <Text style={styles.userName}>
                  {profile?.name}
                </Text>
                <View style={styles.userEmailContainer}>
                  <Mail size={16} color="#1A1A1A" />
                  <Text style={styles.userEmail}>
                    {profile?.email}
                  </Text>
                </View>
                <View style={styles.userPhoneContainer}>
                  <Phone size={16} color="#1A1A1A" />
                  {profile?.phone && (
                    <Text style={styles.userPhone}>{profile.phone}</Text>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.profileActions}>
              {renderVerificationBadge()}

              <TouchableOpacity
                style={styles.editProfileBtn}
                onPress={handleEditProfile}
                activeOpacity={0.7}
              >
                <Pencil size={18} color="#1A1A1A" />
                <Text style={styles.editProfileText}>Edit Profil</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabs}>
            {[
              { id: "adopsi", label: "Adopsi", count: adoptions.length },
              { id: "donasi", label: "Donasi", count: donations.length },
              { id: "laporan", label: "Laporan", count: reports.length }
            ].map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tab, activeTab === tab.id && styles.activeTab]}
                onPress={() => setActiveTab(tab.id)}
                activeOpacity={0.7}
              >
                <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
                  {tab.label}
                </Text>
                <View style={[
                  styles.tabCount,
                  activeTab === tab.id && styles.activeTabCount
                ]}>
                  <Text style={[
                    styles.tabCountText,
                    activeTab === tab.id && styles.activeTabCountText
                  ]}>
                    {tab.count}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Content */}
          <View style={styles.listContainer}>
            {activeTab === "adopsi" && (
              adoptions.length > 0 ? (
                adoptions.map(renderAdoptionItem)
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateEmoji}>🐱</Text>
                  <Text style={styles.emptyStateText}>Belum ada riwayat adopsi</Text>
                  <Text style={styles.emptyStateSubtext}>
                    Mulai adopsi hewan peliharaan sekarang
                  </Text>
                </View>
              )
            )}

            {activeTab === "donasi" && (
              donations.length > 0 ? (
                donations.map(renderDonationItem)
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateEmoji}>💰</Text>
                  <Text style={styles.emptyStateText}>Belum ada riwayat donasi</Text>
                  <Text style={styles.emptyStateSubtext}>
                    Bantu kampanye penyelamatan hewan
                  </Text>
                </View>
              )
            )}

            {activeTab === "laporan" && (
              reports.length > 0 ? (
                reports.map(renderReportItem)
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateEmoji}>📋</Text>
                  <Text style={styles.emptyStateText}>Belum ada laporan</Text>
                  <Text style={styles.emptyStateSubtext}>
                    Laporkan hewan yang membutuhkan bantuan
                  </Text>
                </View>
              )
            )}
          </View>
        </ScrollView>
      </View>

      {/* Edit Profile Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profil</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nama Lengkap</Text>
              <TextInput
                style={styles.input}
                placeholder="Masukkan nama lengkap"
                value={editForm.name}
                onChangeText={(text) => setEditForm({ ...editForm, name: text })}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>No. Telepon</Text>
              <TextInput
                style={styles.input}
                placeholder="Masukkan nomor telepon"
                value={editForm.phone}
                keyboardType="phone-pad"
                onChangeText={(text) => setEditForm({ ...editForm, phone: text })}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setEditModalVisible(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelBtnText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.saveBtn]}
                onPress={async () => {
                  try {
                    setLoading(true);
                    await updateProfile({
                      name: editForm.name,
                      phone: editForm.phone,
                    });
                    Alert.alert("Sukses", "Profil berhasil diperbarui");
                    setEditModalVisible(false);
                    fetchData();
                  } catch (error: any) {
                    Alert.alert("Error", error.message || "Gagal mengupdate profil");
                  } finally {
                    setLoading(false);
                  }
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.saveBtnText}>
                  {loading ? "Menyimpan..." : "Simpan"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16
  },
  loadingText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "600"
  },
  // Profile Header (Avatar + Info dalam row)
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 16,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#1A1A1A",
    letterSpacing: -0.5
  },
  logoutBtn: {
    padding: 12,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderRadius: 16,
  },
  contentCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 32,
    minHeight: height - 150,
  },
  profileSection: {
    alignItems: "flex-start",
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 20
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  avatarPlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  avatarPlaceholderText: {
    fontSize: 42,
    fontWeight: "700",
    color: "#9CA3AF"
  },
  userEmailContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  userPhoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  editAvatarBtn: {
    position: "absolute",
    bottom: 2,
    right: 2,
    backgroundColor: "#1A1A1A",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  profileInfo: {
    alignItems: "flex-start",
    marginBottom: 16,
    gap: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1A1A1A",
    letterSpacing: -0.5,
  },
  userEmail: {
    fontSize: 14,
    backgroundColor: "#afafafff",
    padding: 4,
    borderRadius: 8,
    color: "#000000ff",
    fontWeight: "500"
  },
  userPhone: {
    fontSize: 14,
    backgroundColor: "#afafafff",
    padding: 4,
    borderRadius: 8,
    color: "#000000ff",
    fontWeight: "500"
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  verifiedText: {
    fontSize: 13,
    fontWeight: "700"
  },
  editProfileBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  editProfileText: {
    color: "#1A1A1A",
    fontWeight: "700",
    fontSize: 14
  },
  tabs: {
    flexDirection: "row",
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 10,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  activeTab: {
    backgroundColor: "#1A1A1A",
    borderColor: "#1A1A1A",
  },
  tabText: {
    color: "#6B7280",
    fontWeight: "700",
    fontSize: 13
  },
  activeTabText: {
    color: Colors.primary
  },
  tabCount: {
    backgroundColor: "#E5E7EB",
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  activeTabCount: {
    backgroundColor: Colors.primary,
  },
  profileActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  tabCountText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#6B7280",
  },
  activeTabCountText: {
    color: "#1A1A1A",
  },
  listContainer: {
    paddingHorizontal: 24,
    paddingBottom: 100
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 14,
    marginBottom: 14,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#F3F4F6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  noteContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#FEF3C7',
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
  },
  noteLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 4,
  },
  noteText: {
    fontSize: 12,
    color: '#78350F',
    lineHeight: 16,
  },
  statusMessage: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  statusMessageText: {
    fontSize: 12,
    fontWeight: "600",
  },
  petImage: {
    width: 85,
    height: 85,
    borderRadius: 16,
    backgroundColor: "#F3F4F6"
  },
  cardContent: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
    gap: 4
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
    gap: 8
  },
  petName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1A1A1A",
    flex: 1,
    letterSpacing: -0.3
  },
  shelterName: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "600"
  },
  amountText: {
    fontSize: 15,
    color: "#059669",
    fontWeight: "800",
    marginTop: 2
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    minWidth: 70,
    alignItems: "center"
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "800",
    textTransform: 'uppercase',
    letterSpacing: 0.3
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateEmoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
    textAlign: "center"
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 20
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 28,
    padding: 28,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 24,
    textAlign: "center",
    color: "#1A1A1A",
    letterSpacing: -0.5
  },
  inputContainer: {
    marginBottom: 16
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 8,
    marginLeft: 4
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 16,
    fontSize: 15,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    color: "#1A1A1A"
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center"
  },
  cancelBtn: {
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB"
  },
  cancelBtnText: {
    color: "#6B7280",
    fontWeight: "700",
    fontSize: 15
  },
  saveBtn: {
    backgroundColor: "#1A1A1A",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveBtnText: {
    color: Colors.primary,
    fontWeight: "800",
    fontSize: 15
  },
});

export default ProfileScreen;