import { NativeModules, NativeEventEmitter } from 'react-native';
import type { OCROptions, OCRResult } from './types';

const LINKING_ERROR =
  `The package 'rn-ocr' doesn't seem to be linked. Make sure: \n\n` +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const RNOCR = NativeModules.RNOCR
  ? NativeModules.RNOCR
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export const OCREmitter = new NativeEventEmitter(RNOCR);

export interface NativeOCRModule {
  recognizeText(imageUri: string, options?: OCROptions): Promise<OCRResult>;
  requestPermissions(): Promise<boolean>;
  checkPermissions(): Promise<boolean>;
}

export default RNOCR as NativeOCRModule;
