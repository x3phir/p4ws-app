import PawsHeader from "@/components/ui/PawsHeader";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
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

  const handleRegister = () => {
    Alert.alert("Success", `Akun ${form.name} berhasil dibuat!`);
    router.push("/login");
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
            onChangeText={(t) => setForm({ ...form, name: t })}
          />
          <TextInput
            placeholder="Phone No"
            placeholderTextColor="#888"
            keyboardType="phone-pad"
            style={styles.input}
          />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#888"
            keyboardType="email-address"
            style={styles.input}
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry
            style={styles.input}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Sign up</Text>
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
