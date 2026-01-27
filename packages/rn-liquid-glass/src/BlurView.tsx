import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BlurView as ExpoBlurView } from 'expo-blur';
import type { BlurViewProps } from './types';

export const BlurView: React.FC<BlurViewProps> = ({
  children,
  style,
  blurAmount = 10,
  blurType = 'light',
  overlayColor,
  overlayOpacity = 0.1,
  reducedTransparencyFallbackType = 'systemThinMaterial',
}) => {
  if (Platform.OS === 'ios') {
    return (
      <ExpoBlurView
        intensity={blurAmount / 100}
        tint={blurType}
        style={[styles.blurContainer, style]}
      >
        {children}
      </ExpoBlurView>
    );
  }

  // Android fallback
  return (
    <View
      style={[
        styles.blurContainer,
        {
          backgroundColor: `rgba(255, 255, 255, ${overlayOpacity})`,
          ...(overlayColor && {
            backgroundColor: overlayColor,
          }),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  blurContainer: {
    flex: 1,
  },
});
