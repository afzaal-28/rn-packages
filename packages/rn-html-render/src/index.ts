import { EmitterSubscription } from 'react-native';
import NativeHTMLRender, { HTMLRenderEmitter } from './NativeHTMLRender';
import type {
  HTMLOptions,
  HTMLRenderResult,
  HTMLError,
  HTMLEvents,
} from './types';

export * from './types';

class HTMLRender {
  private listeners: EmitterSubscription[] = [];

  async renderHTML(
    html: string,
    options: HTMLOptions = {}
  ): Promise<HTMLRenderResult> {
    const defaultOptions: HTMLOptions = {
      width: 1080,
      height: 1920,
      enableJavaScript: true,
      enableCache: false,
      timeout: 30000,
      ...options,
    };

    return NativeHTMLRender.renderHTML(html, defaultOptions);
  }

  async renderURL(
    url: string,
    options: HTMLOptions = {}
  ): Promise<HTMLRenderResult> {
    const defaultOptions: HTMLOptions = {
      width: 1080,
      height: 1920,
      enableJavaScript: true,
      enableCache: true,
      timeout: 30000,
      ...options,
    };

    return NativeHTMLRender.renderURL(url, defaultOptions);
  }

  async clearCache(): Promise<void> {
    return NativeHTMLRender.clearCache();
  }

  async clearCookies(): Promise<void> {
    return NativeHTMLRender.clearCookies();
  }

  async getUserAgent(): Promise<string> {
    return NativeHTMLRender.getUserAgent();
  }

  async setUserAgent(userAgent: string): Promise<void> {
    return NativeHTMLRender.setUserAgent(userAgent);
  }

  addEventListener<K extends keyof HTMLEvents>(
    event: K,
    handler: HTMLEvents[K]
  ): EmitterSubscription {
    const listener = HTMLRenderEmitter.addListener(event, handler);
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

export default new HTMLRender();
