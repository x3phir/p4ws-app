import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface SectionProps {
  title: string;
  content?: string;
  children?: React.ReactNode;
}

const InfoSection = ({ title, content, children }: SectionProps) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.titleText}>{title}</Text>

      {content && <Text style={styles.contentText}>{content}</Text>}

      {children && <View style={styles.childrenContainer}>{children}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32, // Sesuaikan dengan mt-8 (8 * 4)
    paddingHorizontal: 24, // Sesuaikan dengan px-6 (6 * 4)
  },
  titleText: {
    fontSize: 20, // text-xl
    fontWeight: "900", // font-bold, dibikin lebih extra bold khas Rex ID
    color: "#111827", // text-gray-900
    marginBottom: 12, // mb-3
    letterSpacing: -0.5,
  },
  contentText: {
    fontSize: 14, // text-sm
    color: "#4B5563", // text-gray-600
    lineHeight: 22, // Memberi ruang antar baris teks agar tidak rapat
    fontWeight: "500",
    textAlign: "justify", // Opsional: agar teks rapi kanan-kiri
  },
  childrenContainer: {
    marginTop: 4, // Jarak sedikit jika ada elemen children (seperti HealthCard)
  },
});

export default InfoSection;
