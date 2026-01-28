import { EmitterSubscription } from 'react-native';
import NativeTextToVoice, { TextToVoiceEmitter } from './NativeTextToVoice';
import type {
  TextToVoiceOptions,
  TextToVoiceEvents,
  Voice,
  ExportSpeechOptions,
} from './types';

export * from './types';

class TextToVoice {
  private listeners: EmitterSubscription[] = [];

  async speak(
    text: string,
    options: TextToVoiceOptions = {}
  ): Promise<void> {
    if (!text || text.trim().length === 0) {
      throw new Error('Text cannot be empty');
    }

    const defaultOptions: TextToVoiceOptions = {
      language: 'en-US',
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0,
      ...options,
    };

    return NativeTextToVoice.speak(text, defaultOptions);
  }

  async stop(): Promise<void> {
    return NativeTextToVoice.stop();
  }

  async isSpeaking(): Promise<boolean> {
    return NativeTextToVoice.isSpeaking();
  }

  async getAvailableVoices(): Promise<Voice[]> {
    return NativeTextToVoice.getAvailableVoices();
  }

  async setDefaultLanguage(language: string): Promise<void> {
    return NativeTextToVoice.setDefaultLanguage(language);
  }

  async setDefaultRate(rate: number): Promise<void> {
    if (rate < 0.1 || rate > 10.0) {
      throw new Error('Rate must be between 0.1 and 10.0');
    }
    return NativeTextToVoice.setDefaultRate(rate);
  }

  async setDefaultPitch(pitch: number): Promise<void> {
    if (pitch < 0.5 || pitch > 2.0) {
      throw new Error('Pitch must be between 0.5 and 2.0');
    }
    return NativeTextToVoice.setDefaultPitch(pitch);
  }

  async exportToFile(
    text: string,
    options: ExportSpeechOptions
  ): Promise<string> {
    if (!text || text.trim().length === 0) {
      throw new Error('Text cannot be empty');
    }

    if (!options.outputPath) {
      throw new Error('Output path is required');
    }

    const defaultOptions: ExportSpeechOptions = {
      language: 'en-US',
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0,
      format: 'wav',
      ...options,
    };

    return NativeTextToVoice.exportToFile(text, defaultOptions);
  }

  addEventListener<K extends keyof TextToVoiceEvents>(
    event: K,
    handler: TextToVoiceEvents[K]
  ): EmitterSubscription {
    const listener = TextToVoiceEmitter.addListener(event as string, handler);
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

export default new TextToVoice();
