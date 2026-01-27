export interface TextToSpeechOptions {
  language?: string;
  rate?: number;
  pitch?: number;
  voice?: string;
  volume?: number;
}

export interface ExportSpeechOptions extends TextToSpeechOptions {
  outputPath: string;
  format?: 'wav' | 'mp3' | 'aac';
}

export interface Voice {
  id: string;
  name: string;
  language: string;
  quality?: string;
}

export interface TextToSpeechError {
  code: string;
  message: string;
}

export type TextToSpeechEvents = {
  onStart: () => void;
  onFinish: () => void;
  onError: (error: TextToSpeechError) => void;
};

export enum ErrorCode {
  INITIALIZATION_ERROR = 'INITIALIZATION_ERROR',
  NOT_AVAILABLE = 'NOT_AVAILABLE',
  INVALID_REQUEST = 'INVALID_REQUEST',
  NETWORK_ERROR = 'NETWORK_ERROR',
  SYNTHESIS_ERROR = 'SYNTHESIS_ERROR',
  UNKNOWN = 'UNKNOWN',
}
