import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { TimelineEntry } from "@/types/report.types";

interface ReportTimelineProps {
    timeline: TimelineEntry[];
}

const ReportTimeline: React.FC<ReportTimelineProps> = ({ timeline }) => {
    const formatDate = (date: Date) => {
        const d = new Date(date);
        const day = d.getDate().toString().padStart(2, "0");
        const month = (d.getMonth() + 1).toString().padStart(2, "0");
        const year = d.getFullYear();
        const hours = d.getHours().toString().padStart(2, "0");
        const minutes = d.getMinutes().toString().padStart(2, "0");
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    const getIconName = (icon?: string): any => {
        if (!icon) return "circle";
        return icon as any;
    };

    const getIconColor = (icon?: string) => {
        if (icon === 'x-circle') return "#EF4444";
        return "#32CD32";
    };

    const getIconBgColor = (icon?: string) => {
        if (icon === 'x-circle') return "#FEE2E2";
        return "#E8F5E9";
    };

    // Sort timeline by createdAt (newest first)
    const sortedTimeline = [...timeline].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Timeline Laporan</Text>
            <View style={styles.timelineContainer}>
                {sortedTimeline.map((entry, index) => (
                    <View key={entry.id} style={styles.timelineItem}>
                        {/* Timeline Line */}
                        {index < sortedTimeline.length - 1 && (
                            <View style={styles.timelineLine} />
                        )}

                        {/* Icon Circle */}
                        <View style={[
                            styles.iconCircle,
                            {
                                borderColor: getIconColor(entry.icon),
                                backgroundColor: getIconBgColor(entry.icon)
                            }
                        ]}>
                            <Feather
                                name={getIconName(entry.icon)}
                                size={16}
                                color={getIconColor(entry.icon)}
                            />
                        </View>

                        {/* Content */}
                        <View style={styles.contentContainer}>
                            <Text style={styles.activity}>{entry.activity}</Text>
                            {entry.description && (
                                <Text style={styles.description}>{entry.description}</Text>
                            )}
                            <Text style={styles.timestamp}>
                                {formatDate(entry.createdAt)}
                            </Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 20,
        marginTop: 20,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#1F2937",
        marginBottom: 15,
    },
    timelineContainer: {
        paddingLeft: 10,
    },
    timelineItem: {
        flexDirection: "row",
        marginBottom: 20,
        position: "relative",
    },
    timelineLine: {
        position: "absolute",
        left: 15,
        top: 35,
        bottom: -20,
        width: 2,
        backgroundColor: "#E0E0E0",
    },
    iconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#E8F5E9",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
        borderWidth: 2,
        borderColor: "#32CD32",
    },
    contentContainer: {
        flex: 1,
        paddingTop: 2,
    },
    activity: {
        fontSize: 15,
        fontWeight: "700",
        color: "#1F2937",
        marginBottom: 4,
    },
    description: {
        fontSize: 13,
        color: "#6B7280",
        marginBottom: 6,
        lineHeight: 18,
    },
    timestamp: {
        fontSize: 12,
        color: "#9CA3AF",
    },
});

export default ReportTimeline;
