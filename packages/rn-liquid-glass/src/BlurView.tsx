import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import type { BlurViewProps } from './types';

export const BlurView: React.FC<BlurViewProps> = ({
  children,
  style,
  blurAmount = 10,
  blurType = 'light',
  overlayColor,
  overlayOpacity = 0.1,
}) => {
  return (
    <View
      style={[
        styles.blurContainer,
        {
          backgroundColor: overlayColor || `rgba(255, 255, 255, ${overlayOpacity})`,
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
