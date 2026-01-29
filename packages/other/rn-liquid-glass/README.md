# rn-liquid-glass

A React Native library for liquid glass and glassmorphism UI components.

## Features

- 🪟 **Glassmorphism effects** with blur and transparency
- 🌊 **Liquid backgrounds** with animated waves
- 🔲 **Blur views** for iOS and Android
- 🎨 **Customizable** colors, opacity, blur amounts
- ⚡ **Animated** backgrounds with configurable speed
- 📱 **Cross-platform** support (iOS & Android)
- 🔗 **Auto-linking** support (React Native ≥ 0.60)
- 🎯 **TypeScript** type definitions included
- 📦 **Zero dependencies** (peer dependencies only)

## Installation

```bash
npm install rn-liquid-glass
# or
yarn add rn-liquid-glass
```

For React Native ≥ 0.60, the library will auto-link. After installation, rebuild your app:

```bash
# iOS
cd ios && pod install && cd ..
npx react-native run-ios

# Android
npx react-native run-android
```

## Usage

### GlassView

A glassmorphism container with blur effect and shadow.

```typescript
import { GlassView } from 'rn-liquid-glass';

<GlassView
  blurAmount={10}
  opacity={0.8}
  borderRadius={16}
  shadow={true}
>
  <Text>Your content here</Text>
</GlassView>
```

### LiquidBackground

Animated liquid background with gradient waves.

```typescript
import { LiquidBackground } from 'rn-liquid-glass';

<LiquidBackground
  colors={['#667eea', '#764ba2', '#f093fb']}
  animationSpeed={1}
  waveIntensity={1}
>
  <Text>Your content here</Text>
</LiquidBackground>
```

### BlurView

Blur effect for iOS and Android.

```typescript
import { BlurView } from 'rn-liquid-glass';

<BlurView
  blurAmount={10}
  blurType="light"
  overlayOpacity={0.1}
>
  <Text>Your content here</Text>
</BlurView>
```

## API Reference

### GlassView

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | - | Child components |
| `style` | ViewStyle | - | Custom styles |
| `blurAmount` | number | 10 | Blur intensity (0-100) |
| `opacity` | number | 0.8 | Glass opacity (0-1) |
| `saturation` | number | 1 | Saturation (0-2) |
| `brightness` | number | 1 | Brightness (0-2) |
| `contrast` | number | 1 | Contrast (0-2) |
| `borderRadius` | number | 16 | Border radius |
| `shadow` | boolean | true | Enable shadow |
| `shadowOpacity` | number | 0.3 | Shadow opacity (0-1) |
| `shadowRadius` | number | 20 | Shadow radius |
| `shadowColor` | string | '#000000' | Shadow color |
| `gradient` | boolean | false | Enable gradient |
| `gradientColors` | string[] | ['#ffffff', '#f0f0f0'] | Gradient colors |
| `gradientAngle` | number | 135 | Gradient angle (0-360) |

### LiquidBackground

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | - | Child components |
| `style` | ViewStyle | - | Custom styles |
| `colors` | string[] | ['#667eea', '#764ba2', '#f093fb'] | Gradient colors |
| `animationSpeed` | number | 1 | Animation speed (0.1-10) |
| `blurAmount` | number | 0 | Blur intensity (0-100) |
| `opacity` | number | 1 | Background opacity (0-1) |
| `waveIntensity` | number | 1 | Wave animation intensity (0-2) |

### BlurView

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | - | Child components |
| `style` | ViewStyle | - | Custom styles |
| `blurAmount` | number | 10 | Blur intensity (0-100) |
| `blurType` | 'light' \| 'dark' \| 'xlight' \| 'regular' | 'light' | Blur type |
| `overlayColor` | string | - | Overlay color |
| `overlayOpacity` | number | 0.1 | Overlay opacity (0-1) |
| `reducedTransparencyFallbackType` | string | 'systemThinMaterial' | iOS fallback type |

## Platform Differences

**iOS**: Uses UIVisualEffectView for native blur effects

**Android**: Uses fallback with background color and opacity

## Requirements

- React Native ≥ 0.64.0
- iOS: iOS 12.0+
- Android: minSdkVersion 21

## License

MIT

## Author

afzaal
