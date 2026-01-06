import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const categories = ["Semua", "Kitten", "Dewasa", "Terdekat"];

const CategoryTabs = () => {
  const [active, setActive] = useState("Semua");

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {categories.map((cat) => {
          const isActive = active === cat;
          return (
            <TouchableOpacity
              key={cat}
              onPress={() => setActive(cat)}
              activeOpacity={0.8}
              style={[
                styles.tabButton,
                isActive ? styles.activeTab : styles.inactiveTab,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  isActive ? styles.activeText : styles.inactiveText,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    // Memberikan ruang vertikal agar tidak mepet dengan elemen atas/bawah
    marginVertical: 16,
  },
  scrollContainer: {
    paddingHorizontal: 24, // Sesuai dengan padding main content kamu
    alignItems: "center",
  },
  tabButton: {
    paddingHorizontal: 28, // px-8
    paddingVertical: 10, // py-2.5
    borderRadius: 50, // rounded-full
    marginRight: 12, // mr-3
    // Shadow halus untuk tombol
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  activeTab: {
    backgroundColor: "#F6D061", // Kuning aksen
  },
  inactiveTab: {
    backgroundColor: "#FFFFFF",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  activeText: {
    color: "#FFFFFF",
  },
  inactiveText: {
    color: "#9CA3AF", // gray-400
  },
});

export default CategoryTabs;
