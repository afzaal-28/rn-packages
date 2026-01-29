import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import type { LiquidBackgroundProps } from './types';

export const LiquidBackground: React.FC<LiquidBackgroundProps> = ({
  children,
  style,
  colors = ['#667eea', '#764ba2', '#f093fb'],
  animationSpeed = 1,
  blurAmount = 0,
  opacity = 1,
  waveIntensity = 1,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 3000 / animationSpeed,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 3000 / animationSpeed,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [animatedValue, animationSpeed]);

  const gradientColors = colors.map((color, index) => {
    const offset = index / (colors.length - 1);
    return {
      color,
      offset,
    };
  });

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.liquidBackground,
          {
            opacity,
            ...(blurAmount > 0 && {
              backdropFilter: `blur(${blurAmount}px)`,
              WebkitBackdropFilter: `blur(${blurAmount}px)`,
            }),
          },
        ]}
      >
        <Animated.View
          style={[
            styles.wave,
            {
              backgroundColor: colors[0],
              transform: [
                {
                  translateY: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -50 * waveIntensity],
                  }),
                },
                {
                  scaleX: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.2],
                  }),
                },
              ],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.wave,
            {
              backgroundColor: colors[1] || colors[0],
              transform: [
                {
                  translateY: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 50 * waveIntensity],
                  }),
                },
                {
                  scaleX: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0.8],
                  }),
                },
              ],
              opacity: 0.5,
            },
          ]}
        />
      </Animated.View>
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  liquidBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  wave: {
    position: 'absolute',
    width: '200%',
    height: '200%',
    borderRadius: '50%',
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
});
