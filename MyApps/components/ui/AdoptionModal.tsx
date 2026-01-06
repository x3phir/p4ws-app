import React, { useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface AdoptionModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    petName: string;
}

const AdoptionModal = ({
    isVisible,
    onClose,
    onSubmit,
    petName,
}: AdoptionModalProps) => {
    const [reason, setReason] = useState("");
    const [contact, setContact] = useState("");
    const [hasYard, setHasYard] = useState(false);
    const [hasOtherPets, setHasOtherPets] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!reason || !contact) {
            alert("Mohon lengkapi semua data");
            return;
        }

        try {
            setLoading(true);
            await onSubmit({
                reason,
                contact,
                hasYard,
                hasOtherPets,
            });
            // Reset form
            setReason("");
            setContact("");
            setHasYard(false);
            setHasOtherPets(false);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.modalView}
                >
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.header}>
                            <Text style={styles.modalTitle}>Form Adopsi {petName}</Text>
                            <TouchableOpacity onPress={onClose}>
                                <Text style={styles.closeText}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.label}>Mengapa ingin mengadopsi {petName}?</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Ceritakan alasanmu..."
                            multiline
                            numberOfLines={4}
                            value={reason}
                            onChangeText={setReason}
                        />

                        <Text style={styles.label}>Nomor WhatsApp / Kontak</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="0812..."
                            keyboardType="phone-pad"
                            value={contact}
                            onChangeText={setContact}
                        />

                        <Text style={styles.label}>Lingkungan Rumah</Text>
                        <TouchableOpacity
                            style={[styles.checkboxRow, hasYard && styles.checkboxActive]}
                            onPress={() => setHasYard(!hasYard)}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.checkboxText}>
                                {hasYard ? "☑" : "☐"} Saya memiliki halaman rumah
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.checkboxRow, hasOtherPets && styles.checkboxActive]}
                            onPress={() => setHasOtherPets(!hasOtherPets)}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.checkboxText}>
                                {hasOtherPets ? "☑" : "☐"} Saya memelihara hewan lain
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={styles.submitText}>Ajukan Adopsi</Text>
                            )}
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalView: {
        backgroundColor: "white",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 24,
        height: "80%",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#1A1A1A",
    },
    closeText: {
        fontSize: 24,
        color: "#999",
    },
    label: {
        fontWeight: "bold",
        marginBottom: 8,
        marginTop: 12,
        color: "#333",
    },
    input: {
        borderWidth: 1,
        borderColor: "#DDD",
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        backgroundColor: "#FAFAFA",
    },
    textArea: {
        height: 100,
        textAlignVertical: "top",
    },
    checkboxRow: {
        padding: 12,
        borderWidth: 1,
        borderColor: "#DDD",
        borderRadius: 12,
        marginBottom: 8,
        backgroundColor: "#FAFAFA",
    },
    checkboxActive: {
        borderColor: "#1EB00E",
        backgroundColor: "#F0FFF0",
    },
    checkboxText: {
        fontSize: 16,
        color: "#333",
    },
    submitButton: {
        backgroundColor: "#1EB00E",
        padding: 16,
        borderRadius: 16,
        alignItems: "center",
        marginTop: 24,
        marginBottom: 20,
    },
    submitText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 18,
    },
});

export default AdoptionModal;
