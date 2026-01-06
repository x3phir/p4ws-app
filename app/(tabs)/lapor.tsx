import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { Cat } from "lucide-react-native";
import React, { useState } from "react";
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

const { width } = Dimensions.get("window");

// --- HEADER COMPONENT ---
const LaporHeader = () => {
  const headerHeight = 280;
  const pathData = `M0 0 H${width} V${headerHeight} Q${width / 2} ${
    headerHeight - 60
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
  const [selectedCondition, setSelectedCondition] = useState<string | null>(
    null
  );
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [locationName, setLocationName] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // --- FUNGSI AMBIL LOKASI ---
  const handleGetLocation = async () => {
    setIsLoadingLocation(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Izin Ditolak",
          "Rex ID, kami butuh izin GPS untuk tahu lokasi kucingnya!"
        );
        setIsLoadingLocation(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      let address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (address.length > 0) {
        const addr = address[0];
        const fullAddress = `${addr.street || "Jalan tidak terdeteksi"}, ${
          addr.city || addr.region
        }`;
        setLocationName(fullAddress);
      }
    } catch (error) {
      Alert.alert("Error", "Gagal mengambil lokasi. Pastikan GPS kamu aktif!");
    } finally {
      setIsLoadingLocation(false);
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
  const handleSubmit = () => {
    // Validasi data wajib
    if (!locationName || !selectedCondition || !selectedImage) {
      Alert.alert(
        "Data Belum Lengkap",
        "Rex ID, mohon isi lokasi, kondisi, dan foto kucingnya dulu ya!"
      );
      return;
    }

    // Pesan sukses dan reset form
    Alert.alert(
      "Laporan Terkirim!",
      "Terima kasih Rex ID. Laporan kamu sudah masuk ke sistem dan tim penyelamat akan segera meluncur!",
      [
        {
          text: "Oke Mantap",
          onPress: () => {
            // Reset semua state ke awal
            setLocationName(null);
            setSelectedCondition(null);
            setSelectedImage(null);
            setDescription("");

            router.replace("/(tabs)");
          },
        },
      ]
    );
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
            <Text style={styles.label}>1. Lokasi Lapor</Text>
            {locationName && (
              <View style={styles.locationDisplayBox}>
                <Feather name="map-pin" size={16} color="#32CD32" />
                <Text style={styles.locationDisplayText}>{locationName}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.locationButton,
                locationName && styles.locationButtonOutline,
              ]}
              onPress={handleGetLocation}
              disabled={isLoadingLocation}
            >
              {isLoadingLocation ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Text
                    style={[
                      styles.locationButtonText,
                      locationName && styles.locationButtonTextOutline,
                    ]}
                  >
                    {locationName ? "Perbarui Lokasi" : "Ambil Lokasi"}
                  </Text>
                  <Feather
                    name="navigation"
                    size={18}
                    color={locationName ? "#32CD32" : "white"}
                    style={{ marginLeft: 10 }}
                  />
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* 2. KONDISI */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>2. Kondisi Kucing</Text>
            <View style={styles.conditionContainer}>
              {["sehat", "terluka", "sakit"].map((cond) => (
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

          {/* 4. DESKRIPSI */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>4. Deskripsi Lengkap</Text>
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
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>KIRIM LAPORAN</Text>
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

  locationDisplayBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    padding: 12,
    borderRadius: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#C8E6C9",
  },
  locationDisplayText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#2E7D32",
    fontWeight: "500",
    flex: 1,
  },
  locationButton: {
    backgroundColor: "#32CD32",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 25,
    alignSelf: "flex-start",
    paddingHorizontal: 25,
    elevation: 2,
  },
  locationButtonOutline: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#32CD32",
    elevation: 0,
  },
  locationButtonText: { color: "white", fontWeight: "bold", fontSize: 14 },
  locationButtonTextOutline: { color: "#32CD32" },

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
  submitButtonText: {
    color: "#AEE637",
    fontWeight: "900",
    fontSize: 16,
    letterSpacing: 1,
  },
});
