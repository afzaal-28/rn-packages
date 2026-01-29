# rn-ocr

A React Native native module for OCR (Optical Character Recognition) with TypeScript support for Android and iOS.

## Features

- 📷 **Image text recognition** from file URIs
- 📱 **Cross-platform** support for Android and iOS
- 🔗 **Auto-linking** support (React Native ≥ 0.60)
- 🎯 **TypeScript** type definitions included
- ⚡ **Promise-based API**
- 🌍 **Multi-language** support
- 🔒 **Permission handling** for camera and storage
- 📦 **Zero dependencies** (peer dependencies only)

## Installation

```bash
npm install rn-ocr
# or
yarn add rn-ocr
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
<key>NSCameraUsageDescription</key>
<string>This app needs access to the camera for OCR</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>This app needs access to photos for OCR</string>
```

### Android Setup

The library automatically adds required permissions. You must request `CAMERA` permission at runtime using `requestPermissions()`.

## Usage

### Basic Example

```typescript
import OCR from 'rn-ocr';

const hasPermission = await OCR.requestPermissions();
if (hasPermission) {
  const result = await OCR.recognizeText('/path/to/image.jpg');
  console.log(result.text);
}
```

### Advanced Example

```typescript
import OCR from 'rn-ocr';

// Recognize text with options
const result = await OCR.recognizeText('/path/to/image.jpg', {
  language: 'en',
  scanMode: 'text',
  confidenceThreshold: 0.5,
});

console.log('Recognized text:', result.text);
console.log('Bounding box:', result.boundingBox);
```

## API Reference

### Methods

#### `recognizeText(imageUri: string, options?: OCROptions): Promise<OCRResult>`

Recognizes text from an image file.

```typescript
interface OCROptions {
  language?: string;           // default: 'en'
  scanMode?: 'text' | 'document' | 'barcode'; // default: 'text'
  confidenceThreshold?: number; // default: 0.5
}

interface OCRResult {
  text: string;
  confidence?: number;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}
```

#### `requestPermissions(): Promise<boolean>`

Requests camera and storage permissions.

#### `checkPermissions(): Promise<boolean>`

Checks if permissions are granted.

### Events

- **onResult**: Text recognition result available
- **onError**: Error occurred

```typescript
interface OCRError {
  code: string;
  message: string;
}
```

### Error Codes

`CAMERA_PERMISSION`, `NO_IMAGE`, `RECOGNITION_FAILED`, `NOT_AVAILABLE`, `UNKNOWN`

## Supported Languages

Common language codes: `en`, `es`, `fr`, `de`, `it`, `ja`, `ko`, `zh`, `pt`, `ru`, `ar`, `hi`

## Platform Differences

**Android**: Uses Google ML Kit for text recognition, works offline with language packs

**iOS**: Uses Vision framework, requires iOS 12.0+, may need internet for some languages

## Requirements

- React Native ≥ 0.64.0
- Android: minSdkVersion 21
- iOS: iOS 12.0+

## License

MIT

## Author

afzaal
