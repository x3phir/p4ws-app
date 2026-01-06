import React, { useEffect, useRef, useState } from "react"; // 1. Tambahkan useState
import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface DonationModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

// Kita buat datanya dalam bentuk angka murni agar mudah diolah
const nominalOptions = [
  { label: "Rp5.000", value: "5000" },
  { label: "Rp15.000", value: "15000" },
  { label: "Rp25.000", value: "25000" },
  { label: "Rp50.000", value: "50000" },
];

const DonationModal = ({ isVisible, onClose }: DonationModalProps) => {
  // 2. State untuk menampung nominal
  const [amount, setAmount] = useState("");
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        damping: 20,
        stiffness: 100,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start();
      // Reset input saat modal ditutup (opsional)
      // setAmount("");
    }
  }, [isVisible]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 5,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) translateY.setValue(gestureState.dy);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 150 || gestureState.vy > 0.5) {
          onClose();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <Pressable style={styles.overlay} onPress={onClose} />

        <Animated.View
          style={[styles.sheet, { transform: [{ translateY }] } as ViewStyle]}
          {...panResponder.panHandlers}
        >
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>

          <Text style={styles.title}>Pilih Nominal Donasi</Text>

          <View style={styles.nominalGrid}>
            {nominalOptions.map((item, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                style={[
                  styles.nominalButton,
                  // 3. Highlight jika nominal dipilih
                  amount === item.value && styles.selectedButton,
                ]}
                onPress={() => setAmount(item.value)} // 4. Logika Auto-fill
              >
                <Text style={styles.nominalText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.label}>Nominal Lainnya</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.rpText}>Rp</Text>
              <TextInput
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor="#999"
                style={styles.textInput}
                value={amount} // 5. Value terikat ke state
                onChangeText={(text) => setAmount(text)} // Bisa input manual juga
              />
            </View>
            <Text style={styles.minHint}>Min. donasi sebesar Rp1.000</Text>
          </View>

          <TouchableOpacity
            style={[
              styles.confirmButton,
              { opacity: parseInt(amount) >= 1000 ? 1 : 0.5 }, // Feedback tombol
            ]}
            disabled={parseInt(amount) < 1000 || !amount}
            onPress={() => {
              alert(`Melanjutkan donasi Rp ${amount}`);
              onClose();
            }}
          >
            <Text style={styles.confirmButtonText}>Lanjutkan Pembayaran</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "flex-end" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    backgroundColor: "#F5EFE6",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 24,
    paddingBottom: 40,
    minHeight: 520,
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  handleContainer: { alignItems: "center", paddingVertical: 15 },
  handle: {
    width: 45,
    height: 5,
    backgroundColor: "#D1D5DB",
    borderRadius: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 25,
  },
  nominalGrid: { gap: 10 },
  nominalButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  selectedButton: {
    borderColor: "#1EB00E",
    borderWidth: 2,
    backgroundColor: "#F0FFF0", // Warna sedikit hijau saat dipilih
  },
  nominalText: { fontSize: 18, fontWeight: "800", color: "#333" },
  inputSection: { marginTop: 20 },
  label: {
    fontSize: 14,
    fontWeight: "800",
    color: "#666",
    marginBottom: 10,
    marginLeft: 5,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E5E7EB",
    borderRadius: 18,
    paddingHorizontal: 20,
    height: 55,
  },
  rpText: { fontWeight: "900", color: "#333", fontSize: 16, marginRight: 10 },
  textInput: { flex: 1, fontWeight: "700", fontSize: 16, color: "#333" },
  minHint: { fontSize: 10, color: "#999", marginTop: 8, marginLeft: 5 },
  confirmButton: {
    backgroundColor: "#1EB00E",
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 30,
    elevation: 5,
  },
  confirmButtonText: { color: "white", fontSize: 16, fontWeight: "900" },
});

export default DonationModal;
