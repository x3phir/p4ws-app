import PawsHeader from "@/components/ui/PawsHeader";
import { register as registerAPI } from "@/services/authService";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    // Validation
    if (!form.name || !form.email || !form.password) {
      Alert.alert("Error", "Nama, email, dan password harus diisi!");
      return;
    }

    if (form.password.length < 6) {
      Alert.alert("Error", "Password minimal 6 karakter!");
      return;
    }

    setIsLoading(true);
    try {
      const response = await registerAPI({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone || undefined,
      });

      Alert.alert(
        "Registrasi Berhasil",
        `Akun ${response.user.name} berhasil dibuat! Silakan login.`,
        [
          {
            text: "OK",
            onPress: () => router.replace("/login")
          }
        ]
      );
    } catch (error: any) {
      console.error("Register error:", error);
      const errorMessage = error.response?.data?.error || "Registrasi gagal. Silakan coba lagi.";
      Alert.alert("Registrasi Gagal", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // PERUBAHAN DI SINI: Mengatur edges agar warna background cream naik ke paling atas
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <PawsHeader />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formGroup}>
          <TextInput
            placeholder="Name"
            placeholderTextColor="#888"
            style={styles.input}
            value={form.name}
            onChangeText={(t) => setForm({ ...form, name: t })}
          />
          <TextInput
            placeholder="Phone No (Optional)"
            placeholderTextColor="#888"
            keyboardType="phone-pad"
            style={styles.input}
            value={form.phone}
            onChangeText={(t) => setForm({ ...form, phone: t })}
          />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#888"
            keyboardType="email-address"
            style={styles.input}
            value={form.email}
            autoCapitalize="none"
            onChangeText={(t) => setForm({ ...form, email: t })}
          />
          <TextInput
            placeholder="Password (min 6 characters)"
            placeholderTextColor="#888"
            secureTextEntry
            style={styles.input}
            value={form.password}
            onChangeText={(t) => setForm({ ...form, password: t })}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="black" />
          ) : (
            <Text style={styles.buttonText}>Sign up</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={styles.linkText}>Log in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#Fdf7f0" },
  scrollView: { flex: 1, paddingHorizontal: 30 },
  formGroup: { gap: 15, marginTop: 10 },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
    color: "black",
  },
  button: {
    width: "100%",
    backgroundColor: "#AEE637",
    borderRadius: 15,
    paddingVertical: 15,
    marginTop: 30,
    alignItems: "center",
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: { color: "black", fontWeight: "bold", fontSize: 18 },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
    marginBottom: 50,
  },
  footerText: { color: "black", fontSize: 16 },
  linkText: { color: "#8BC34A", fontWeight: "bold", fontSize: 16 },
});
