import { EmitterSubscription } from 'react-native';
import NativeSpeechToText, { SpeechToTextEmitter } from './NativeSpeechToText';
import type {
  SpeechToTextOptions,
  SpeechResult,
  SpeechError,
  SpeechToTextEvents,
} from './types';

export * from './types';

class SpeechToText {
  private listeners: EmitterSubscription[] = [];

  async startListening(
    options: SpeechToTextOptions = {}
  ): Promise<void> {
    const defaultOptions: SpeechToTextOptions = {
      language: 'en-US',
      maxResults: 5,
      partialResults: true,
      continuous: false,
      timeout: 30000,
      ...options,
    };

    return NativeSpeechToText.startListening(defaultOptions);
  }

  async stopListening(): Promise<void> {
    return NativeSpeechToText.stopListening();
  }

  async cancel(): Promise<void> {
    return NativeSpeechToText.cancel();
  }

  async isListening(): Promise<boolean> {
    return NativeSpeechToText.isListening();
  }

  async requestPermissions(): Promise<boolean> {
    return NativeSpeechToText.requestPermissions();
  }

  async checkPermissions(): Promise<boolean> {
    return NativeSpeechToText.checkPermissions();
  }

  addEventListener<K extends keyof SpeechToTextEvents>(
    event: K,
    handler: SpeechToTextEvents[K]
  ): EmitterSubscription {
    const listener = SpeechToTextEmitter.addListener(event, handler);
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

export default new SpeechToText();
