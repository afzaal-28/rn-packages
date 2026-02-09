import { NativeEventEmitter, NativeModules } from 'react-native';
import type {
  CameraOptions,
  LiveRecognitionOptions,
  OCRResult,
  PermissionStatus,
} from './types';

const LINKING_ERROR =
  "The package 'rn-otr' doesn't seem to be linked. Make sure:\n\n" +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const RNOTR = NativeModules.RNOTR
  ? NativeModules.RNOTR
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export const OTREmitter = new NativeEventEmitter(RNOTR);

export interface NativeOTRModule {
  checkCameraPermission(): Promise<PermissionStatus>;
  requestCameraPermission(): Promise<boolean>;
  startCamera(options?: CameraOptions): Promise<void>;
  stopCamera(): Promise<void>;
  startLiveTextRecognition(options?: {
    fps?: number;
    languageHints?: string[];
  }): Promise<void>;
  stopLiveTextRecognition(): Promise<void>;
  captureAndRecognize(): Promise<OCRResult>;
  recognizeFromImage(imagePathOrBase64: string): Promise<OCRResult>;
}

export type NativeOTREvents = {
  onTextRecognized: (result: OCRResult) => void;
};

export default RNOTR as NativeOTRModule;
