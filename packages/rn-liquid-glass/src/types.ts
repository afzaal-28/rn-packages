import { ViewStyle } from 'react-native';

export interface GlassViewProps {
  children?: React.ReactNode;
  style?: ViewStyle;
  blurAmount?: number;
  opacity?: number;
  saturation?: number;
  brightness?: number;
  contrast?: number;
  borderRadius?: number;
  shadow?: boolean;
  shadowOpacity?: number;
  shadowRadius?: number;
  shadowColor?: string;
  gradient?: boolean;
  gradientColors?: string[];
  gradientAngle?: number;
}

export interface LiquidBackgroundProps {
  children?: React.ReactNode;
  style?: ViewStyle;
  colors?: string[];
  animationSpeed?: number;
  blurAmount?: number;
  opacity?: number;
  waveIntensity?: number;
}

export interface BlurViewProps {
  children?: React.ReactNode;
  style?: ViewStyle;
  blurAmount?: number;
  blurType?: 'light' | 'dark' | 'xlight' | 'regular';
  overlayColor?: string;
  overlayOpacity?: number;
  reducedTransparencyFallbackType?: 'systemUltraThinMaterial' | 'systemThinMaterial' | 'systemThickMaterial' | 'systemChromeMaterial' | 'systemUltraThickMaterial';
}

export type AnimationType = 'wave' | 'gradient' | 'pulse' | 'shimmer' | 'none';

export interface AnimationConfig {
  type?: AnimationType;
  duration?: number;
  delay?: number;
  repeat?: boolean;
}
