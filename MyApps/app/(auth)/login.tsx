import { useAuth } from "@/context/AuthContext";
import { login as loginAPI } from "@/services/authService";
import { useRouter } from "expo-router";
import { Apple, Chrome, PawPrint } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "@/constants/theme";
import ScreenWrapper from "@/components/ui/ScreenWrapper";

const { height } = Dimensions.get("window");

export default function Login() {
  const router = useRouter();
  const { setIsLoggedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email dan password harus diisi!");
      return;
    }

    setIsLoading(true);
    try {
      const response = await loginAPI({ email, password });
      Alert.alert("Success", `Selamat datang, ${response.user.name}!`);
      setIsLoggedIn(true);
      router.replace("/(tabs)");
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.error || "Email atau password salah!";
      Alert.alert("Login Gagal", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenWrapper backgroundColor={Colors.primary}>
      <View style={styles.headerDecoration}>
        <PawPrint size={100} color="rgba(255,255,255,0.1)" style={{ position: 'absolute', top: 20, right: -20, transform: [{ rotate: '15deg' }] }} />
        <View style={styles.bubble1} />
      </View>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Log in</Text>
      </View>

      <View style={styles.contentCard}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.formGroup}>
            <TextInput
              placeholder="Email"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#11181C" />
            ) : (
              <Text style={styles.buttonText}>Masuk Sekarang</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Belum punya akun? </Text>
            <TouchableOpacity onPress={() => router.push("/register")}>
              <Text style={styles.linkText}>Daftar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerDecoration: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    zIndex: 0,
  },
  bubble1: {
    position: 'absolute',
    top: -50,
    left: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#1A1A1A",
    letterSpacing: -0.5,
  },
  contentCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 32,
    minHeight: height - 150,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  formGroup: {
    gap: 16,
  },
  input: {
    width: "100%",
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    fontWeight: "500",
    color: "#11181C",
  },
  button: {
    width: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 18,
    marginTop: 32,
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#11181C",
    fontWeight: "800",
    fontSize: 18,
  },
  socialSection: {
    alignItems: "center",
    marginTop: 40,
  },
  orText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9CA3AF",
    marginBottom: 20,
  },
  socialButtons: {
    flexDirection: "row",
    gap: 16,
  },
  socialIcon: {
    width: 60,
    height: 60,
    borderWidth: 1.5,
    borderColor: "#F3F4F6",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 40,
  },
  footerText: {
    color: "#6B7280",
    fontSize: 15,
    fontWeight: "500",
  },
  linkText: {
    color: Colors.primary,
    fontWeight: "800",
    fontSize: 15,
  },
});
