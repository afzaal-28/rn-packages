export interface HTMLOptions {
  width?: number;
  height?: number;
  enableJavaScript?: boolean;
  enableCache?: boolean;
  userAgent?: string;
  headers?: Record<string, string>;
  timeout?: number;
  waitForSelector?: string;
  waitForNavigation?: boolean;
  executeJavaScript?: string;
  css?: string;
}

export interface HTMLRenderResult {
  html?: string;
  text?: string;
  title?: string;
  screenshot?: string; // base64
  width?: number;
  height?: number;
  loadTime?: number;
  executedJavaScript?: string;
}

export interface HTMLError {
  code: string;
  message: string;
}

export type HTMLEvents = {
  onLoad: (result: HTMLRenderResult) => void;
  onError: (error: HTMLError) => void;
  onProgress: (progress: number) => void;
};

export enum ErrorCode {
  INVALID_HTML = 'INVALID_HTML',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  NOT_AVAILABLE = 'NOT_AVAILABLE',
  UNKNOWN = 'UNKNOWN',
}
