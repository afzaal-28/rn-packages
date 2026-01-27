import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import type { GlassViewProps } from './types';

export const GlassView: React.FC<GlassViewProps> = ({
  children,
  style,
  blurAmount = 10,
  opacity = 0.8,
  saturation = 1,
  brightness = 1,
  contrast = 1,
  borderRadius = 16,
  shadow = true,
  shadowOpacity = 0.3,
  shadowRadius = 20,
  shadowColor = '#000000',
  gradient = false,
  gradientColors = ['#ffffff', '#f0f0f0'],
  gradientAngle = 135,
}) => {
  return (
    <View
      style={[
        styles.glassContainer,
        {
          borderRadius,
          opacity,
          backgroundColor: `rgba(255, 255, 255, ${opacity * 0.1})`,
          ...(shadow && {
            shadowColor,
            shadowOpacity,
            shadowRadius,
            shadowOffset: { width: 0, height: 10 },
          }),
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.glassOverlay,
          {
            opacity,
            borderRadius,
          },
        ]}
      >
        {children}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  glassContainer: {
    overflow: 'hidden',
  },
  glassOverlay: {
    flex: 1,
  },
});
