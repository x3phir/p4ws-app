import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { CatReport, ReportStatus } from "@/types/report.types";
import { getReportById } from "@/services/reportService";
import ReportTimeline from "@/components/ui/ReportTimeline";

const { width } = Dimensions.get("window");

export default function ReportDetail() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const [report, setReport] = useState<CatReport | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadReport();
    }, [id]);

    const loadReport = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const reportData = await getReportById(id);
            setReport(reportData);
        } catch (error) {
            console.error("Error loading report:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: ReportStatus) => {
        switch (status) {
            case ReportStatus.PENDING:
                return "#FFA726";
            case ReportStatus.PROCESSING:
                return "#42A5F5";
            case ReportStatus.COMPLETED:
                return "#66BB6A";
            case ReportStatus.CANCELLED:
                return "#EF5350";
            case ReportStatus.REJECTED:
                return "#F44336";
            default:
                return "#9E9E9E";
        }
    };

    const getConditionColor = (condition: string) => {
        const cond = condition.toLowerCase();
        switch (cond) {
            case "sehat":
                return "#32CD32";
            case "terluka":
                return "#E4C725";
            case "sakit":
                return "#E53935";
            default:
                return "#9E9E9E";
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#32CD32" />
                <Text style={styles.loadingText}>Memuat detail laporan...</Text>
            </View>
        );
    }

    if (!report) {
        return (
            <View style={styles.errorContainer}>
                <Feather name="alert-circle" size={60} color="#E53935" />
                <Text style={styles.errorText}>Laporan tidak ditemukan</Text>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.backButtonText}>Kembali</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backIconButton}
                    onPress={() => router.back()}
                >
                    <Feather name="arrow-left" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Detail Laporan</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Status Badge */}
                <View
                    style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(report.status) },
                    ]}
                >
                    <Text style={styles.statusText}>{report.status}</Text>
                </View>

                {/* Report ID */}
                <Text style={styles.reportId}>ID: {report.id}</Text>

                {/* Cat Photo */}
                {(report.imageUrl || report.imageUri) && (
                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: report.imageUrl || report.imageUri }}
                            style={styles.catImage}
                            resizeMode="cover"
                        />
                    </View>
                )}

                {/* adminNote for REJECTED status */}
                {report.status === ReportStatus.REJECTED && report.adminNote && (
                    <View style={[styles.detailsCard, { backgroundColor: '#FEE2E2', borderColor: '#EF4444', borderWidth: 1 }]}>
                        <Text style={[styles.sectionTitle, { color: '#991B1B' }]}>Alasan Penolakan</Text>
                        <Text style={{ color: '#B91C1C', fontSize: 15, lineHeight: 22 }}>
                            {report.adminNote}
                        </Text>
                    </View>
                )}

                {/* Report Details */}
                <View style={styles.detailsCard}>
                    <Text style={styles.sectionTitle}>Informasi Laporan</Text>

                    {/* Location */}
                    <View style={styles.detailRow}>
                        <Feather name="map-pin" size={20} color="#32CD32" />
                        <View style={styles.detailContent}>
                            <Text style={styles.detailLabel}>Lokasi</Text>
                            <Text style={styles.detailValue}>{report.location}</Text>
                        </View>
                    </View>

                    {/* Condition */}
                    <View style={styles.detailRow}>
                        <Feather name="heart" size={20} color={getConditionColor(report.condition)} />
                        <View style={styles.detailContent}>
                            <Text style={styles.detailLabel}>Kondisi Kucing</Text>
                            <Text
                                style={[
                                    styles.detailValue,
                                    { color: getConditionColor(report.condition) },
                                ]}
                            >
                                {report.condition.charAt(0).toUpperCase() +
                                    report.condition.slice(1)}
                            </Text>
                        </View>
                    </View>

                    {/* Description */}
                    {report.description && (
                        <View style={styles.detailRow}>
                            <Feather name="file-text" size={20} color="#757575" />
                            <View style={styles.detailContent}>
                                <Text style={styles.detailLabel}>Deskripsi</Text>
                                <Text style={styles.detailValue}>{report.description}</Text>
                            </View>
                        </View>
                    )}
                </View>

                {/* Shelter Info */}
                <View style={styles.shelterCard}>
                    <Text style={styles.sectionTitle}>Shelter Tujuan</Text>
                    <View style={styles.shelterInfo}>
                        <Image
                            source={{ uri: report.shelter.imageUrl }}
                            style={styles.shelterImage}
                            resizeMode="cover"
                        />
                        <View style={styles.shelterDetails}>
                            <Text style={styles.shelterName}>{report.shelter.name}</Text>
                            {report.shelter.address && (
                                <Text style={styles.shelterAddress}>
                                    {report.shelter.address}
                                </Text>
                            )}
                            {report.shelter.capacity && (
                                <Text style={styles.shelterCapacity}>
                                    Kapasitas: {report.shelter.currentOccupancy}/
                                    {report.shelter.capacity}
                                </Text>
                            )}
                        </View>
                    </View>
                </View>

                {/* Timeline */}
                <ReportTimeline timeline={report.timeline} />
            </ScrollView >
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#Fdf7f0",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 15,
        backgroundColor: "#AEE637",
    },
    backIconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        justifyContent: "center",
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "black",
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
    statusBadge: {
        alignSelf: "flex-start",
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        marginBottom: 10,
    },
    statusText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 14,
    },
    reportId: {
        fontSize: 12,
        color: "#757575",
        marginBottom: 15,
    },
    imageContainer: {
        width: "100%",
        height: 250,
        borderRadius: 20,
        overflow: "hidden",
        marginBottom: 20,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    catImage: {
        width: "100%",
        height: "100%",
    },
    detailsCard: {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#1F2937",
        marginBottom: 15,
    },
    detailRow: {
        flexDirection: "row",
        marginBottom: 15,
        alignItems: "flex-start",
    },
    detailContent: {
        marginLeft: 12,
        flex: 1,
    },
    detailLabel: {
        fontSize: 12,
        color: "#9CA3AF",
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 15,
        color: "#1F2937",
        fontWeight: "500",
    },
    shelterCard: {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    shelterInfo: {
        flexDirection: "row",
        alignItems: "center",
    },
    shelterImage: {
        width: 80,
        height: 80,
        borderRadius: 15,
        marginRight: 15,
    },
    shelterDetails: {
        flex: 1,
    },
    shelterName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#1F2937",
        marginBottom: 4,
    },
    shelterAddress: {
        fontSize: 13,
        color: "#6B7280",
        marginBottom: 4,
    },
    shelterCapacity: {
        fontSize: 12,
        color: "#9CA3AF",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#Fdf7f0",
    },
    loadingText: {
        marginTop: 10,
        fontSize: 14,
        color: "#757575",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#Fdf7f0",
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: "#E53935",
        marginTop: 15,
        marginBottom: 20,
    },
    backButton: {
        backgroundColor: "#32CD32",
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 25,
    },
    backButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 14,
    },
});
