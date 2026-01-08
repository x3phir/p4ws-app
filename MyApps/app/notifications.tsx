import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Pressable,
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

    const handleNotificationPress = async (notification: Notification) => {
        // Mark as read jika belum dibaca
        if (!notification.isRead) {
            await markAsRead(notification.id);
            setNotifications(prev =>
                prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
            );
        }

        // TODO: Navigate ke detail berdasarkan notification type
        // Contoh routing berdasarkan tipe notifikasi:
        // if (notification.type === 'adoption') {
        //     router.push(`/adopt/${notification.referenceId}`);
        // } else if (notification.type === 'donation') {
        //     router.push(`/donation/${notification.referenceId}`);
        // } else if (notification.type === 'report') {
        //     router.push(`/lapor/${notification.referenceId}`);
        // }

        console.log('Notification clicked:', notification);
    };

    const handleDelete = async (id: string, event?: any) => {
        // Stop propagation untuk mencegah trigger parent TouchableOpacity
        if (event) {
            event.stopPropagation();
        }

        try {
            await deleteNotification(id);
            setNotifications(prev => prev.filter(n => n.id !== id));
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const renderItem = ({ item }: { item: Notification }) => (
        <Pressable
            style={({ pressed }) => [
                styles.notificationCard,
                !item.isRead && styles.unreadCard,
                pressed && styles.pressedCard
            ]}
            onPress={() => handleNotificationPress(item)}
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

            <Pressable
                style={({ pressed }) => [
                    styles.deleteBtn,
                    pressed && styles.deleteBtnPressed
                ]}
                onPress={(e) => {
                    e.stopPropagation();
                    handleDelete(item.id);
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <Trash2 size={18} color="#EF4444" />
            </Pressable>
        </Pressable>
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
    pressedCard: {
        opacity: 0.7,
        transform: [{ scale: 0.98 }],
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
        flex: 1,
    },
    unreadText: {
        color: "#1F2937",
        fontWeight: "bold",
    },
    timeText: {
        fontSize: 12,
        color: "#9CA3AF",
        marginLeft: 8,
    },
    message: {
        fontSize: 14,
        color: "#6B7280",
        lineHeight: 20,
    },
    deleteBtn: {
        padding: 8,
        marginLeft: 8,
        borderRadius: 8,
    },
    deleteBtnPressed: {
        backgroundColor: "#FEE2E2",
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