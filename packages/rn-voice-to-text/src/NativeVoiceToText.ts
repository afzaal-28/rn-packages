import { NativeModules, NativeEventEmitter } from 'react-native';
import type { VoiceToTextOptions } from './types';

const LINKING_ERROR =
  `The package 'rn-voice-to-text' doesn't seem to be linked. Make sure: \n\n` +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const RNVoiceToText = NativeModules.RNVoiceToText
  ? NativeModules.RNVoiceToText
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export const VoiceToTextEmitter = new NativeEventEmitter(RNVoiceToText);

export interface NativeVoiceToTextModule {
  startListening(options: VoiceToTextOptions): Promise<void>;
  stopListening(): Promise<void>;
  cancel(): Promise<void>;
  isListening(): Promise<boolean>;
  requestPermissions(): Promise<boolean>;
  checkPermissions(): Promise<boolean>;
}

export default RNVoiceToText as NativeVoiceToTextModule;
