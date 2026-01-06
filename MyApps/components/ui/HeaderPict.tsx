import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ProfileHeaderProps {
  name: string;
  badgeTitle: string;
  avatarUrl: string;
}

const ProfileHeader = ({ name, badgeTitle, avatarUrl }: ProfileHeaderProps) => {
  const router = useRouter();

  return (
    <View style={styles.outerContainer}>
      <View style={styles.headerCard}>
        {/* Row Atas: Back Button & Badge */}
        <View style={styles.topRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={24} color="#1A1A1A" />
          </TouchableOpacity>

          <View style={styles.badgeContainer}>
            <View style={styles.dot} />
            <Text style={styles.badgeText}>{badgeTitle}</Text>
          </View>
        </View>

        {/* Info Profil */}
        <View style={styles.profileContent}>
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            <View style={styles.editIconBadge}>
              <Feather name="edit-2" size={12} color="white" />
            </View>
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.greetingText}>Hello,</Text>
            <Text style={styles.fullNameText} numberOfLines={1}>
              {name}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 50 : 30,
    paddingBottom: 10,
  },
  headerCard: {
    backgroundColor: "#B5E661",
    borderRadius: 32,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    width: 45,
    height: 45,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#B5E661",
    marginRight: 6,
  },
  badgeText: {
    color: "#B5E661",
    fontWeight: "800",
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  profileContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 75,
    height: 75,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.6)",
  },
  editIconBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#1A1A1A",
    width: 24,
    height: 24,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#B5E661",
  },
  textContainer: {
    marginLeft: 16,
    flex: 1,
  },
  greetingText: {
    fontSize: 14,
    color: "rgba(0,0,0,0.5)",
    fontWeight: "700",
  },
  fullNameText: {
    fontSize: 22,
    fontWeight: "900",
    color: "#1A1A1A",
  },
});

export default ProfileHeader;
