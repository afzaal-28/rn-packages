import { EmitterSubscription } from 'react-native';
import NativeSmartNotifications, { NotificationEmitter } from './NativeSmartNotifications';
import type {
  NotificationOptions,
  ScheduledNotificationOptions,
  ChannelOptions,
  NotificationResult,
  Notification,
  NotificationError,
  NotificationEvents,
} from './types';

export * from './types';

class SmartNotifications {
  private listeners: EmitterSubscription[] = [];

  async showNotification(
    id: string,
    options: NotificationOptions
  ): Promise<NotificationResult> {
    return NativeSmartNotifications.showNotification(id, options);
  }

  async scheduleNotification(
    id: string,
    options: ScheduledNotificationOptions
  ): Promise<NotificationResult> {
    return NativeSmartNotifications.scheduleNotification(id, options);
  }

  async cancelNotification(id: string): Promise<void> {
    return NativeSmartNotifications.cancelNotification(id);
  }

  async cancelAllNotifications(): Promise<void> {
    return NativeSmartNotifications.cancelAllNotifications();
  }

  async getScheduledNotifications(): Promise<ScheduledNotificationOptions[]> {
    return NativeSmartNotifications.getScheduledNotifications();
  }

  async createChannel(channel: ChannelOptions): Promise<void> {
    return NativeSmartNotifications.createChannel(channel);
  }

  async deleteChannel(channelId: string): Promise<void> {
    return NativeSmartNotifications.deleteChannel(channelId);
  }

  async requestPermissions(): Promise<boolean> {
    return NativeSmartNotifications.requestPermissions();
  }

  async checkPermissions(): Promise<boolean> {
    return NativeSmartNotifications.checkPermissions();
  }

  async setApplicationIconBadgeNumber(number: number): Promise<void> {
    return NativeSmartNotifications.setApplicationIconBadgeNumber(number);
  }

  async getApplicationIconBadgeNumber(): Promise<number> {
    return NativeSmartNotifications.getApplicationIconBadgeNumber();
  }

  addEventListener<K extends keyof NotificationEvents>(
    event: K,
    handler: NotificationEvents[K]
  ): EmitterSubscription {
    const listener = NotificationEmitter.addListener(event, handler);
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

export default new SmartNotifications();
