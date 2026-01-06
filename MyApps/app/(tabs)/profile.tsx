import ScreenWrapper from "@/components/ui/ScreenWrapper";
import { AdoptionRequest, getMyAdoptions } from "@/services/adoptionService";
import { Donation, getMyDonations } from "@/services/donationService";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ProfileScreen = () => {
  const [activeTab, setActiveTab] = useState("adopsi");
  const [adoptions, setAdoptions] = useState<AdoptionRequest[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [adoptionsData, donationsData] = await Promise.all([
        getMyAdoptions(),
        getMyDonations()
      ]);
      setAdoptions(adoptionsData);
      setDonations(donationsData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const renderStatusBadge = (status: string) => {
    let color = "#FEF08A"; // Yellow/Pending
    let text = "Menunggu Konfirmasi";
    let textColor = "#854D0E";

    if (status === "APPROVED" || status === "VERIFIED") {
      color = "#BBF7D0"; // Green
      text = status === "VERIFIED" ? "Terverifikasi" : "Disetujui - Siap Jemput";
      textColor = "#166534";
    } else if (status === "REJECTED") {
      color = "#FECACA"; // Red
      text = "Ditolak";
      textColor = "#991B1B";
    } else if (status === "COMPLETED" || status === "ADOPTED") {
      color = "#E5E7EB"; // Gray
      text = "Selesai";
      textColor = "#374151";
    }

    return (
      <View style={[styles.badge, { backgroundColor: color }]}>
        <Text style={[styles.badgeText, { color: textColor }]}>{text}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil Saya</Text>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          <Text style={{ fontSize: 30 }}>👤</Text>
        </View>
        <Text style={styles.userName}>User Pencinta Kucing</Text>
        <Text style={styles.userEmail}>user@example.com</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "adopsi" && styles.activeTab]}
          onPress={() => setActiveTab("adopsi")}
        >
          <Text style={[styles.tabText, activeTab === "adopsi" && styles.activeTabText]}>
            Riwayat Adopsi
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "donasi" && styles.activeTab]}
          onPress={() => setActiveTab("donasi")}
        >
          <Text style={[styles.tabText, activeTab === "donasi" && styles.activeTabText]}>
            Riwayat Donasi
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <ActivityIndicator color="#1EB00E" style={{ marginTop: 20 }} />
        ) : activeTab === "adopsi" ? (
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
                  {item.status === 'APPROVED' && (
                    <View style={styles.approvalInfo}>
                      <Text style={styles.approvalTitle}>Silakan jemput di:</Text>
                      <Text style={styles.address}>{item.pet?.shelter?.address}</Text>
                      {item.adminNote && <Text style={styles.note}>" {item.adminNote} "</Text>}
                    </View>
                  )}
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>Belum ada riwayat adopsi.</Text>
          )
        ) : (
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
                  <Text style={styles.dateText}>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-'}</Text>

                  {item.proofUrl ? (
                    <Text style={{ fontSize: 10, color: '#1EB00E' }}>Bukti Uploaded ✅</Text>
                  ) : (
                    <Text style={{ fontSize: 10, color: 'red' }}>Bukti Missing ❌</Text>
                  )}
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>Belum ada riwayat donasi.</Text>
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5EFE6" },
  header: { padding: 24, backgroundColor: "#F5EFE6" },
  headerTitle: { fontSize: 28, fontWeight: "900", color: "#1A1A1A" },
  profileSection: { alignItems: 'center', marginBottom: 30 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  userName: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },
  userEmail: { fontSize: 14, color: '#666' },
  tabs: { flexDirection: "row", paddingHorizontal: 24, marginBottom: 20, gap: 15 },
  tab: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: "#E5E7EB" },
  activeTab: { backgroundColor: "#1EB00E" },
  tabText: { color: "#666", fontWeight: "600" },
  activeTabText: { color: "white" },
  listContainer: { paddingHorizontal: 24, paddingBottom: 120 },
  card: { backgroundColor: "white", borderRadius: 16, padding: 12, marginBottom: 16, flexDirection: "row", elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  petImage: { width: 80, height: 80, borderRadius: 12, backgroundColor: "#F3F4F6" },
  cardContent: { flex: 1, marginLeft: 12 },
  cardHeader: { flexDirection: 'column', alignItems: 'flex-start', marginBottom: 4, gap: 4 },
  petName: { fontSize: 16, fontWeight: "bold", color: "#1A1A1A" },
  shelterName: { fontSize: 14, color: '#1EB00E', fontWeight: 'bold', marginBottom: 4 },
  dateText: { fontSize: 12, color: '#999', marginBottom: 4 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  badgeText: { fontSize: 10, fontWeight: "bold" },
  emptyText: { textAlign: "center", color: "#999", marginTop: 20 },
  approvalInfo: { marginTop: 8, padding: 8, backgroundColor: '#F0FDF4', borderRadius: 8, borderColor: '#BBF7D0', borderWidth: 1 },
  approvalTitle: { fontSize: 12, fontWeight: 'bold', color: '#166534' },
  address: { fontSize: 12, color: '#166534', marginTop: 2 },
  note: { fontSize: 11, fontStyle: 'italic', color: '#166534', marginTop: 4 }
});

export default ProfileScreen;
