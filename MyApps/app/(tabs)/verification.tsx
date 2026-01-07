// MyApps/app/verification.tsx
import { submitVerification } from "@/services/userService";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { ArrowLeft, Camera, Shield } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VerificationScreen() {
  const router = useRouter();
  const [ktpImage, setKtpImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setKtpImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!ktpImage) {
      Alert.alert("Error", "Silakan upload foto KTP Anda");
      return;
    }

    Alert.alert(
      "Konfirmasi",
      "Pastikan foto KTP Anda jelas dan dapat terbaca. Lanjutkan?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Ya, Kirim",
          onPress: async () => {
            try {
              setLoading(true);
              await submitVerification(ktpImage);
              Alert.alert(
                "Berhasil!",
                "Permohonan verifikasi telah dikirim. Tim kami akan meninjau dalam 1-2 hari kerja.",
                [
                  {
                    text: "OK",
                    onPress: () => router.back(),
                  },
                ]
              );
            } catch (error: any) {
              Alert.alert("Error", error.message || "Gagal mengirim verifikasi");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verifikasi Akun</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Info Card */}
        <View style={styles.infoCard}>
          <Shield size={48} color="#1EB00E" />
          <Text style={styles.infoTitle}>Mengapa Perlu Verifikasi?</Text>
          <Text style={styles.infoText}>
            Verifikasi akun membantu kami memastikan keamanan dan kepercayaan
            dalam proses adopsi. Akun terverifikasi mendapat prioritas dalam
            pengajuan adopsi.
          </Text>
        </View>

        {/* Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Petunjuk:</Text>
          <View style={styles.instructionItem}>
            <Text style={styles.bullet}>1.</Text>
            <Text style={styles.instructionText}>
              Siapkan foto KTP asli Anda
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Text style={styles.bullet}>2.</Text>
            <Text style={styles.instructionText}>
              Pastikan foto jelas dan tidak blur
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Text style={styles.bullet}>3.</Text>
            <Text style={styles.instructionText}>
              Semua informasi pada KTP harus terbaca
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Text style={styles.bullet}>4.</Text>
            <Text style={styles.instructionText}>
              Proses verifikasi memakan waktu 1-2 hari kerja
            </Text>
          </View>
        </View>

        {/* Upload Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upload Foto KTP</Text>
          <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
            {ktpImage ? (
              <Image source={{ uri: ktpImage }} style={styles.uploadedImage} />
            ) : (
              <>
                <Camera size={48} color="#999" />
                <Text style={styles.uploadText}>Ketuk untuk Upload KTP</Text>
                <Text style={styles.uploadSubtext}>
                  Format: JPG, PNG (Max 5MB)
                </Text>
              </>
            )}
          </TouchableOpacity>

          {ktpImage && (
            <TouchableOpacity
              style={styles.changeImageBtn}
              onPress={pickImage}
            >
              <Text style={styles.changeImageText}>Ganti Foto</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, !ktpImage && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!ktpImage || loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitButtonText}>Kirim Verifikasi</Text>
          )}
        </TouchableOpacity>

        {/* Privacy Note */}
        <View style={styles.privacyNote}>
          <Text style={styles.privacyText}>
            🔒 Data Anda aman dan hanya digunakan untuk proses verifikasi
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5EFE6",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#F5EFE6",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  content: {
    padding: 24,
    paddingBottom: 100,
  },
  infoCard: {
    backgroundColor: "#F0FDF4",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#166534",
    marginTop: 12,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#166534",
    textAlign: "center",
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  instructionItem: {
    flexDirection: "row",
    marginBottom: 8,
  },
  bullet: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1EB00E",
    marginRight: 8,
    width: 20,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
  },
  uploadBox: {
    width: "100%",
    height: 200,
    borderWidth: 2,
    borderColor: "#DDD",
    borderStyle: "dashed",
    borderRadius: 16,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  uploadedImage: {
    width: "100%",
    height: "100%",
  },
  uploadText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginTop: 12,
  },
  uploadSubtext: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  changeImageBtn: {
    marginTop: 12,
    alignSelf: "center",
  },
  changeImageText: {
    color: "#1EB00E",
    fontWeight: "600",
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: "#1EB00E",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 12,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  privacyNote: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#FEF3C7",
    borderRadius: 12,
  },
  privacyText: {
    fontSize: 12,
    color: "#92400E",
    textAlign: "center",
  },
});