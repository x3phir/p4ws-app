import { usePathname, useRouter } from "expo-router";
import { Globe, Home, LayoutDashboard, PawPrint } from "lucide-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BottomTab = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { id: "dashboard", Icon: LayoutDashboard, path: "/explore" },
    { id: "home", Icon: Home, path: "/" },
    { id: "globe", Icon: Globe, path: "/globe" },
    { id: "paw", Icon: PawPrint, path: "/shelter" },
  ];

  return (
    <View style={[styles.wrapper, { bottom: insets.bottom + 10 }]}>
      <View style={styles.container}>
        {tabs.map((tab) => {
          // Perbaikan Logika Aktif agar lebih akurat dengan folder group
          const isHomeActive =
            tab.path === "/" && (pathname === "/" || pathname === "/index");
          const active = pathname === tab.path || isHomeActive;

          return (
            <TouchableOpacity
              key={tab.id}
              // Gunakan push atau replace untuk perpindahan antar group layout
              onPress={() => router.push(tab.path as any)}
              activeOpacity={0.8}
              style={styles.tabItem}
            >
              <View
                style={[
                  styles.iconContainer,
                  active ? styles.activeIconContainer : null,
                ]}
              >
                <tab.Icon
                  color={active ? "black" : "white"}
                  size={active ? 28 : 24}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 24,
    right: 24,
    height: 80,
    justifyContent: "flex-end",
    zIndex: 99,
  },
  container: {
    flexDirection: "row",
    backgroundColor: "black",
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    paddingHorizontal: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  iconContainer: {
    padding: 10,
    borderRadius: 100,
  },
  activeIconContainer: {
    backgroundColor: "#B5E661",
    borderRadius: 30,
    padding: 14,
    elevation: 4,
  },
});

export default BottomTab;
