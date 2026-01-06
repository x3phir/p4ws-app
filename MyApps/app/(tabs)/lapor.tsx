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
import Svg, { Path } from "react-native-svg";
import ShelterSelector from "@/components/ui/ShelterSelector";
import { Shelter, CatCondition } from "@/types/report.types";
import { getAllShelters } from "@/services/shelterService";
import { createReport } from "@/services/reportService";


const { width } = Dimensions.get("window");

// --- HEADER COMPONENT ---
const LaporHeader = () => {
  const headerHeight = 280;
  const pathData = `M0 0 H${width} V${headerHeight} Q${width / 2} ${headerHeight - 60
    } 0 ${headerHeight} Z`;

  return (
    <View style={styles.headerContainer}>
      <Svg
        height={headerHeight}
        width={width}
        viewBox={`0 0 ${width} ${headerHeight}`}
        style={styles.svgBackground}
      >
        <Path fill="#AEE637" d={pathData} />
      </Svg>
      <View style={styles.headerContent}>
        <View style={styles.topBar}>
          <Text style={styles.topBarText}>
            Lapor <Text style={{ fontWeight: "900" }}>Kucing</Text>
          </Text>
          <Image
            source={{
              uri: "https://i.pinimg.com/736x/8b/16/7a/8b167af653c23999696b7410a2263997.jpg",
            }}
            style={styles.smallAvatar}
          />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.bigTitle}>LAPOR</Text>
          <Text style={styles.subTitle}>Kucing Terlantar</Text>
        </View>
        <View style={styles.catIllustration}>
          <Cat size={140} color="black" fill="black" />
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
      Alert.alert(
        "Data Belum Lengkap",
        "Rex ID, mohon isi lokasi kejadian dulu ya!"
      );
      return;
    }

    if (!selectedCondition) {
      Alert.alert(
        "Data Belum Lengkap",
        "Rex ID, mohon pilih kondisi kucing dulu ya!"
      );
      return;
    }

    if (!selectedImage) {
      Alert.alert(
        "Data Belum Lengkap",
        "Rex ID, mohon upload foto kucing dulu ya!"
      );
      return;
    }

    if (!selectedShelterId) {
      Alert.alert(
        "Shelter Belum Dipilih",
        "Rex ID, mohon pilih shelter tujuan dulu ya!"
      );
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
        "Terima kasih Rex ID. Laporan kamu sudah masuk ke sistem dan tim penyelamat akan segera meluncur!",
        [
          {
            text: "Lihat Detail",
            onPress: () => {
              // Reset form
              setLocation("");
              setSelectedCondition(null);
              setSelectedImage(null);
              setDescription("");
              setSelectedShelterId(null);

              // Navigate to report detail
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
    <View style={styles.mainContainer}>
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
              multiline={false}
            />
          </View>

          {/* 2. KONDISI */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>2. Kondisi Kucing</Text>
            <View style={styles.conditionContainer}>
              {(["sehat", "terluka", "sakit"] as CatCondition[]).map((cond) => (
                <TouchableOpacity
                  key={cond}
                  style={[
                    styles.conditionBtn,
                    {
                      backgroundColor:
                        cond === "sehat"
                          ? "#32CD32"
                          : cond === "terluka"
                            ? "#E4C725"
                            : "#E53935",
                      opacity: selectedCondition === cond ? 1 : 0.3,
                    },
                  ]}
                  onPress={() => setSelectedCondition(cond)}
                >
                  <Text style={styles.conditionText}>
                    {cond.charAt(0).toUpperCase() + cond.slice(1)}
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
                  <Feather name="camera" size={24} color="#999" />
                  <Text style={styles.uploadText}>Ketuk untuk Ambil Foto</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* 4. PILIH SHELTER */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>4. Pilih Shelter Tujuan</Text>
            {isLoadingShelters ? (
              <ActivityIndicator size="small" color="#32CD32" />
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
              <ActivityIndicator color="#AEE637" />
            ) : (
              <Text style={styles.submitButtonText}>KIRIM LAPORAN</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#Fdf7f0" },
  headerContainer: {
    height: 280,
    width: width,
    position: "relative",
    marginBottom: 10,
  },
  svgBackground: { position: "absolute", top: 0, left: 0 },
  headerContent: {
    position: "absolute",
    width: "100%",
    paddingHorizontal: 25,
    paddingTop: 50,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  topBarText: { fontSize: 18, color: "black" },
  smallAvatar: {
    width: 35,
    height: 35,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "white",
  },
  titleContainer: { marginTop: 10 },
  bigTitle: {
    fontSize: 60,
    fontWeight: "bold",
    color: "black",
    lineHeight: 65,
  },
  subTitle: { fontSize: 24, fontWeight: "400", color: "black" },
  catIllustration: {
    position: "absolute",
    bottom: 50,
    right: -20,
    transform: [{ scaleX: -1 }, { rotate: "-10deg" }],
    opacity: 0.9,
  },

  formContainer: { paddingHorizontal: 25 },
  inputGroup: { marginBottom: 25 },
  label: { fontSize: 16, fontWeight: "bold", color: "black", marginBottom: 10 },

  locationInput: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    fontSize: 14,
    color: "black",
    borderWidth: 1,
    borderColor: "#ddd",
  },

  conditionContainer: { flexDirection: "row", gap: 10 },
  conditionBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  conditionText: { color: "white", fontWeight: "bold", fontSize: 13 },

  uploadBox: {
    width: "100%",
    height: 150,
    borderWidth: 2,
    borderColor: "#ccc",
    borderStyle: "dashed",
    borderRadius: 15,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  uploadedImage: { width: "100%", height: "100%" },
  uploadText: { color: "#999", fontSize: 14, marginTop: 5 },

  textArea: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    height: 120,
    textAlignVertical: "top",
    fontSize: 14,
    color: "black",
    borderWidth: 1,
    borderColor: "#ddd",
  },

  submitButton: {
    backgroundColor: "black",
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "#AEE637",
    fontWeight: "900",
    fontSize: 16,
    letterSpacing: 1,
  },
});
