import { EmitterSubscription } from 'react-native';
import NativeWebPreview, { WebPreviewEmitter } from './NativeWebPreview';
import type {
  WebPreviewOptions,
  WebPreviewResult,
  WebPreviewError,
  WebPreviewEvents,
} from './types';

export * from './types';

class WebPreview {
  private listeners: EmitterSubscription[] = [];

  async previewURL(
    url: string,
    options: WebPreviewOptions = {}
  ): Promise<WebPreviewResult> {
    const defaultOptions: WebPreviewOptions = {
      width: 1080,
      height: 1920,
      enableJavaScript: true,
      enableCache: true,
      timeout: 30000,
      ...options,
    };

    return NativeWebPreview.previewURL(url, defaultOptions);
  }

  async previewHTML(
    html: string,
    options: WebPreviewOptions = {}
  ): Promise<WebPreviewResult> {
    const defaultOptions: WebPreviewOptions = {
      width: 1080,
      height: 1920,
      enableJavaScript: true,
      enableCache: false,
      ...options,
    };

    return NativeWebPreview.previewHTML(html, defaultOptions);
  }

  async clearCache(): Promise<void> {
    return NativeWebPreview.clearCache();
  }

  async clearCookies(): Promise<void> {
    return NativeWebPreview.clearCookies();
  }

  async getUserAgent(): Promise<string> {
    return NativeWebPreview.getUserAgent();
  }

  async setUserAgent(userAgent: string): Promise<void> {
    return NativeWebPreview.setUserAgent(userAgent);
  }

  addEventListener<K extends keyof WebPreviewEvents>(
    event: K,
    handler: WebPreviewEvents[K]
  ): EmitterSubscription {
    const listener = WebPreviewEmitter.addListener(event, handler);
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

export default new WebPreview();
