export interface OCROptions {
  language?: string;
  scanMode?: 'text' | 'document' | 'barcode';
  confidenceThreshold?: number;
}

export interface OCRResult {
  text: string;
  confidence?: number;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface OCRError {
  code: string;
  message: string;
}

export type OCREvents = {
  onResult: (result: OCRResult) => void;
  onError: (error: OCRError) => void;
};

export enum ErrorCode {
  CAMERA_PERMISSION = 'CAMERA_PERMISSION',
  NO_IMAGE = 'NO_IMAGE',
  RECOGNITION_FAILED = 'RECOGNITION_FAILED',
  NOT_AVAILABLE = 'NOT_AVAILABLE',
  UNKNOWN = 'UNKNOWN',
}
