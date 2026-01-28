export interface TextToVoiceOptions {
  language?: string;
  rate?: number;
  pitch?: number;
  voice?: string;
  volume?: number;
}

export interface ExportSpeechOptions extends TextToVoiceOptions {
  outputPath: string;
  format?: 'wav' | 'mp3' | 'aac';
}

export interface Voice {
  id: string;
  name: string;
  language: string;
  quality?: string;
}

export interface TextToVoiceError {
  code: string;
  message: string;
}

export type TextToVoiceEvents = {
  onStart: () => void;
  onFinish: () => void;
  onError: (error: TextToVoiceError) => void;
};

export enum ErrorCode {
  INITIALIZATION_ERROR = 'INITIALIZATION_ERROR',
  NOT_AVAILABLE = 'NOT_AVAILABLE',
  INVALID_REQUEST = 'INVALID_REQUEST',
  NETWORK_ERROR = 'NETWORK_ERROR',
  SYNTHESIS_ERROR = 'SYNTHESIS_ERROR',
  UNKNOWN = 'UNKNOWN',
}
