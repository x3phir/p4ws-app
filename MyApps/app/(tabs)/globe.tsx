import Header from "@/components/ui/Header";
import ScreenWrapper from "@/components/ui/ScreenWrapper";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function GlobeScreen() {
  return (
    <ScreenWrapper backgroundImage={require("@/assets/images/BG-1.png")}>
      <Header name="Rex ID" />

      <View style={styles.mainContent}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          <View style={styles.innerWrapper}>
            <Text style={styles.sectionTitle}>Global Network</Text>
            <View style={styles.placeholderCard}>
              <Text style={styles.placeholderText}>
                Daftar Shelter Seluruh Dunia
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    backgroundColor: "#F5EFE6",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: -20,
    overflow: "hidden",
  },
  scrollContainer: { paddingBottom: 140 },
  innerWrapper: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 20,
  },
  placeholderCard: {
    height: 200,
    backgroundColor: "#E5E7EB",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: "#9CA3AF",
  },
  placeholderText: { color: "#6B7280" },
});
