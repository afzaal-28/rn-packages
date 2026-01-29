import { NativeModules, NativeEventEmitter } from 'react-native';
import type { SpeechToTextOptions } from './types';

const LINKING_ERROR =
  `The package 'rn-speech-to-text' doesn't seem to be linked. Make sure: \n\n` +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const RNSpeechToText = NativeModules.RNSpeechToText
  ? NativeModules.RNSpeechToText
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export const SpeechToTextEmitter = new NativeEventEmitter(RNSpeechToText);

export interface NativeSpeechToTextModule {
  startListening(options: SpeechToTextOptions): Promise<void>;
  stopListening(): Promise<void>;
  cancel(): Promise<void>;
  isListening(): Promise<boolean>;
  requestPermissions(): Promise<boolean>;
  checkPermissions(): Promise<boolean>;
}

export default RNSpeechToText as NativeSpeechToTextModule;
