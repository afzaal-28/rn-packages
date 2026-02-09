# rn-otr

React Native Optical Text Recognition (OCR) library with native-first design.

## Installation

Add the package to your monorepo and install pods / rebuild the Android app as usual.

## API

```ts
import otr, {
  type OCRResult,
  type CameraOptions,
  type LiveRecognitionOptions,
} from 'rn-otr';

// Permissions
otr.checkCameraPermission(): Promise<'granted' | 'denied' | 'blocked'>;
otr.requestCameraPermission(): Promise<boolean>;

// Camera lifecycle
otr.startCamera(options?: CameraOptions): Promise<void>;
otr.stopCamera(): Promise<void>;

// Live OCR
otr.startLiveTextRecognition(options: LiveRecognitionOptions): Promise<void>;
otr.stopLiveTextRecognition(): Promise<void>;

// Single-frame OCR
otr.captureAndRecognize(): Promise<OCRResult>;

// Image OCR
otr.recognizeFromImage(imagePathOrBase64: string): Promise<OCRResult>;
```

## Example

```ts
const hasPermission = await otr.requestCameraPermission();
if (hasPermission) {
  await otr.startCamera({ facing: 'back', resolution: 'high' });
  await otr.startLiveTextRecognition({
    fps: 10,
    onTextRecognized: (result) => {
      console.log(result.text);
    },
  });
}
```
