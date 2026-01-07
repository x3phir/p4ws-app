import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Bell, ChevronLeft, Trash2, CheckCircle } from "lucide-react-native";
import { useRouter } from "expo-router";
import ScreenWrapper from "@/components/ui/ScreenWrapper";
import {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    Notification
} from "@/services/notificationService";

export default function NotificationsScreen() {
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchNotifications = async () => {
        try {
            const data = await getNotifications();
            setNotifications(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchNotifications();
    };

    const handleMarkAsRead = async (id: string) => {
        await markAsRead(id);
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, isRead: true } : n)
        );
    };

    const handleDelete = async (id: string) => {
        await deleteNotification(id);
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const handleMarkAllRead = async () => {
        await markAllAsRead();
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    const renderItem = ({ item }: { item: Notification }) => (
        <TouchableOpacity
            style={[styles.notificationCard, !item.isRead && styles.unreadCard]}
            onPress={() => handleMarkAsRead(item.id)}
        >
            <View style={styles.iconContainer}>
                <View style={[styles.iconCircle, !item.isRead && styles.unreadIconCircle]}>
                    <Bell size={20} color={item.isRead ? "#6B7280" : "#AEE637"} />
                </View>
            </View>

            <View style={styles.contentContainer}>
                <View style={styles.cardHeader}>
                    <Text style={[styles.title, !item.isRead && styles.unreadText]}>
                        {item.title}
                    </Text>
                    <Text style={styles.timeText}>
                        {new Date(item.createdAt).toLocaleDateString()}
                    </Text>
                </View>
                <Text style={styles.message} numberOfLines={2}>
                    {item.message}
                </Text>
            </View>

            <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDelete(item.id)}
            >
                <Trash2 size={18} color="#EF4444" />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <ScreenWrapper>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ChevronLeft size={28} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifikasi</Text>
                {notifications.some(n => !n.isRead) ? (
                    <TouchableOpacity onPress={handleMarkAllRead} style={styles.actionBtn}>
                        <CheckCircle size={20} color="#AEE637" />
                    </TouchableOpacity>
                ) : (
                    <View style={{ width: 40 }} />
                )}
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#AEE637" />
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Bell size={64} color="#D1D5DB" />
                            <Text style={styles.emptyText}>Belum ada notifikasi.</Text>
                        </View>
                    }
                />
            )}
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 20,
        backgroundColor: "#fff",
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#1F2937",
    },
    actionBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "flex-end",
    },
    listContent: {
        padding: 20,
        paddingBottom: 100,
    },
    notificationCard: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        alignItems: "center",
    },
    unreadCard: {
        borderLeftWidth: 4,
        borderLeftColor: "#AEE637",
        backgroundColor: "#F9FAFB",
    },
    iconContainer: {
        marginRight: 12,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#F3F4F6",
        justifyContent: "center",
        alignItems: "center",
    },
    unreadIconCircle: {
        backgroundColor: "#ECFDF5",
    },
    contentContainer: {
        flex: 1,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4,
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        color: "#4B5563",
    },
    unreadText: {
        color: "#1F2937",
        fontWeight: "bold",
    },
    timeText: {
        fontSize: 12,
        color: "#9CA3AF",
    },
    message: {
        fontSize: 14,
        color: "#6B7280",
        lineHeight: 20,
    },
    deleteBtn: {
        padding: 8,
        marginLeft: 8,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyContainer: {
        alignItems: "center",
        marginTop: 100,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        color: "#9CA3AF",
    },
});
