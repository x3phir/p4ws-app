import React from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ScreenWrapperProps {
  children: React.ReactNode;
  backgroundImage?: any;
  backgroundColor?: string;
}

const ScreenWrapper = ({
  children,
  backgroundImage,
  backgroundColor,
}: ScreenWrapperProps) => {
  const content = (
    <View style={[styles.container, backgroundColor ? { backgroundColor } : null]}>
      <SafeAreaView edges={["top"]} style={styles.safeAreaTop} />
      {children}
    </View>
  );

  if (backgroundImage) {
    return (
      <ImageBackground
        source={backgroundImage}
        resizeMode="cover"
        style={styles.backgroundImage}
      >
        {content}
      </ImageBackground>
    );
  }

  return content;
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
