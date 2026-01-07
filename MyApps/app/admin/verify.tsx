import { getVerificationRequests, updateVerificationStatus, UserProfile } from "@/services/userService";
import { useRouter } from "expo-router";
import { Check, X, ArrowLeft } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AdminVerifyScreen() {
    const router = useRouter();
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const data = await getVerificationRequests('PENDING');
            setUsers(data);
        } catch (error: any) {
            // Alert.alert("Error", error.message);
            // Fail silently if not admin or unauthorized, just mock data for demo if needed
            // or show empty state
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleAction = async (userId: string, status: 'VERIFIED' | 'REJECTED') => {
        try {
            await updateVerificationStatus(userId, status);
            Alert.alert("Sukses", `User berhasil di-${status === 'VERIFIED' ? 'verifikasi' : 'tolak'}`);
            fetchRequests();
        } catch (error: any) {
            Alert.alert("Error", error.message);
        }
    };

    const renderItem = ({ item }: { item: UserProfile }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.email}>{item.email}</Text>
                    <Text style={styles.date}>Request: {new Date(item.createdAt).toLocaleDateString()}</Text>
                </View>
                <TouchableOpacity onPress={() => setSelectedImage(item.ktpImageUrl || null)}>
                    <Text style={styles.viewKtp}>Lihat KTP</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity
                    style={[styles.btn, styles.rejectBtn]}
                    onPress={() => handleAction(item.id, 'REJECTED')}
                >
                    <X size={20} color="#EF4444" />
                    <Text style={styles.rejectText}>Tolak</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.btn, styles.acceptBtn]}
                    onPress={() => handleAction(item.id, 'VERIFIED')}
                >
                    <Check size={20} color="white" />
                    <Text style={styles.acceptText}>Verifikasi</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={24} color="#1A1A1A" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Admin Verifikasi</Text>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#1EB00E" style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={users}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>Tidak ada permintaan verifikasi pending.</Text>
                    }
                />
            )}

            <Modal visible={!!selectedImage} transparent={true} animationType="fade">
                <View style={styles.modalBg}>
                    <TouchableOpacity style={styles.closeModal} onPress={() => setSelectedImage(null)}>
                        <X size={30} color="white" />
                    </TouchableOpacity>
                    {selectedImage && (
                        <Image source={{ uri: selectedImage }} style={styles.fullImage} resizeMode="contain" />
                    )}
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F5EFE6" },
    header: {
        padding: 24,
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        backgroundColor: "#F5EFE6",
        borderBottomWidth: 1,
        borderBottomColor: "#E5E5E5"
    },
    headerTitle: { fontSize: 24, fontWeight: "bold", color: "#1A1A1A" },
    backBtn: { padding: 8 },
    list: { padding: 24 },
    card: {
        backgroundColor: "white",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 16,
    },
    name: { fontSize: 18, fontWeight: "bold", color: "#1A1A1A" },
    email: { fontSize: 14, color: "#666", marginTop: 4 },
    date: { fontSize: 12, color: "#999", marginTop: 8 },
    viewKtp: {
        color: "#1EB00E",
        fontWeight: "bold",
        fontSize: 14,
        textDecorationLine: "underline"
    },
    actions: { flexDirection: "row", gap: 12 },
    btn: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        borderRadius: 12,
        gap: 8,
    },
    rejectBtn: { backgroundColor: "#FEE2E2", borderWidth: 1, borderColor: "#FECACA" },
    acceptBtn: { backgroundColor: "#1EB00E" },
    rejectText: { color: "#EF4444", fontWeight: "700" },
    acceptText: { color: "white", fontWeight: "700" },
    emptyText: { textAlign: "center", color: "#666", marginTop: 40 },

    modalBg: { flex: 1, backgroundColor: "black", justifyContent: "center" },
    closeModal: { position: "absolute", top: 40, right: 20, zIndex: 10, padding: 10 },
    fullImage: { width: "100%", height: "80%" },
});
