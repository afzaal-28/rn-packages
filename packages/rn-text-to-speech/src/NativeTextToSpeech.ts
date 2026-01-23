import { NativeModules, NativeEventEmitter } from 'react-native';
import type { TextToSpeechOptions, Voice } from './types';

const LINKING_ERROR =
  `The package 'rn-text-to-speech' doesn't seem to be linked. Make sure: \n\n` +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const RNTextToSpeech = NativeModules.RNTextToSpeech
  ? NativeModules.RNTextToSpeech
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export const TextToSpeechEmitter = new NativeEventEmitter(RNTextToSpeech);

export interface NativeTextToSpeechModule {
  speak(text: string, options: TextToSpeechOptions): Promise<void>;
  stop(): Promise<void>;
  isSpeaking(): Promise<boolean>;
  getAvailableVoices(): Promise<Voice[]>;
  setDefaultLanguage(language: string): Promise<void>;
  setDefaultRate(rate: number): Promise<void>;
  setDefaultPitch(pitch: number): Promise<void>;
}

export default RNTextToSpeech as NativeTextToSpeechModule;
