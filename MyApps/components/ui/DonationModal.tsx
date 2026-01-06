import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
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

interface DonationModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (amount: number, proofUri: string) => Promise<void>;
}

const DonationModal = ({ isVisible, onClose, onSubmit }: DonationModalProps) => {
  const [amount, setAmount] = useState("");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [proofUri, setProofUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const presetAmounts = [10000, 25000, 50000, 100000];

  useEffect(() => {
    if (!isVisible) {
      setAmount("");
      setSelectedAmount(null);
      setProofUri(null);
      setLoading(false);
    }
  }, [isVisible]);

  const handlePresetPress = (value: number) => {
    setSelectedAmount(value);
    setAmount(value.toString());
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setProofUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!amount || !proofUri) return;
    try {
      setLoading(true);
      await onSubmit(parseInt(amount), proofUri);
      onClose(); // Parent handles closure usually, but good to ensure
    } catch (error) {
      console.error(error);
      alert("Gagal mengirim donasi.");
    } finally {
      setLoading(false);
    }
  };

  const isValid = parseInt(amount) >= 1000 && !!proofUri;

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
              <Text style={styles.title}>Masukkan Nominal Donasi</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Pilih Nominal</Text>
            <View style={styles.presetContainer}>
              {presetAmounts.map((preset) => (
                <TouchableOpacity
                  key={preset}
                  style={[
                    styles.presetButton,
                    selectedAmount === preset && styles.presetButtonActive,
                  ]}
                  onPress={() => handlePresetPress(preset)}
                >
                  <Text
                    style={[
                      styles.presetText,
                      selectedAmount === preset && styles.presetTextActive,
                    ]}
                  >
                    Rp {preset.toLocaleString("id-ID")}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Atau Input Manual (Min. Rp 1.000)</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.currencyPrefix}>Rp</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="0"
                value={amount}
                onChangeText={(text) => {
                  setAmount(text);
                  setSelectedAmount(null);
                }}
              />
            </View>

            <Text style={styles.label}>Bukti Pembayaran</Text>
            <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
              {proofUri ? (
                <Image source={{ uri: proofUri }} style={styles.previewImage} />
              ) : (
                <View style={styles.uploadPlaceholder}>
                  <Ionicons name="cloud-upload-outline" size={32} color="#666" />
                  <Text style={styles.uploadText}>Upload Foto Bukti Transfer</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.confirmButton,
                { opacity: isValid ? 1 : 0.5 },
              ]}
              disabled={!isValid || loading}
              onPress={handleSubmit}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.confirmButtonText}>Kirim Donasi</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: "85%", // Increased height
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
    marginTop: 12,
  },
  presetContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 12,
  },
  presetButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DDD",
    backgroundColor: "#FAFAFA",
  },
  presetButtonActive: {
    borderColor: "#1EB00E",
    backgroundColor: "#F0FFF0",
  },
  presetText: {
    color: "#333",
    fontWeight: "600",
  },
  presetTextActive: {
    color: "#1EB00E",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: "#FAFAFA",
  },
  currencyPrefix: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  uploadButton: {
    height: 200,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    marginBottom: 24,
    overflow: 'hidden',
  },
  uploadPlaceholder: {
    alignItems: 'center',
  },
  uploadText: {
    color: '#666',
    marginTop: 8,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  confirmButton: {
    backgroundColor: "#1EB00E",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  confirmButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default DonationModal;
