import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Cat } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ShelterSelector from "@/components/ui/ShelterSelector";
import { Shelter, CatCondition } from "@/types/report.types";
import { getAllShelters } from "@/services/shelterService";
import { createReport } from "@/services/reportService";
import { Colors } from "@/constants/theme";
import Header from "@/components/ui/Header";
import ScreenWrapper from "@/components/ui/ScreenWrapper";

const { width } = Dimensions.get("window");

const LaporHeader = () => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerContent}>
        <View style={styles.titleContainer}>
          <Text style={styles.bigTitle}>LAPOR</Text>
          <Text style={styles.subTitle}>Kucing Terlantar</Text>
        </View>
        <View style={styles.catIllustration}>
          <Cat size={120} color="#1A1A1A" fill="#1A1A1A" />
        </View>
      </View>
    </View>
  );
};

export default function Lapor() {
  const router = useRouter();

  // --- STATE FORM ---
  const [selectedCondition, setSelectedCondition] = useState<CatCondition | null>(
    null
  );
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [location, setLocation] = useState<string>("");
  const [description, setDescription] = useState("");
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [selectedShelterId, setSelectedShelterId] = useState<string | null>(null);
  const [isLoadingShelters, setIsLoadingShelters] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load shelters on mount
  useEffect(() => {
    loadShelters();
  }, []);

  const loadShelters = async () => {
    setIsLoadingShelters(true);
    try {
      const shelterData = await getAllShelters();
      setShelters(shelterData);
    } catch (error) {
      Alert.alert("Error", "Gagal memuat data shelter");
    } finally {
      setIsLoadingShelters(false);
    }
  };

  // --- FUNGSI AMBIL FOTO ---
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // --- FUNGSI KIRIM LAPORAN ---
  const handleSubmit = async () => {
    // Validasi data wajib
    if (!location.trim()) {
      Alert.alert("Data Belum Lengkap", "Mohon isi lokasi kejadian dulu ya!");
      return;
    }
    if (!selectedCondition) {
      Alert.alert("Data Belum Lengkap", "Mohon pilih kondisi kucing dulu ya!");
      return;
    }
    if (!selectedImage) {
      Alert.alert("Data Belum Lengkap", "Mohon upload foto kucing dulu ya!");
      return;
    }
    if (!selectedShelterId) {
      Alert.alert("Shelter Belum Dipilih", "Mohon pilih shelter tujuan dulu ya!");
      return;
    }

    setIsSubmitting(true);
    try {
      const newReport = await createReport({
        location: location.trim(),
        condition: selectedCondition,
        imageUri: selectedImage,
        description: description.trim(),
        shelterId: selectedShelterId,
      });

      Alert.alert(
        "Laporan Terkirim!",
        "Terima kasih. Laporan kamu sudah masuk ke sistem dan tim penyelamat akan segera meluncur!",
        [
          {
            text: "Lihat Detail",
            onPress: () => {
              setLocation("");
              setSelectedCondition(null);
              setSelectedImage(null);
              setDescription("");
              setSelectedShelterId(null);
              router.push(`/report/${newReport.id}`);
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Gagal mengirim laporan. Silakan coba lagi.");
      console.error("Error creating report:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenWrapper backgroundColor={Colors.primary}>
      <Header name="Lapor" />

      <View style={styles.contentCard}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 150 }}
        >
          <LaporHeader />

          <View style={styles.formContainer}>
            {/* 1. LOKASI */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>1. Lokasi Kejadian</Text>
              <TextInput
                style={styles.locationInput}
                placeholder="Contoh: Jl. Sudirman No. 123, Jakarta Pusat"
                placeholderTextColor="#999"
                value={location}
                onChangeText={setLocation}
              />
            </View>

            {/* 2. KONDISI */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>2. Kondisi Kucing</Text>
              <View style={styles.conditionContainer}>
                {(["SEHAT", "TERLUKA", "SAKIT"] as CatCondition[]).map((cond) => (
                  <TouchableOpacity
                    key={cond}
                    style={[
                      styles.conditionBtn,
                      {
                        backgroundColor:
                          cond === "SEHAT"
                            ? "#10B981"
                            : cond === "TERLUKA"
                              ? "#F59E0B"
                              : "#EF4444",
                        opacity: selectedCondition === cond ? 1 : 0.4,
                      },
                    ]}
                    onPress={() => setSelectedCondition(cond)}
                  >
                    <Text style={styles.conditionText}>
                      {cond.charAt(0) + cond.slice(1).toLowerCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* 3. UNGGAH FOTO */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>3. Unggah Foto</Text>
              <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
                {selectedImage ? (
                  <Image
                    source={{ uri: selectedImage }}
                    style={styles.uploadedImage}
                  />
                ) : (
                  <>
                    <Feather name="camera" size={24} color="#9BA3AF" />
                    <Text style={styles.uploadText}>Ketuk untuk Ambil Foto</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* 4. PILIH SHELTER */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>4. Pilih Shelter Tujuan</Text>
              {isLoadingShelters ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <ShelterSelector
                  shelters={shelters}
                  selectedShelterId={selectedShelterId}
                  onSelectShelter={setSelectedShelterId}
                />
              )}
            </View>

            {/* 5. DESKRIPSI */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>5. Deskripsi Lengkap (Opsional)</Text>
              <TextInput
                style={styles.textArea}
                multiline={true}
                placeholder="Tulis ciri-ciri kucing atau detail lokasi..."
                placeholderTextColor="#999"
                value={description}
                onChangeText={setDescription}
              />
            </View>

            {/* TOMBOL SUBMIT */}
            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color={Colors.primary} />
              ) : (
                <Text style={styles.submitButtonText}>KIRIM LAPORAN</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 120,
    width: width,
    marginBottom: 10,
  },
  headerContent: {
    paddingHorizontal: 25,
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: { marginTop: 10 },
  bigTitle: {
    fontSize: 40,
    fontWeight: "900",
    color: "#1A1A1A",
    lineHeight: 45,
    letterSpacing: -1,
  },
  subTitle: { fontSize: 18, fontWeight: "600", color: "#1A1A1A", opacity: 0.7 },
  catIllustration: {
    opacity: 0.9,
    marginRight: -10,
  },
  contentCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingTop: 10,
  },
  formContainer: { paddingHorizontal: 25 },
  inputGroup: { marginBottom: 25 },
  label: { fontSize: 15, fontWeight: "800", color: "#1A1A1A", marginBottom: 12 },
  locationInput: {
    backgroundColor: "#F9FAFB",
    borderRadius: 15,
    padding: 16,
    fontSize: 14,
    color: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  conditionContainer: { flexDirection: "row", gap: 10 },
  conditionBtn: {
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 12,
  },
  conditionText: { color: "white", fontWeight: "800", fontSize: 13 },
  uploadBox: {
    width: "100%",
    height: 150,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
    borderRadius: 15,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  uploadedImage: { width: "100%", height: "100%" },
  uploadText: { color: "#9BA3AF", fontSize: 14, marginTop: 8, fontWeight: '600' },
  textArea: {
    backgroundColor: "#F9FAFB",
    borderRadius: 15,
    padding: 16,
    height: 120,
    textAlignVertical: "top",
    fontSize: 14,
    color: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  submitButton: {
    backgroundColor: "#1A1A1A",
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: Colors.primary,
    fontWeight: "900",
    fontSize: 16,
    letterSpacing: 1,
  },
});
