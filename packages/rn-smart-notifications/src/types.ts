export interface NotificationOptions {
  title: string;
  body: string;
  sound?: string;
  badge?: number;
  data?: Record<string, any>;
  channelId?: string;
  priority?: 'high' | 'normal' | 'low';
  vibrate?: boolean;
  lights?: boolean;
  color?: string;
  icon?: string;
  largeIcon?: string;
  bigText?: string;
  subText?: string;
  number?: number;
  category?: string;
  threadId?: string;
  group?: string;
  summary?: string;
  autoCancel?: boolean;
  ongoing?: boolean;
  onlyAlertOnce?: boolean;
}

export interface ScheduledNotificationOptions extends NotificationOptions {
  date: Date;
  repeatInterval?: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';
  allowWhileIdle?: boolean;
}

export interface ChannelOptions {
  id: string;
  name: string;
  description?: string;
  importance?: 'none' | 'min' | 'low' | 'default' | 'high' | 'max';
  sound?: string;
  vibrate?: boolean;
  lights?: boolean;
  showBadge?: boolean;
}

export interface NotificationResult {
  id: string;
  success: boolean;
}

export interface NotificationError {
  code: string;
  message: string;
}

export type NotificationEvents = {
  onNotification: (notification: Notification) => void;
  onNotificationOpened: (notification: Notification) => void;
  onRegistrationError: (error: NotificationError) => void;
};

export interface Notification {
  id: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  date?: Date;
}

export enum ErrorCode {
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  NOTIFICATION_FAILED = 'NOTIFICATION_FAILED',
  INVALID_PARAMS = 'INVALID_PARAMS',
  NOT_AVAILABLE = 'NOT_AVAILABLE',
  UNKNOWN = 'UNKNOWN',
}
