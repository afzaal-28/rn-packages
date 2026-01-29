import { NativeModules, NativeEventEmitter } from 'react-native';
import type { BiometricAuthOptions, BiometricAuthResult, BiometricAvailability } from './types';

const LINKING_ERROR =
  `The package 'rn-biometric-auth' doesn't seem to be linked. Make sure: \n\n` +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const RNBiometricAuth = NativeModules.RNBiometricAuth
  ? NativeModules.RNBiometricAuth
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export const BiometricAuthEmitter = new NativeEventEmitter(RNBiometricAuth);

export interface NativeBiometricAuthModule {
  authenticate(options?: BiometricAuthOptions): Promise<BiometricAuthResult>;
  checkAvailability(): Promise<BiometricAvailability>;
  isEnrolled(): Promise<boolean>;
  cancelAuthentication(): Promise<void>;
}

export default RNBiometricAuth as NativeBiometricAuthModule;
