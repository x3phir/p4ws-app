import { Bell } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { getNotifications } from "@/services/notificationService";
import { Colors } from "@/constants/theme";

interface HeaderProps {
  name: string;
}

import { useNotifications } from "@/context/NotificationContext";

const Header = ({ name }: HeaderProps) => {
  const router = useRouter();
  const { unreadCount } = useNotifications();

  return (
    <View style={styles.headerWrapper}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.welcomeText}>Hello, {name}!</Text>
          <Text style={styles.subText}>Ready to help some cats? 🐾</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.iconContainer}
          onPress={() => router.push("/notifications" as any)}
        >
          <Bell color="#1a1a1a" size={24} />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount > 9 ? "9+" : unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1a1a1a",
    letterSpacing: -0.5,
  },
  subText: {
    fontSize: 14,
    color: "rgba(0,0,0,0.6)",
    marginTop: 2,
    fontWeight: "500",
  },
  iconContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    padding: 12,
    borderRadius: 20,
    position: 'relative',
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF4B4B',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#AEE637', // Match header bg
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default Header;
