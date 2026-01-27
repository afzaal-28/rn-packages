import { NativeModules, NativeEventEmitter } from 'react-native';
import type { HTMLOptions, HTMLRenderResult } from './types';

const LINKING_ERROR =
  `The package 'rn-html-render' doesn't seem to be linked. Make sure: \n\n` +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const RNHTMLRender = NativeModules.RNHTMLRender
  ? NativeModules.RNHTMLRender
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export const HTMLRenderEmitter = new NativeEventEmitter(RNHTMLRender);

export interface NativeHTMLRenderModule {
  renderHTML(html: string, options?: HTMLOptions): Promise<HTMLRenderResult>;
  renderURL(url: string, options?: HTMLOptions): Promise<HTMLRenderResult>;
  clearCache(): Promise<void>;
  clearCookies(): Promise<void>;
  getUserAgent(): Promise<string>;
  setUserAgent(userAgent: string): Promise<void>;
}

export default RNHTMLRender as NativeHTMLRenderModule;
