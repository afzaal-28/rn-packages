import { EmitterSubscription } from 'react-native';
import NativeVoiceToText, { VoiceToTextEmitter } from './NativeVoiceToText';
import type {
  VoiceToTextOptions,
  VoiceToTextEvents,
} from './types';

export * from './types';

class VoiceToText {
  private listeners: EmitterSubscription[] = [];

  async startListening(
    options: VoiceToTextOptions = {}
  ): Promise<void> {
    const defaultOptions: VoiceToTextOptions = {
      language: 'en-US',
      maxResults: 5,
      partialResults: true,
      continuous: false,
      timeout: 30000,
      ...options,
    };

    return NativeVoiceToText.startListening(defaultOptions);
  }

  async stopListening(): Promise<void> {
    return NativeVoiceToText.stopListening();
  }

  async cancel(): Promise<void> {
    return NativeVoiceToText.cancel();
  }

  async isListening(): Promise<boolean> {
    return NativeVoiceToText.isListening();
  }

  async requestPermissions(): Promise<boolean> {
    return NativeVoiceToText.requestPermissions();
  }

  async checkPermissions(): Promise<boolean> {
    return NativeVoiceToText.checkPermissions();
  }

  addEventListener<K extends keyof VoiceToTextEvents>(
    event: K,
    handler: VoiceToTextEvents[K]
  ): EmitterSubscription {
    const listener = VoiceToTextEmitter.addListener(event, handler);
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

export default new VoiceToText();
