import { NativeModules, NativeEventEmitter } from 'react-native';
import type { WebPreviewOptions, WebPreviewResult } from './types';

const LINKING_ERROR =
  `The package 'rn-web-preview' doesn't seem to be linked. Make sure: \n\n` +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const RNWebPreview = NativeModules.RNWebPreview
  ? NativeModules.RNWebPreview
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export const WebPreviewEmitter = new NativeEventEmitter(RNWebPreview);

export interface NativeWebPreviewModule {
  previewURL(url: string, options?: WebPreviewOptions): Promise<WebPreviewResult>;
  previewHTML(html: string, options?: WebPreviewOptions): Promise<WebPreviewResult>;
  clearCache(): Promise<void>;
  clearCookies(): Promise<void>;
  getUserAgent(): Promise<string>;
  setUserAgent(userAgent: string): Promise<void>;
}

export default RNWebPreview as NativeWebPreviewModule;
