# rn-biometric-auth

A React Native native module for biometric authentication with support for fingerprint and face recognition.

## Features

- 🔐 **Biometric authentication** (fingerprint, face, iris)
- 📱 **Cross-platform** support for Android and iOS
- 🔗 **Auto-linking** support (React Native ≥ 0.60)
- 🎯 **TypeScript** type definitions included
- ⚡ **Promise-based API**
- 🔎 **Availability checking**
- 🎨 **Customizable prompts**
- 📦 **Zero dependencies** (peer dependencies only)

## Installation

```bash
npm install rn-biometric-auth
# or
yarn add rn-biometric-auth
```

For React Native ≥ 0.60, the library will auto-link. After installation, rebuild your app:

```bash
# iOS
cd ios && pod install && cd ..
npx react-native run-ios

# Android
npx react-native run-android
```

## Platform Setup

### iOS Setup

Add the following permission to your `ios/YourApp/Info.plist`:

```xml
<key>NSFaceIDUsageDescription</key>
<string>This app needs access to Face ID for authentication</string>
```

### Android Setup

The library automatically adds required permissions. You must request `USE_BIOMETRIC` permission at runtime.

## Usage

### Basic Example

```typescript
import BiometricAuth from 'rn-biometric-auth';

// Check availability
const availability = await BiometricAuth.checkAvailability();
if (availability.available) {
  console.log('Biometric type:', availability.biometryType);
}

// Authenticate
const result = await BiometricAuth.authenticate({
  promptMessage: 'Authenticate to continue',
  promptTitle: 'Biometric Authentication',
  cancelButtonText: 'Cancel',
});

if (result.success) {
  console.log('Authentication successful');
}
```

### Advanced Example

```typescript
// Check if user has enrolled biometrics
const isEnrolled = await BiometricAuth.isEnrolled();

if (isEnrolled) {
  const result = await BiometricAuth.authenticate({
    promptMessage: 'Please authenticate to access your account',
    promptTitle: 'Secure Access',
    cancelButtonText: 'Use Passcode',
    fallbackToPasscode: true,
  });
}
```

## API Reference

### Methods

#### `authenticate(options?: BiometricAuthOptions): Promise<BiometricAuthResult>`

Prompts user for biometric authentication.

```typescript
interface BiometricAuthOptions {
  promptMessage?: string;
  promptTitle?: string;
  cancelButtonText?: string;
  fallbackToPasscode?: boolean;
  sensorDescription?: string;
  sensorError?: string;
}

interface BiometricAuthResult {
  success: boolean;
  error?: string;
}
```

#### `checkAvailability(): Promise<BiometricAvailability>`

Checks if biometric authentication is available.

```typescript
interface BiometricAvailability {
  available: boolean;
  biometryType?: 'fingerprint' | 'face' | 'iris';
  hardware?: boolean;
  permission?: boolean;
}
```

#### `isEnrolled(): Promise<boolean>`

Checks if user has enrolled biometrics.

#### `cancelAuthentication(): Promise<void>`

Cancels ongoing authentication.

### Events

- **onAuthSuccess**: Authentication succeeded
- **onAuthFailure**: Authentication failed

```typescript
interface BiometricError {
  code: string;
  message: string;
}
```

### Error Codes

`NOT_AVAILABLE`, `NOT_ENROLLED`, `LOCKOUT`, `PERMISSION_DENIED`, `USER_CANCELED`, `SYSTEM_CANCEL`, `TIMEOUT`, `UNKNOWN`

## Platform Differences

**Android**: Uses BiometricPrompt API, supports fingerprint and face recognition, requires Android 6.0+

**iOS**: Uses LocalAuthentication framework, supports Touch ID and Face ID, requires iOS 12.0+

## Requirements

- React Native ≥ 0.64.0
- Android: minSdkVersion 23
- iOS: iOS 12.0+

## License

MIT

## Author

afzaal
