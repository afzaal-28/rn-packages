import { EmitterSubscription } from 'react-native';
import NativeBiometricAuth, { BiometricAuthEmitter } from './NativeBiometricAuth';
import type {
  BiometricAuthOptions,
  BiometricAuthResult,
  BiometricAvailability,
  BiometricError,
  BiometricEvents,
} from './types';

export * from './types';

class BiometricAuth {
  private listeners: EmitterSubscription[] = [];

  async authenticate(
    options: BiometricAuthOptions = {}
  ): Promise<BiometricAuthResult> {
    const defaultOptions: BiometricAuthOptions = {
      promptMessage: 'Authenticate to continue',
      promptTitle: 'Biometric Authentication',
      cancelButtonText: 'Cancel',
      fallbackToPasscode: true,
      ...options,
    };

    return NativeBiometricAuth.authenticate(defaultOptions);
  }

  async checkAvailability(): Promise<BiometricAvailability> {
    return NativeBiometricAuth.checkAvailability();
  }

  async isEnrolled(): Promise<boolean> {
    return NativeBiometricAuth.isEnrolled();
  }

  async cancelAuthentication(): Promise<void> {
    return NativeBiometricAuth.cancelAuthentication();
  }

  addEventListener<K extends keyof BiometricEvents>(
    event: K,
    handler: BiometricEvents[K]
  ): EmitterSubscription {
    const listener = BiometricAuthEmitter.addListener(event, handler);
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

export default new BiometricAuth();
