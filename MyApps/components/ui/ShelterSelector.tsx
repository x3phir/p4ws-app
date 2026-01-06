import React from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Shelter } from "@/types/report.types";

interface ShelterSelectorProps {
    shelters: Shelter[];
    selectedShelterId: string | null;
    onSelectShelter: (shelterId: string) => void;
}

const ShelterSelector: React.FC<ShelterSelectorProps> = ({
    shelters,
    selectedShelterId,
    onSelectShelter,
}) => {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
        >
            {shelters.map((shelter) => {
                const isSelected = selectedShelterId === shelter.id;
                const isDisabled = !shelter.isAvailable;

                return (
                    <TouchableOpacity
                        key={shelter.id}
                        style={[
                            styles.shelterCard,
                            isSelected && styles.shelterCardSelected,
                            isDisabled && styles.shelterCardDisabled,
                        ]}
                        onPress={() => !isDisabled && onSelectShelter(shelter.id)}
                        disabled={isDisabled}
                        activeOpacity={0.7}
                    >
                        {/* Status Badge */}
                        <View
                            style={[
                                styles.statusBadge,
                                {
                                    backgroundColor: shelter.isAvailable
                                        ? "#4CAF50"
                                        : "#E53935",
                                },
                            ]}
                        >
                            <View
                                style={[
                                    styles.statusDot,
                                    {
                                        backgroundColor: shelter.isAvailable ? "#81C784" : "#EF5350",
                                    },
                                ]}
                            />
                            <Text style={styles.statusText}>
                                {shelter.isAvailable ? "Available" : "Penuh"}
                            </Text>
                        </View>

                        {/* Shelter Image */}
                        <View style={styles.imageWrapper}>
                            <Image
                                source={{ uri: shelter.imageUrl }}
                                style={[
                                    styles.image,
                                    isDisabled && styles.imageDisabled,
                                ]}
                                resizeMode="cover"
                            />
                            {isSelected && (
                                <View style={styles.checkmarkOverlay}>
                                    <Feather name="check-circle" size={40} color="#32CD32" />
                                </View>
                            )}
                        </View>

                        {/* Shelter Name */}
                        <Text
                            style={[
                                styles.shelterName,
                                isDisabled && styles.shelterNameDisabled,
                            ]}
                            numberOfLines={1}
                        >
                            {shelter.name}
                        </Text>

                        {/* Capacity Info */}
                        {shelter.capacity && shelter.currentOccupancy !== undefined && (
                            <Text style={styles.capacityText}>
                                {shelter.currentOccupancy}/{shelter.capacity} kucing
                            </Text>
                        )}
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        paddingVertical: 10,
        gap: 15,
    },
    shelterCard: {
        width: 140,
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 12,
        borderWidth: 2,
        borderColor: "#E0E0E0",
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    shelterCardSelected: {
        borderColor: "#32CD32",
        borderWidth: 3,
        elevation: 6,
    },
    shelterCardDisabled: {
        opacity: 0.5,
        borderColor: "#BDBDBD",
    },
    statusBadge: {
        position: "absolute",
        top: 8,
        right: 8,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        zIndex: 10,
        gap: 4,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    statusText: {
        color: "white",
        fontSize: 10,
        fontWeight: "bold",
    },
    imageWrapper: {
        width: "100%",
        height: 100,
        borderRadius: 15,
        overflow: "hidden",
        marginBottom: 8,
        position: "relative",
    },
    image: {
        width: "100%",
        height: "100%",
    },
    imageDisabled: {
        opacity: 0.4,
    },
    checkmarkOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        justifyContent: "center",
        alignItems: "center",
    },
    shelterName: {
        fontSize: 14,
        fontWeight: "700",
        color: "#1F2937",
        marginBottom: 4,
        textAlign: "center",
    },
    shelterNameDisabled: {
        color: "#9E9E9E",
    },
    capacityText: {
        fontSize: 11,
        color: "#757575",
        textAlign: "center",
    },
});

export default ShelterSelector;
