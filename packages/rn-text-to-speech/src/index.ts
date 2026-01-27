import { EmitterSubscription } from 'react-native';
import NativeTextToSpeech, { TextToSpeechEmitter } from './NativeTextToSpeech';
import type {
  TextToSpeechOptions,
  TextToSpeechError,
  TextToSpeechEvents,
  Voice,
  ExportSpeechOptions,
} from './types';

export * from './types';

class TextToSpeech {
  private listeners: EmitterSubscription[] = [];

  async speak(
    text: string,
    options: TextToSpeechOptions = {}
  ): Promise<void> {
    if (!text || text.trim().length === 0) {
      throw new Error('Text cannot be empty');
    }

    const defaultOptions: TextToSpeechOptions = {
      language: 'en-US',
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0,
      ...options,
    };

    return NativeTextToSpeech.speak(text, defaultOptions);
  }

  async stop(): Promise<void> {
    return NativeTextToSpeech.stop();
  }

  async isSpeaking(): Promise<boolean> {
    return NativeTextToSpeech.isSpeaking();
  }

  async getAvailableVoices(): Promise<Voice[]> {
    return NativeTextToSpeech.getAvailableVoices();
  }

  async setDefaultLanguage(language: string): Promise<void> {
    return NativeTextToSpeech.setDefaultLanguage(language);
  }

  async setDefaultRate(rate: number): Promise<void> {
    if (rate < 0.1 || rate > 10.0) {
      throw new Error('Rate must be between 0.1 and 10.0');
    }
    return NativeTextToSpeech.setDefaultRate(rate);
  }

  async setDefaultPitch(pitch: number): Promise<void> {
    if (pitch < 0.5 || pitch > 2.0) {
      throw new Error('Pitch must be between 0.5 and 2.0');
    }
    return NativeTextToSpeech.setDefaultPitch(pitch);
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

    return NativeTextToSpeech.exportToFile(text, defaultOptions);
  }

  addEventListener<K extends keyof TextToSpeechEvents>(
    event: K,
    handler: TextToSpeechEvents[K]
  ): EmitterSubscription {
    const listener = TextToSpeechEmitter.addListener(event, handler);
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

export default new TextToSpeech();
