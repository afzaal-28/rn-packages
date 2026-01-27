import { EmitterSubscription } from 'react-native';
import NativeOCR, { OCREmitter } from './NativeOCR';
import type {
  OCROptions,
  OCRResult,
  OCRError,
  OCREvents,
} from './types';

export * from './types';

class OCR {
  private listeners: EmitterSubscription[] = [];

  async recognizeText(
    imageUri: string,
    options: OCROptions = {}
  ): Promise<OCRResult> {
    const defaultOptions: OCROptions = {
      language: 'en',
      scanMode: 'text',
      confidenceThreshold: 0.5,
      ...options,
    };

    return NativeOCR.recognizeText(imageUri, defaultOptions);
  }

  async requestPermissions(): Promise<boolean> {
    return NativeOCR.requestPermissions();
  }

  async checkPermissions(): Promise<boolean> {
    return NativeOCR.checkPermissions();
  }

  addEventListener<K extends keyof OCREvents>(
    event: K,
    handler: OCREvents[K]
  ): EmitterSubscription {
    const listener = OCREmitter.addListener(event, handler);
    this.listeners.push(listener);
    return listener;
  }

  removeEventListener(listener: EmitterSubscription): void {
    listener.remove();
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  removeAllListeners(): void {
    this.listeners.forEach((listener) => listener.remove());
    this.listeners = [];
  }
}

export default new OCR();
