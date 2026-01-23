# rn-speech-to-text

A React Native native module for speech recognition (speech-to-text) with TypeScript support for Android and iOS.

## Features

- 🎤 **Real-time speech recognition** with partial and final results
- 📱 **Cross-platform** support for Android and iOS
- 🔗 **Auto-linking** support (React Native ≥ 0.60)
- 🎯 **TypeScript** type definitions included
- ⚡ **Promise-based API** with event emitters
- 🌍 **Multi-language** support
- 🔒 **Permission handling** for microphone and speech recognition
- 📦 **Zero dependencies** (peer dependencies only)

## Installation

```bash
npm install rn-speech-to-text
# or
yarn add rn-speech-to-text
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

Add the following permissions to your `ios/YourApp/Info.plist`:

```xml
<key>NSMicrophoneUsageDescription</key>
<string>This app needs access to the microphone for speech recognition</string>
<key>NSSpeechRecognitionUsageDescription</key>
<string>This app needs access to speech recognition</string>
```

### Android Setup

The library automatically adds required permissions. You must request `RECORD_AUDIO` permission at runtime using `requestPermissions()`.

## Usage

### Basic Example

```typescript
import SpeechToText from 'rn-speech-to-text';

const hasPermission = await SpeechToText.requestPermissions();
if (hasPermission) {
  await SpeechToText.startListening({ language: 'en-US' });
}
await SpeechToText.stopListening();
```

### Event Listeners

```typescript
SpeechToText.addEventListener('onResult', (result) => {
  console.log('Final:', result.transcript);
});

SpeechToText.addEventListener('onPartialResult', (result) => {
  console.log('Partial:', result.transcript);
});

SpeechToText.addEventListener('onError', (error) => {
  console.error(error.code, error.message);
});
```

## API Reference

### Methods

#### `startListening(options?: SpeechToTextOptions): Promise<void>`

Starts speech recognition.

```typescript
interface SpeechToTextOptions {
  language?: string;        // default: 'en-US'
  maxResults?: number;      // default: 5
  partialResults?: boolean; // default: true
  continuous?: boolean;     // default: false
  timeout?: number;         // default: 30000
}
```

#### `stopListening(): Promise<void>`

Stops recognition and returns final results.

#### `cancel(): Promise<void>`

Cancels recognition without returning results.

#### `isListening(): Promise<boolean>`

Checks if currently listening.

#### `requestPermissions(): Promise<boolean>`

Requests microphone and speech permissions.

#### `checkPermissions(): Promise<boolean>`

Checks if permissions are granted.

### Events

- **onStart**: Recognition started
- **onPartialResult**: Partial results available
- **onResult**: Final results available
- **onError**: Error occurred
- **onEnd**: Recognition ended

### Error Codes

`AUDIO`, `CLIENT`, `INSUFFICIENT_PERMISSIONS`, `NETWORK`, `NETWORK_TIMEOUT`, `NO_MATCH`, `RECOGNIZER_BUSY`, `SERVER`, `SPEECH_TIMEOUT`, `NOT_AVAILABLE`, `UNKNOWN`

## Supported Languages

Common language codes: `en-US`, `en-GB`, `es-ES`, `fr-FR`, `de-DE`, `it-IT`, `ja-JP`, `ko-KR`, `zh-CN`, `pt-BR`, `ru-RU`, `ar-SA`, `hi-IN`

## Platform Differences

**Android**: Uses `android.speech.SpeechRecognizer`, provides confidence scores, works offline with language packs

**iOS**: Uses `SFSpeechRecognizer` with `AVAudioEngine`, requires iOS 12.0+, may need internet

## Requirements

- React Native ≥ 0.64.0
- Android: minSdkVersion 21
- iOS: iOS 12.0+

## License

MIT

## Author

afzaal