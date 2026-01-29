package com.rnsmartnotifications;

import android.Manifest;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Build;
import androidx.core.app.ActivityCompat;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.HashMap;
import java.util.Map;

public class RNSmartNotificationsModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;
    private final Map<String, ScheduledNotification> scheduledNotifications = new HashMap<>();

    public RNSmartNotificationsModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "RNSmartNotifications";
    }

    @ReactMethod
    public void requestPermissions(Promise promise) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            boolean granted = ActivityCompat.checkSelfPermission(
                reactContext,
                Manifest.permission.POST_NOTIFICATIONS
            ) == PackageManager.PERMISSION_GRANTED;
            promise.resolve(granted);
        } else {
            promise.resolve(true);
        }
    }

    @ReactMethod
    public void checkPermissions(Promise promise) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            boolean granted = ActivityCompat.checkSelfPermission(
                reactContext,
                Manifest.permission.POST_NOTIFICATIONS
            ) == PackageManager.PERMISSION_GRANTED;
            promise.resolve(granted);
        } else {
            promise.resolve(true);
        }
    }

    @ReactMethod
    public void showNotification(String id, ReadableMap options, Promise promise) {
        try {
            String title = options.getString("title");
            String body = options.getString("body");
            String channelId = options.getString("channelId") != null ? 
                options.getString("channelId") : "default";

            NotificationCompat.Builder builder = new NotificationCompat.Builder(reactContext, channelId)
                .setSmallIcon(android.R.drawable.ic_dialog_info)
                .setContentTitle(title)
                .setContentText(body)
                .setAutoCancel(options.hasKey("autoCancel") ? options.getBoolean("autoCancel") : true)
                .setOngoing(options.hasKey("ongoing") ? options.getBoolean("ongoing") : false)
                .setOnlyAlertOnce(options.hasKey("onlyAlertOnce") ? options.getBoolean("onlyAlertOnce") : false);

            if (options.hasKey("priority")) {
                String priority = options.getString("priority");
                int prio = "high".equals(priority) ? NotificationCompat.PRIORITY_HIGH :
                           "low".equals(priority) ? NotificationCompat.PRIORITY_LOW :
                           NotificationCompat.PRIORITY_DEFAULT;
                builder.setPriority(prio);
            }

            NotificationManagerCompat notificationManager = NotificationManagerCompat.from(reactContext);
            notificationManager.notify(id.hashCode(), builder.build());

            WritableMap result = Arguments.createMap();
            result.putString("id", id);
            result.putBoolean("success", true);
            promise.resolve(result);
        } catch (Exception e) {
            promise.reject("NOTIFICATION_FAILED", e.getMessage());
        }
    }

    @ReactMethod
    public void scheduleNotification(String id, ReadableMap options, Promise promise) {
        try {
            ScheduledNotification scheduled = new ScheduledNotification();
            scheduled.id = id;
            scheduled.options = options;
            scheduledNotifications.put(id, scheduled);

            WritableMap result = Arguments.createMap();
            result.putString("id", id);
            result.putBoolean("success", true);
            promise.resolve(result);
        } catch (Exception e) {
            promise.reject("NOTIFICATION_FAILED", e.getMessage());
        }
    }

    @ReactMethod
    public void cancelNotification(String id, Promise promise) {
        NotificationManagerCompat notificationManager = NotificationManagerCompat.from(reactContext);
        notificationManager.cancel(id.hashCode());
        scheduledNotifications.remove(id);
        promise.resolve(null);
    }

    @ReactMethod
    public void cancelAllNotifications(Promise promise) {
        NotificationManagerCompat notificationManager = NotificationManagerCompat.from(reactContext);
        notificationManager.cancelAll();
        scheduledNotifications.clear();
        promise.resolve(null);
    }

    @ReactMethod
    public void getScheduledNotifications(Promise promise) {
        promise.resolve(Arguments.createArray());
    }

    @ReactMethod
    public void createChannel(ReadableMap channel, Promise promise) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            String channelId = channel.getString("id");
            String name = channel.getString("name");
            String description = channel.hasKey("description") ? channel.getString("description") : "";
            String importance = channel.hasKey("importance") ? channel.getString("importance") : "default";

            int importanceLevel = "high".equals(importance) ? NotificationManager.IMPORTANCE_HIGH :
                                  "low".equals(importance) ? NotificationManager.IMPORTANCE_LOW :
                                  "min".equals(importance) ? NotificationManager.IMPORTANCE_MIN :
                                  "max".equals(importance) ? NotificationManager.IMPORTANCE_HIGH :
                                  NotificationManager.IMPORTANCE_DEFAULT;

            NotificationChannel notificationChannel = new NotificationChannel(
                channelId,
                name,
                importanceLevel
            );
            notificationChannel.setDescription(description);

            NotificationManager notificationManager = reactContext.getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(notificationChannel);
        }
        promise.resolve(null);
    }

    @ReactMethod
    public void deleteChannel(String channelId, Promise promise) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationManager notificationManager = reactContext.getSystemService(NotificationManager.class);
            notificationManager.deleteNotificationChannel(channelId);
        }
        promise.resolve(null);
    }

    @ReactMethod
    public void setApplicationIconBadgeNumber(int number, Promise promise) {
        promise.resolve(null);
    }

    @ReactMethod
    public void getApplicationIconBadgeNumber(Promise promise) {
        promise.resolve(0);
    }

    private void sendEvent(String eventName, WritableMap params) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(eventName, params);
    }

    private static class ScheduledNotification {
        String id;
        ReadableMap options;
    }
}
