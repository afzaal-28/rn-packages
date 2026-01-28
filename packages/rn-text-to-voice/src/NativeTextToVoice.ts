import { NativeModules, NativeEventEmitter } from 'react-native';
import type { TextToVoiceOptions, Voice, ExportSpeechOptions } from './types';

const LINKING_ERROR =
  `The package 'rn-text-to-voice' doesn't seem to be linked. Make sure: \n\n` +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const RNTextToVoice = NativeModules.RNTextToVoice
  ? NativeModules.RNTextToVoice
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export const TextToVoiceEmitter = new NativeEventEmitter(RNTextToVoice);

export interface NativeTextToVoiceModule {
  speak(text: string, options: TextToVoiceOptions): Promise<void>;
  stop(): Promise<void>;
  isSpeaking(): Promise<boolean>;
  getAvailableVoices(): Promise<Voice[]>;
  setDefaultLanguage(language: string): Promise<void>;
  setDefaultRate(rate: number): Promise<void>;
  setDefaultPitch(pitch: number): Promise<void>;
  exportToFile(text: string, options: ExportSpeechOptions): Promise<string>;
}

export default RNTextToVoice as NativeTextToVoiceModule;
