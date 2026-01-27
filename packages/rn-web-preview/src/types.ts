export interface WebPreviewOptions {
  url?: string;
  html?: string;
  width?: number;
  height?: number;
  enableJavaScript?: boolean;
  enableCache?: boolean;
  userAgent?: string;
  headers?: Record<string, string>;
  timeout?: number;
  waitForSelector?: string;
  waitForNavigation?: boolean;
}

export interface WebPreviewResult {
  html?: string;
  text?: string;
  title?: string;
  screenshot?: string; // base64
  width?: number;
  height?: number;
  url?: string;
  loadTime?: number;
}

export interface WebPreviewError {
  code: string;
  message: string;
}

export type WebPreviewEvents = {
  onLoad: (result: WebPreviewResult) => void;
  onError: (error: WebPreviewError) => void;
  onProgress: (progress: number) => void;
};

export enum ErrorCode {
  INVALID_URL = 'INVALID_URL',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  NOT_AVAILABLE = 'NOT_AVAILABLE',
  UNKNOWN = 'UNKNOWN',
}
