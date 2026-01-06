import { useAuth } from "@/app/context/AuthContext";
import PawsHeader from "@/components/ui/PawsHeader";
import { useRouter } from "expo-router";
import { Apple, Chrome } from "lucide-react-native";
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
// Import SafeAreaView tetap dari sini
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const router = useRouter();
  const { setIsLoggedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // 1. CEK AKUN ADMIN
    if (email === "admin@rexid.com" && password === "admin123") {
      Alert.alert("Success", "Welcome Admin Rex ID!");
      setIsLoggedIn(true);
    }
    // 2. CEK USER BARU (user@example.com)
    else if (email === "user@example.com" && password === "wewe123") {
      Alert.alert("Success", "Halo Rex ID, selamat datang!");
      setIsLoggedIn(true);
    } else {
      Alert.alert("Error", "Email atau Password salah!");
    }
  };

  return (
    // DISINI PERUBAHANNYA: Tambahkan edges tanpa 'top'
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <PawsHeader />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formGroup}>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#888"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log in</Text>
        </TouchableOpacity>

        <View style={styles.socialSection}>
          <Text style={styles.orText}>Or</Text>
          <View style={styles.socialButtons}>
            <TouchableOpacity style={styles.socialIcon}>
              <Apple color="black" size={32} fill="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon}>
              <Chrome color="black" size={32} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/register")}>
            <Text style={styles.linkText}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#Fdf7f0" },
  scrollView: { flex: 1, paddingHorizontal: 30 },
  formGroup: { gap: 15, marginTop: 20 },
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
    marginTop: 40,
    alignItems: "center",
    elevation: 3,
  },
  buttonText: { color: "black", fontWeight: "bold", fontSize: 18 },
  socialSection: { alignItems: "center", marginTop: 40 },
  orText: { fontSize: 16, fontWeight: "500", marginBottom: 15, color: "black" },
  socialButtons: { flexDirection: "row", gap: 20 },
  socialIcon: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 12,
    padding: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 50,
    marginBottom: 50,
  },
  footerText: { color: "black", fontSize: 16 },
  linkText: { color: "#8BC34A", fontWeight: "bold", fontSize: 16 },
});
