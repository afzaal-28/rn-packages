export type BiometricType = 'fingerprint' | 'face' | 'iris';

export interface BiometricAuthOptions {
  promptMessage?: string;
  promptTitle?: string;
  cancelButtonText?: string;
  fallbackToPasscode?: boolean;
  sensorDescription?: string;
  sensorError?: string;
}

export interface BiometricAuthResult {
  success: boolean;
  error?: string;
}

export interface BiometricAvailability {
  available: boolean;
  biometryType?: BiometricType;
  hardware?: boolean;
  permission?: boolean;
}

export interface BiometricError {
  code: string;
  message: string;
}

export type BiometricEvents = {
  onAuthSuccess: (result: BiometricAuthResult) => void;
  onAuthFailure: (error: BiometricError) => void;
};

export enum ErrorCode {
  NOT_AVAILABLE = 'NOT_AVAILABLE',
  NOT_ENROLLED = 'NOT_ENROLLED',
  LOCKOUT = 'LOCKOUT',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  USER_CANCELED = 'USER_CANCELED',
  SYSTEM_CANCEL = 'SYSTEM_CANCEL',
  TIMEOUT = 'TIMEOUT',
  UNKNOWN = 'UNKNOWN',
}
