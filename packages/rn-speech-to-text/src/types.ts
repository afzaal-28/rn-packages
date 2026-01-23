export interface SpeechToTextOptions {
  language?: string;
  maxResults?: number;
  partialResults?: boolean;
  continuous?: boolean;
  timeout?: number;
}

export interface SpeechResult {
  transcript: string;
  confidence?: number;
  isFinal: boolean;
}

export interface SpeechError {
  code: string;
  message: string;
}

export type SpeechToTextEvents = {
  onStart: () => void;
  onPartialResult: (result: SpeechResult) => void;
  onResult: (result: SpeechResult) => void;
  onError: (error: SpeechError) => void;
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
