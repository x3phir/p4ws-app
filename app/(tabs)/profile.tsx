import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Import AuthContext menggunakan relative path agar tidak error "Module not found"
import { useAuth } from "@/app/context/AuthContext";

const { width } = Dimensions.get("window");

export default function Profile() {
  const router = useRouter();
  const { setIsLoggedIn } = useAuth();

  // --- STATE UNTUK MODAL ---
  const [modalVisible, setModalVisible] = useState(false);
  const [activeModalType, setActiveModalType] = useState<string | null>(null);

  const openModal = (type: string) => {
    setActiveModalType(type);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setActiveModalType(null);
  };

  // --- KONTEN MODAL DINAMIS DARI TEMAN ---
  const renderModalContent = () => {
    switch (activeModalType) {
      case "Edit Profil":
        return (
          <View>
            <Text style={styles.modalLabel}>Nama Lengkap</Text>
            <TextInput style={styles.modalInput} defaultValue="Rex ID" />
            <Text style={styles.modalLabel}>Email</Text>
            <TextInput
              style={styles.modalInput}
              defaultValue="admin@rexid.com"
              keyboardType="email-address"
            />
            <Text style={styles.modalLabel}>No. Telepon</Text>
            <TextInput
              style={styles.modalInput}
              defaultValue="08123456789"
              keyboardType="phone-pad"
            />
            <TouchableOpacity
              style={styles.modalButtonPrimary}
              onPress={() => {
                Alert.alert("Sukses", "Profil berhasil diperbarui!");
                closeModal();
              }}
            >
              <Text style={styles.modalButtonText}>Simpan Perubahan</Text>
            </TouchableOpacity>
          </View>
        );

      case "Riwayat Donasi":
        return (
          <View>
            {[1, 2].map((item) => (
              <View key={item} style={styles.historyCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.historyTitle}>Donasi Makanan Kucing</Text>
                  <Text style={styles.historyDate}>20 Jan 2026 • 14:30</Text>
                </View>
                <Text style={styles.historyStatusSuccess}>Selesai</Text>
              </View>
            ))}
            <TouchableOpacity
              style={styles.modalButtonOutline}
              onPress={closeModal}
            >
              <Text style={styles.outlineButtonText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        );

      case "Riwayat Adopsi":
        return (
          <View>
            <View style={styles.historyCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.historyTitle}>Adopsi "Mochi"</Text>
                <Text style={styles.historyDate}>15 Des 2025</Text>
              </View>
              <Text style={styles.historyStatusProcess}>Menunggu</Text>
            </View>
            <View style={styles.historyCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.historyTitle}>Adopsi "Oyen"</Text>
                <Text style={styles.historyDate}>10 Nov 2025</Text>
              </View>
              <Text style={styles.historyStatusSuccess}>Berhasil</Text>
            </View>
            <TouchableOpacity
              style={styles.modalButtonOutline}
              onPress={closeModal}
            >
              <Text style={styles.outlineButtonText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        );

      case "Riwayat Lapor":
        return (
          <View>
            <View style={styles.historyCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.historyTitle}>
                  Kucing Luka di Jalan Mawar
                </Text>
                <Text style={styles.historyDate}>Kemarin</Text>
              </View>
              <Text style={styles.historyStatusProcess}>Diproses</Text>
            </View>
            <TouchableOpacity
              style={styles.modalButtonOutline}
              onPress={closeModal}
            >
              <Text style={styles.outlineButtonText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        );

      case "Verifikasi Akun":
        return (
          <View style={{ alignItems: "center" }}>
            <MaterialIcons
              name="verified-user"
              size={60}
              color="#4D96FF"
              style={{ marginBottom: 15 }}
            />
            <Text
              style={{ textAlign: "center", marginBottom: 20, color: "#555" }}
            >
              Upload foto KTP dan Selfie Anda untuk mendapatkan lencana
              Terverifikasi.
            </Text>
            <TouchableOpacity style={styles.uploadArea}>
              <Feather name="camera" size={24} color="#aaa" />
              <Text style={{ color: "#aaa", marginTop: 5 }}>
                Tap untuk upload KTP
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButtonPrimary}
              onPress={() => {
                Alert.alert(
                  "Berhasil",
                  "Permintaan verifikasi sedang ditinjau."
                );
                closeModal();
              }}
            >
              <Text style={styles.modalButtonText}>Ajukan Verifikasi</Text>
            </TouchableOpacity>
          </View>
        );

      case "Log out":
        return (
          <View style={{ alignItems: "center" }}>
            <View
              style={{
                backgroundColor: "#FFEBEE",
                padding: 15,
                borderRadius: 50,
                marginBottom: 15,
              }}
            >
              <Feather name="log-out" size={40} color="#D32F2F" />
            </View>
            <Text style={styles.modalTitleCenter}>Yakin ingin keluar?</Text>
            <Text
              style={{ textAlign: "center", color: "#666", marginBottom: 25 }}
            >
              Anda harus login kembali untuk mengakses akun ini.
            </Text>
            <View style={{ flexDirection: "row", gap: 10, width: "100%" }}>
              <TouchableOpacity
                style={[styles.modalButtonOutline, { flex: 1 }]}
                onPress={closeModal}
              >
                <Text style={styles.outlineButtonText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButtonPrimary,
                  { flex: 1, backgroundColor: "#FF6B6B" },
                ]}
                onPress={() => {
                  closeModal();
                  setIsLoggedIn(false);
                }}
              >
                <Text style={styles.modalButtonText}>Keluar</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  const MenuItem = ({
    title,
    onPress,
    isLast = false,
  }: {
    title: string;
    onPress?: () => void;
    isLast?: boolean;
  }) => (
    <TouchableOpacity
      style={[styles.menuItem, isLast && styles.menuItemLast]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.menuItemText,
          title === "Log out" && { color: "#D32F2F" },
        ]}
      >
        {title}
      </Text>
      <Feather name="chevron-right" size={24} color="#666" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.mainContainer}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{activeModalType}</Text>
              <TouchableOpacity onPress={closeModal}>
                <AntDesign name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalDivider} />
            <View style={styles.modalBody}>{renderModalContent()}</View>
          </View>
        </View>
      </Modal>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 150 }}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Feather name="arrow-left" size={28} color="black" />
          </TouchableOpacity>
          <View style={styles.profileInfoContainer}>
            <Image
              source={{
                uri: "https://i.pinimg.com/736x/8b/16/7a/8b167af653c23999696b7410a2263997.jpg",
              }}
              style={styles.avatar}
            />
            <View style={styles.identityContainer}>
              <Text style={styles.fullNameText}>Rex ID</Text>
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>Terverifikasi</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.bodyContainer}>
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: "#FF6B6B" }]}>
              <Text style={styles.statTitle}>Report</Text>
              <Text style={styles.statNumber}>12</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: "#F4D03F" }]}>
              <Text style={styles.statTitle}>Donate</Text>
              <Text style={styles.statNumber}>10</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: "#4D96FF" }]}>
              <Text style={styles.statTitle}>Adopt</Text>
              <Text style={styles.statNumber}>3</Text>
            </View>
          </View>

          <Text style={styles.menuLabel}>Pengaturan Akun</Text>
          <View style={styles.menuContainer}>
            <MenuItem
              title="Edit Profil"
              onPress={() => openModal("Edit Profil")}
            />
            <MenuItem
              title="Riwayat Donasi"
              onPress={() => openModal("Riwayat Donasi")}
            />
            <MenuItem
              title="Riwayat Adopsi"
              onPress={() => openModal("Riwayat Adopsi")}
            />
            <MenuItem
              title="Riwayat Lapor"
              onPress={() => openModal("Riwayat Lapor")}
            />
            <MenuItem
              title="Verifikasi Akun"
              onPress={() => openModal("Verifikasi Akun")}
            />
            <MenuItem
              title="Log out"
              isLast
              onPress={() => openModal("Log out")}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#Fdf7f0" },
  scrollView: { flex: 1 },
  headerContainer: {
    backgroundColor: "#AEE637",
    paddingTop: 60,
    paddingHorizontal: 25,
    paddingBottom: 40,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },
  backButton: { marginBottom: 20 },
  profileInfoContainer: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#4D96FF",
  },
  identityContainer: { marginLeft: 20 },
  fullNameText: { fontSize: 24, fontWeight: "900", color: "black" },
  badgeContainer: {
    backgroundColor: "#4D96FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 5,
  },
  badgeText: { color: "white", fontWeight: "bold", fontSize: 12 },
  bodyContainer: { paddingHorizontal: 25, marginTop: 25 },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  statCard: {
    width: (width - 50) / 3 - 10,
    aspectRatio: 1,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  statTitle: { fontSize: 14, fontWeight: "600", color: "#333" },
  statNumber: { fontSize: 32, fontWeight: "900", color: "black" },
  menuLabel: { fontSize: 20, fontWeight: "800", marginBottom: 15 },
  menuContainer: {
    backgroundColor: "#E5D8C5",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D4C4B0",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  menuItemLast: { borderBottomWidth: 0 },
  menuItemText: { fontSize: 16, fontWeight: "700" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#Fdf7f0",
    borderRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  modalTitle: { fontSize: 20, fontWeight: "bold" },
  modalDivider: { height: 1, backgroundColor: "#ccc", marginBottom: 20 },
  modalBody: { marginBottom: 10 },
  modalLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#555",
  },
  modalInput: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  modalButtonPrimary: {
    backgroundColor: "#AEE637",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  modalButtonOutline: {
    borderWidth: 1,
    borderColor: "#888",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  modalButtonText: { fontWeight: "bold" },
  outlineButtonText: { fontWeight: "bold", color: "#555" },
  historyCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  historyTitle: { fontWeight: "bold", fontSize: 14 },
  historyDate: { fontSize: 12, color: "#888" },
  historyStatusSuccess: {
    color: "green",
    fontWeight: "bold",
    fontSize: 12,
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  historyStatusProcess: {
    color: "#F57C00",
    fontWeight: "bold",
    fontSize: 12,
    backgroundColor: "#FFF3E0",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  uploadArea: {
    width: "100%",
    height: 120,
    borderWidth: 2,
    borderColor: "#ddd",
    borderStyle: "dashed",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fafafa",
    marginBottom: 20,
  },
  modalTitleCenter: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
});
