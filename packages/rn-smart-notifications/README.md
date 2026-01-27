# rn-smart-notifications

A React Native native module for smart notifications with advanced features for Android and iOS.

## Features

- 🔔 **Local notifications** with rich content
- 📱 **Cross-platform** support for Android and iOS
- 🔗 **Auto-linking** support (React Native ≥ 0.60)
- 🎯 **TypeScript** type definitions included
- ⚡ **Promise-based API**
- 📅 **Scheduled notifications** with date/time
- 🎨 **Notification channels** (Android)
- 🔔 **Badge numbers** support
- 🔒 **Permission handling**
- 📦 **Zero dependencies** (peer dependencies only)

## Installation

```bash
npm install rn-smart-notifications
# or
yarn add rn-smart-notifications
```

For React Native ≥ 0.60, the library will auto-link. After installation, rebuild your app:

```bash
# iOS
cd ios && pod install && cd ..
npx react-native run-ios

# Android
npx react-native run-android
```

## Platform Setup

### iOS Setup

Add the following permission to your `ios/YourApp/Info.plist`:

```xml
<key>UIBackgroundModes</key>
<array>
    <string>remote-notification</string>
</array>
```

### Android Setup

The library automatically adds required permissions. You must request `POST_NOTIFICATIONS` permission at runtime using `requestPermissions()` on Android 13+.

## Usage

### Basic Example

```typescript
import SmartNotifications from 'rn-smart-notifications';

// Request permissions
const hasPermission = await SmartNotifications.requestPermissions();

if (hasPermission) {
  // Show notification
  await SmartNotifications.showNotification('1', {
    title: 'Hello',
    body: 'This is a notification',
  });
}
```

### Scheduled Notification

```typescript
// Schedule notification for specific time
const date = new Date();
date.setHours(date.getHours() + 1);

await SmartNotifications.scheduleNotification('2', {
  title: 'Reminder',
  body: 'This is a scheduled notification',
  date: date,
});
```

### Notification Channels (Android)

```typescript
// Create notification channel (Android 8.0+)
await SmartNotifications.createChannel({
  id: 'default',
  name: 'Default Channel',
  description: 'Default notification channel',
  importance: 'high',
});
```

### Badge Numbers

```typescript
// Set app icon badge number
await SmartNotifications.setApplicationIconBadgeNumber(5);

// Get current badge number
const badge = await SmartNotifications.getApplicationIconBadgeNumber();
```

## API Reference

### Methods

#### `showNotification(id: string, options: NotificationOptions): Promise<NotificationResult>`

Shows a local notification immediately.

```typescript
interface NotificationOptions {
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
```

#### `scheduleNotification(id: string, options: ScheduledNotificationOptions): Promise<NotificationResult>`

Schedules a notification for a specific date/time.

```typescript
interface ScheduledNotificationOptions extends NotificationOptions {
  date: Date;
  repeatInterval?: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';
  allowWhileIdle?: boolean;
}
```

#### `cancelNotification(id: string): Promise<void>`

Cancels a specific notification.

#### `cancelAllNotifications(): Promise<void>`

Cancels all notifications.

#### `getScheduledNotifications(): Promise<ScheduledNotificationOptions[]>`

Gets all scheduled notifications.

#### `createChannel(channel: ChannelOptions): Promise<void>`

Creates a notification channel (Android 8.0+).

```typescript
interface ChannelOptions {
  id: string;
  name: string;
  description?: string;
  importance?: 'none' | 'min' | 'low' | 'default' | 'high' | 'max';
  sound?: string;
  vibrate?: boolean;
  lights?: boolean;
  showBadge?: boolean;
}
```

#### `deleteChannel(channelId: string): Promise<void>`

Deletes a notification channel (Android 8.0+).

#### `requestPermissions(): Promise<boolean>`

Requests notification permissions.

#### `checkPermissions(): Promise<boolean>`

Checks if permissions are granted.

#### `setApplicationIconBadgeNumber(number: number): Promise<void>`

Sets the application icon badge number.

#### `getApplicationIconBadgeNumber(): Promise<number>`

Gets the current application icon badge number.

### Events

- **onNotification**: Notification received
- **onNotificationOpened**: Notification opened by user
- **onRegistrationError**: Registration error occurred

```typescript
interface NotificationError {
  code: string;
  message: string;
}
```

### Error Codes

`PERMISSION_DENIED`, `NOTIFICATION_FAILED`, `INVALID_PARAMS`, `NOT_AVAILABLE`, `UNKNOWN`

## Platform Differences

**Android**: Uses NotificationManager with channels for Android 8.0+, requires POST_NOTIFICATIONS permission on Android 13+

**iOS**: Uses UNUserNotificationCenter, requires iOS 12.0+, supports rich notifications with actions and categories

## Requirements

- React Native ≥ 0.64.0
- Android: minSdkVersion 21
- iOS: iOS 12.0+

## License

MIT

## Author

afzaal
