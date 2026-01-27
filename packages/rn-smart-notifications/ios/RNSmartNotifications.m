#import "RNSmartNotifications.h"
#import <UserNotifications/UserNotifications.h>
#import <React/RCTConvert.h>

@implementation RNSmartNotifications

RCT_EXPORT_MODULE()

- (NSArray<NSString *> *)supportedEvents {
    return @[@"onNotification", @"onNotificationOpened", @"onRegistrationError"];
}

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

RCT_EXPORT_METHOD(requestPermissions:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
    
    UNAuthorizationOptions options = UNAuthorizationOptionAlert | 
                                       UNAuthorizationOptionSound | 
                                       UNAuthorizationOptionBadge;
    
    [center requestAuthorizationWithOptions:options
                          completionHandler:^(BOOL granted, NSError * _Nullable error) {
        if (error) {
            reject(@"PERMISSION_DENIED", error.localizedDescription, error);
        } else {
            resolve(@(granted));
        }
    }];
}

RCT_EXPORT_METHOD(checkPermissions:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
    [center getNotificationSettingsWithCompletionHandler:^(UNNotificationSettings * _Nonnull settings) {
        resolve(@(settings.authorizationStatus == UNAuthorizationStatusAuthorized));
    }];
}

RCT_EXPORT_METHOD(showNotification:(NSString *)id
                  options:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    UNMutableNotificationContent *content = [[UNMutableNotificationContent alloc] init];
    content.title = options[@"title"];
    content.body = options[@"body"];
    
    if (options[@"sound"]) {
        content.sound = [UNNotificationSound soundNamed:options[@"sound"]];
    } else {
        content.sound = [UNNotificationSound defaultSound];
    }
    
    if (options[@"badge"]) {
        content.badge = @([options[@"badge"] integerValue]);
    }
    
    if (options[@"category"]) {
        content.categoryIdentifier = options[@"category"];
    }
    
    if (options[@"threadId"]) {
        content.threadIdentifier = options[@"threadId"];
    }
    
    UNNotificationTrigger *trigger = [UNTimeIntervalNotificationTrigger triggerWithTimeInterval:0.1 repeats:NO];
    
    UNNotificationRequest *request = [UNNotificationRequest requestWithIdentifier:id 
                                                                          content:content 
                                                                          trigger:trigger];
    
    UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
    [center addNotificationRequest:request withCompletionHandler:^(NSError * _Nullable error) {
        if (error) {
            reject(@"NOTIFICATION_FAILED", error.localizedDescription, error);
        } else {
            NSDictionary *result = @{
                @"id": id,
                @"success": @YES
            };
            resolve(result);
        }
    }];
}

RCT_EXPORT_METHOD(scheduleNotification:(NSString *)id
                  options:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    UNMutableNotificationContent *content = [[UNMutableNotificationContent alloc] init];
    content.title = options[@"title"];
    content.body = options[@"body"];
    
    if (options[@"sound"]) {
        content.sound = [UNNotificationSound soundNamed:options[@"sound"]];
    }
    
    if (options[@"badge"]) {
        content.badge = @([options[@"badge"] integerValue]);
    }
    
    NSDate *date = [RCTConvert NSDate:options[@"date"]];
    NSDateComponents *triggerDate = [[NSCalendar currentCalendar] components:(NSCalendarUnitYear | NSCalendarUnitMonth | NSCalendarUnitDay | NSCalendarUnitHour | NSCalendarUnitMinute | NSCalendarUnitSecond) fromDate:date];
    
    UNCalendarNotificationTrigger *trigger = [UNCalendarNotificationTrigger triggerWithDateMatching:triggerDate repeats:NO];
    
    UNNotificationRequest *request = [UNNotificationRequest requestWithIdentifier:id 
                                                                          content:content 
                                                                          trigger:trigger];
    
    UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
    [center addNotificationRequest:request withCompletionHandler:^(NSError * _Nullable error) {
        if (error) {
            reject(@"NOTIFICATION_FAILED", error.localizedDescription, error);
        } else {
            NSDictionary *result = @{
                @"id": id,
                @"success": @YES
            };
            resolve(result);
        }
    }];
}

RCT_EXPORT_METHOD(cancelNotification:(NSString *)id
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
    [center removePendingNotificationRequestsWithIdentifiers:@[id]];
    [center removeDeliveredNotificationsWithIdentifiers:@[id]];
    resolve(nil);
}

RCT_EXPORT_METHOD(cancelAllNotifications:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
    [center removeAllPendingNotificationRequests];
    [center removeAllDeliveredNotifications];
    resolve(nil);
}

RCT_EXPORT_METHOD(getScheduledNotifications:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
    [center getPendingNotificationRequestsWithCompletionHandler:^(NSArray<UNNotificationRequest *> * _Nonnull requests) {
        resolve(@[]);
    }];
}

RCT_EXPORT_METHOD(createChannel:(NSDictionary *)channel
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    resolve(nil);
}

RCT_EXPORT_METHOD(deleteChannel:(NSString *)channelId
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    resolve(nil);
}

RCT_EXPORT_METHOD(setApplicationIconBadgeNumber:(NSNumber *)number
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    [UIApplication sharedApplication].applicationIconBadgeNumber = [number integerValue];
    resolve(nil);
}

RCT_EXPORT_METHOD(getApplicationIconBadgeNumber:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    resolve(@([UIApplication sharedApplication].applicationIconBadgeNumber));
}

@end
