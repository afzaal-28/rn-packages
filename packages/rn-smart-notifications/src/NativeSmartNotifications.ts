import { NativeModules, NativeEventEmitter } from 'react-native';
import type { NotificationOptions, ScheduledNotificationOptions, ChannelOptions, NotificationResult } from './types';

const LINKING_ERROR =
  `The package 'rn-smart-notifications' doesn't seem to be linked. Make sure: \n\n` +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const RNSmartNotifications = NativeModules.RNSmartNotifications
  ? NativeModules.RNSmartNotifications
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export const NotificationEmitter = new NativeEventEmitter(RNSmartNotifications);

export interface NativeSmartNotificationsModule {
  showNotification(id: string, options: NotificationOptions): Promise<NotificationResult>;
  scheduleNotification(id: string, options: ScheduledNotificationOptions): Promise<NotificationResult>;
  cancelNotification(id: string): Promise<void>;
  cancelAllNotifications(): Promise<void>;
  getScheduledNotifications(): Promise<ScheduledNotificationOptions[]>;
  createChannel(channel: ChannelOptions): Promise<void>;
  deleteChannel(channelId: string): Promise<void>;
  requestPermissions(): Promise<boolean>;
  checkPermissions(): Promise<boolean>;
  setApplicationIconBadgeNumber(number: number): Promise<void>;
  getApplicationIconBadgeNumber(): Promise<number>;
}

export default RNSmartNotifications as NativeSmartNotificationsModule;
