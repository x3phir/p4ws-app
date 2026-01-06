import React from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ScreenWrapperProps {
  children: React.ReactNode;
  backgroundImage?: any;
}

const ScreenWrapper = ({
  children,
  backgroundImage = { uri: "https://your-image-url.com/bg.jpg" },
}: ScreenWrapperProps) => {
  return (
    <ImageBackground
      source={backgroundImage}
      resizeMode="cover"
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <SafeAreaView edges={["top"]} style={styles.safeAreaTop} />
        {children}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  safeAreaTop: {
    flex: 0,
  },
});

export default ScreenWrapper;
