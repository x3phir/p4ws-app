import { usePathname, useRouter } from "expo-router";
import { Camera, Heart, Home, PawPrint, User } from "lucide-react-native";
import React, { useRef } from "react";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BottomTabCamera = () => {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const translateY = useRef(new Animated.Value(0)).current;

  // Fungsi navigasi
  const handleNavigation = (path: string) => {
    router.push(path as any);
  };

  // Animasi Melayang
  const onPressIn = () => {
    Animated.spring(translateY, {
      toValue: -20,
      useNativeDriver: true,
      friction: 4,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      friction: 4,
    }).start();
  };

  // Komponen Helper untuk Ikon dengan Highlight Bulat Hijau
  const TabIcon = ({
    path,
    Icon,
    isHome = false,
  }: {
    path: string;
    Icon: any;
    isHome?: boolean;
  }) => {
    // Cek apakah tab ini sedang aktif
    const isActive =
      pathname === path || (path === "/" && pathname === "/index");

    return (
      <View style={isHome ? styles.homeWrapper : styles.tabItem}>
        <Animated.View style={isHome ? { transform: [{ translateY }] } : null}>
          <TouchableOpacity
            style={[styles.iconContainer, isActive && styles.activeHighlight]}
            activeOpacity={0.8}
            onPressIn={isHome ? onPressIn : undefined}
            onPressOut={isHome ? onPressOut : undefined}
            onPress={() => handleNavigation(path)}
          >
            <Icon
              color={isActive ? "black" : "white"}
              size={isHome ? 28 : 24}
              strokeWidth={isActive ? 2.5 : 2}
            />
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom }]}>
      <View style={styles.container}>
        {/* 1. Heart */}
        <TabIcon path="/donation" Icon={Heart} />

        {/* 2. Kamera */}
        <TabIcon path="/lapor" Icon={Camera} />

        {/* 3. Home */}
        <TabIcon path="/" Icon={Home} isHome={true} />

        {/* 4. Paw  */}
        <TabIcon path="/adopt" Icon={PawPrint} />

        {/* 5. User / Profile */}
        <TabIcon path="/profile" Icon={User} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "black",
    height: 80,
    zIndex: 100,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: "100%",
    paddingHorizontal: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  homeWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  iconContainer: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  activeHighlight: {
    backgroundColor: "#B5E661", // Bulatan hijau muncul di sini
    elevation: 5,
    shadowColor: "#B5E661",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default BottomTabCamera;
