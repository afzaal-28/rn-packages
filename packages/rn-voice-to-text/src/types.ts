export interface VoiceToTextOptions {
  language?: string;
  maxResults?: number;
  partialResults?: boolean;
  continuous?: boolean;
  timeout?: number;
}

export interface VoiceResult {
  transcript: string;
  confidence?: number;
  isFinal: boolean;
}

export interface VoiceError {
  code: string;
  message: string;
}

export type VoiceToTextEvents = {
  onStart: () => void;
  onPartialResult: (result: VoiceResult) => void;
  onResult: (result: VoiceResult) => void;
  onError: (error: VoiceError) => void;
  onEnd: () => void;
};

export enum ErrorCode {
  AUDIO = 'AUDIO',
  CLIENT = 'CLIENT',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  NETWORK = 'NETWORK',
  NETWORK_TIMEOUT = 'NETWORK_TIMEOUT',
  NO_MATCH = 'NO_MATCH',
  RECOGNIZER_BUSY = 'RECOGNIZER_BUSY',
  SERVER = 'SERVER',
  SPEECH_TIMEOUT = 'SPEECH_TIMEOUT',
  NOT_AVAILABLE = 'NOT_AVAILABLE',
  UNKNOWN = 'UNKNOWN',
}
