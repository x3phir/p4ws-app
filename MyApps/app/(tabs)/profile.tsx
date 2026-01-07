// MyApps/app/(tabs)/profile.tsx
import ScreenWrapper from "@/components/ui/ScreenWrapper";
import Header from "@/components/ui/Header";
import { Colors } from "@/constants/theme";
import { AdoptionRequest, getMyAdoptions } from "@/services/adoptionService";
import { Donation, getMyDonations } from "@/services/donationService";
import { getUserProfile, updateProfile, UserProfile } from "@/services/userService";
import { CatReport, getMyReports } from "@/services/reportService";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Camera, Edit, Shield, ShieldCheck, LogOut, Pencil } from "lucide-react-native";
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

  // Edit Profile Modal
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editForm, setEditForm] = useState<{ name: string, phone: string, email: string, avatarUri?: string }>({ name: "", phone: "", email: "" });
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
    let color = "#FEF08A";
    let text = "Menunggu";
    let textColor = "#854D0E";

    if (status === "APPROVED" || status === "VERIFIED" || status === "COMPLETED" || status === "ADOPTED") {
      color = "#BBF7D0";
      if (status === "VERIFIED") text = "Terverifikasi";
      else if (status === "COMPLETED" || status === "ADOPTED") text = "Selesai";
      else text = "Disetujui";
      textColor = "#166534";
    } else if (status === "REJECTED" || status === "CANCELLED") {
      color = "#FECACA";
      text = status === "REJECTED" ? "Ditolak" : "Dibatalkan";
      textColor = "#991B1B";
    } else if (status === "PROCESSING") {
      color = "#BFDBFE";
      text = "Diproses";
      textColor = "#1E40AF";
    }

    return (
      <View style={[styles.badge, { backgroundColor: color }]}>
        <Text style={[styles.badgeText, { color: textColor }]}>{text}</Text>
      </View>
    );
  };

  const renderVerificationBadge = () => {
    if (!profile) return null;

    if (profile.verificationStatus === "VERIFIED") {
      return (
        <View style={styles.verifiedBadge}>
          <ShieldCheck size={16} color="#166534" />
          <Text style={styles.verifiedText}>Terverifikasi</Text>
        </View>
      );
    }

    if (profile.verificationStatus === "PENDING") {
      return (
        <View style={[styles.verifiedBadge, { backgroundColor: "#FEF08A" }]}>
          <Shield size={16} color="#854D0E" />
          <Text style={[styles.verifiedText, { color: "#854D0E" }]}>
            Menunggu Verifikasi
          </Text>
        </View>
      );
    }

    return (
      <TouchableOpacity
        style={[styles.verifiedBadge, { backgroundColor: "#FEE2E2" }]}
        onPress={handleVerification}
      >
        <Shield size={16} color="#991B1B" />
        <Text style={[styles.verifiedText, { color: "#991B1B" }]}>
          Belum Terverifikasi
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) {
    return (
      <ScreenWrapper backgroundColor={Colors.primary}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1A1A1A" />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper backgroundColor={Colors.primary}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profi Saya</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <LogOut size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <View style={styles.contentCard}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              {profile?.avatar ? (
                <Image source={{ uri: profile.avatar }} style={styles.avatar} />
              ) : (
                <View style={styles.avatar}>
                  <Text style={{ fontSize: 30 }}>👤</Text>
                </View>
              )}
              <TouchableOpacity style={styles.editAvatarBtn} onPress={handlePickAvatar}>
                <Camera size={16} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.editProfileBtn}>
              <TouchableOpacity onPress={handleEditProfile}>
                <Pencil size={20} color="black" style={[styles.tab]} />
              </TouchableOpacity>
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{profile?.name}</Text>
              <Text style={styles.userEmail}>{profile?.email}</Text>
              {profile?.phone && (
                <Text style={styles.userPhone}>📱 {profile.phone}</Text>
              )}
            </View>

            {renderVerificationBadge()}
          </View>

          {/* Tabs */}
          <View style={styles.tabs}>
            {["adopsi", "donasi", "laporan"].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.activeTab]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Content */}
          <View style={styles.listContainer}>
            {activeTab === "adopsi" ? (
              adoptions.length > 0 ? (
                adoptions.map((item) => (
                  <View key={item.id} style={styles.card}>
                    <Image source={{ uri: item.pet?.imageUrl }} style={styles.petImage} />
                    <View style={styles.cardContent}>
                      <View style={styles.cardHeader}>
                        <Text style={styles.petName}>{item.pet?.name}</Text>
                        {renderStatusBadge(item.status)}
                      </View>
                      <Text style={styles.shelterName}>📍 {item.pet?.shelter?.name}</Text>

                      {/* Hanya tampilkan adminNote jika status APPROVED dan ada adminNote */}
                      {item.status === "APPROVED" && item.adminNote ? (
                        <View style={styles.noteContainer}>
                          <Text style={styles.noteLabel}>Catatan Persetujuan:</Text>
                          <Text style={styles.noteText}>{item.adminNote}</Text>
                        </View>
                      ) : null}

                      {/* Untuk status lain, bisa tampilkan pesan khusus jika perlu */}
                      {item.status === "REJECTED" && (
                        <Text style={[styles.shelterName, { color: "#DC2626", marginTop: 4 }]}>
                          ❌ Permintaan ditolak
                        </Text>
                      )}

                      {item.status === "COMPLETED" && (
                        <Text style={[styles.shelterName, { color: "#059669", marginTop: 4 }]}>
                          ✅ Adopsi selesai
                        </Text>
                      )}

                      {item.status === "CANCELLED" && (
                        <Text style={[styles.shelterName, { color: "#6B7280", marginTop: 4 }]}>
                          ⏹️ Dibatalkan
                        </Text>
                      )}

                      {item.status === "PENDING" && (
                        <Text style={[styles.shelterName, { color: "#F59E0B", marginTop: 4 }]}>
                          ⏳ Menunggu persetujuan admin
                        </Text>
                      )}
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>Belum ada riwayat adopsi.</Text>
              )
            ) : activeTab === "donasi" ? (
              donations.length > 0 ? (
                donations.map((item) => (
                  <View key={item.id} style={styles.card}>
                    <Image source={{ uri: item.campaign?.imageUrl }} style={styles.petImage} />
                    <View style={styles.cardContent}>
                      <View style={styles.cardHeader}>
                        <Text style={styles.petName} numberOfLines={1}>{item.campaign?.title}</Text>
                        {renderStatusBadge(item.status)}
                      </View>
                      <Text style={styles.shelterName}>💰 Rp {item.amount.toLocaleString()}</Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>Belum ada riwayat donasi.</Text>
              )
            ) : (
              reports.length > 0 ? (
                reports.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.card}
                    onPress={() => router.push(`/report/${item.id}` as any)}
                  >
                    <Image source={{ uri: item.imageUrl || item.imageUri }} style={styles.petImage} />
                    <View style={styles.cardContent}>
                      <View style={styles.cardHeader}>
                        <Text style={styles.petName} numberOfLines={1}>📍 {item.location}</Text>
                        {renderStatusBadge(item.status)}
                      </View>
                      <Text style={styles.shelterName}>🏥 {item.shelter?.name}</Text>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.emptyText}>Belum ada riwayat laporan.</Text>
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
            <TextInput style={styles.input} placeholder="Nama" value={editForm.name} onChangeText={(text) => setEditForm({ ...editForm, name: text })} />
            <TextInput style={styles.input} placeholder="Email" value={editForm.email} keyboardType="email-address" autoCapitalize="none" onChangeText={(text) => setEditForm({ ...editForm, email: text })} />
            <TextInput style={styles.input} placeholder="No. Telepon" value={editForm.phone} keyboardType="phone-pad" onChangeText={(text) => setEditForm({ ...editForm, phone: text })} />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalBtn, styles.cancelBtn]} onPress={() => setEditModalVisible(false)}><Text style={styles.cancelBtnText}>Batal</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, styles.saveBtn]} onPress={async () => {
                try {
                  setLoading(true);
                  await updateProfile({ name: editForm.name, phone: editForm.phone, email: editForm.email });
                  Alert.alert("Sukses", "Profil berhasil diperbarui");
                  setEditModalVisible(false);
                  fetchData();
                } catch (error: any) {
                  Alert.alert("Error", error.message || "Gagal mengupdate profil");
                } finally { setLoading(false); }
              }}>
                <Text style={styles.saveBtnText}>{loading ? "Menyimpan..." : "Simpan"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  headerTitle: { fontSize: 26, fontWeight: "900", color: "#1A1A1A", letterSpacing: -0.5 },
  logoutBtn: {
    padding: 10,
    backgroundColor: "rgba(255, 75, 75, 0.1)",
    borderRadius: 15,
  },
  contentCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingTop: 30,
    minHeight: height - 150,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 30,
    paddingHorizontal: 24,
  },
  avatarContainer: { position: "relative", marginBottom: 15 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#FFFFFF",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  editAvatarBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#1A1A1A",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  profileInfo: { alignItems: "center", marginBottom: 15 },
  userName: { fontSize: 24, fontWeight: "bold", color: "#1A1A1A", letterSpacing: -0.5 },
  userEmail: { fontSize: 14, color: "#666", marginTop: 4 },
  userPhone: { fontSize: 13, color: "#666", marginTop: 2 },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  verifiedText: { fontSize: 13, fontWeight: "700", color: "#065F46" },
  buttonRow: { flexDirection: 'row', gap: 12 },
  editProfileBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  editProfileText: { color: "#1A1A1A", fontWeight: "700", fontSize: 14 },
  tabs: {
    flexDirection: "row",
    paddingHorizontal: 24,
    marginBottom: 25,
    gap: 12,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 15,
    backgroundColor: "#F3F4F6",
  },
  activeTab: { backgroundColor: "#1A1A1A" },
  tabText: { color: "#666", fontWeight: "700", fontSize: 13 },
  activeTabText: { color: Colors.primary },
  listContainer: { paddingHorizontal: 24, paddingBottom: 100 },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 12,
    marginBottom: 16,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  noteContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#fccbbfff',
    borderRadius: 8,
    borderLeftColor: Colors.primary,
  },
  noteLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000ff',
    marginBottom: 2,
  },
  noteText: {
    fontSize: 12,
    color: '#374151',
    fontStyle: 'italic',
  },
  petImage: { width: 80, height: 80, borderRadius: 15, backgroundColor: "#F3F4F6" },
  cardContent: { flex: 1, marginLeft: 16, justifyContent: 'center' },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  petName: { fontSize: 16, fontWeight: "bold", color: "#1A1A1A", flex: 1, marginRight: 8 },
  shelterName: { fontSize: 13, color: "#666", fontWeight: "600" },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 10, fontWeight: "800", textTransform: 'uppercase' },
  emptyText: { textAlign: "center", color: "#9CA3AF", marginTop: 40, fontStyle: 'italic' },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center" },
  modalContent: { backgroundColor: "white", borderRadius: 30, padding: 30, width: "90%", maxWidth: 400 },
  modalTitle: { fontSize: 24, fontWeight: "900", marginBottom: 25, textAlign: "center", color: "#1A1A1A" },
  input: { backgroundColor: "#F9FAFB", borderRadius: 15, padding: 18, marginBottom: 15, fontSize: 16, borderWidth: 1, borderColor: "#E5E7EB" },
  modalButtons: { flexDirection: "row", gap: 12, marginTop: 10 },
  modalBtn: { flex: 1, paddingVertical: 16, borderRadius: 15, alignItems: "center" },
  cancelBtn: { backgroundColor: "#F3F4F6" },
  cancelBtnText: { color: "#6B7280", fontWeight: "700" },
  saveBtn: { backgroundColor: "#1A1A1A" },
  saveBtnText: { color: Colors.primary, fontWeight: "800" },
});

export default ProfileScreen;