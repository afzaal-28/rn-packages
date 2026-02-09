import { EmitterSubscription } from 'react-native';
import NativeOTR, { OTREmitter } from './NativeOTR';
import type {
  CameraOptions,
  LiveRecognitionOptions,
  OCRResult,
  PermissionStatus,
} from './types';

export * from './types';

class OTR {
  private liveSubscription: EmitterSubscription | null = null;

  checkCameraPermission(): Promise<PermissionStatus> {
    return NativeOTR.checkCameraPermission();
  }

  requestCameraPermission(): Promise<boolean> {
    return NativeOTR.requestCameraPermission();
  }

  startCamera(options?: CameraOptions): Promise<void> {
    return NativeOTR.startCamera(options);
  }

  stopCamera(): Promise<void> {
    return NativeOTR.stopCamera();
  }

  async startLiveTextRecognition(options: LiveRecognitionOptions): Promise<void> {
    if (this.liveSubscription) {
      this.liveSubscription.remove();
      this.liveSubscription = null;
    }

    this.liveSubscription = OTREmitter.addListener(
      'onTextRecognized',
      options.onTextRecognized
    );

    await NativeOTR.startLiveTextRecognition({
      fps: options.fps,
      languageHints: options.languageHints,
    });
  }

  async stopLiveTextRecognition(): Promise<void> {
    if (this.liveSubscription) {
      this.liveSubscription.remove();
      this.liveSubscription = null;
    }

    await NativeOTR.stopLiveTextRecognition();
  }

  captureAndRecognize(): Promise<OCRResult> {
    return NativeOTR.captureAndRecognize();
  }

  recognizeFromImage(imagePathOrBase64: string): Promise<OCRResult> {
    return NativeOTR.recognizeFromImage(imagePathOrBase64);
  }
}

const otr = new OTR();

export default otr;
