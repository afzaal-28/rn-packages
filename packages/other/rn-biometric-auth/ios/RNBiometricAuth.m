#import "RNBiometricAuth.h"
#import <LocalAuthentication/LocalAuthentication.h>
#import <React/RCTConvert.h>

@implementation RNBiometricAuth

RCT_EXPORT_MODULE()

- (NSArray<NSString *> *)supportedEvents {
    return @[@"onAuthSuccess", @"onAuthFailure"];
}

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

RCT_EXPORT_METHOD(authenticate:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    LAContext *context = [[LAContext alloc] init];
    NSError *error = nil;
    
    if ([context canEvaluatePolicy:LAPolicyDeviceOwnerAuthenticationWithBiometrics error:&error]) {
        NSString *localizedReason = options[@"promptMessage"] ?: @"Authenticate to continue";
        
        [context evaluatePolicy:LAPolicyDeviceOwnerAuthenticationWithBiometrics
                  localizedReason:localizedReason
                            reply:^(BOOL success, NSError *error) {
            if (success) {
                NSDictionary *result = @{
                    @"success": @YES
                };
                resolve(result);
            } else {
                NSString *errorCode = [self mapErrorCode:error.code];
                reject(errorCode, error.localizedDescription, error);
            }
        }];
    } else {
        reject(@"NOT_AVAILABLE", error.localizedDescription, error);
    }
}

RCT_EXPORT_METHOD(checkAvailability:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    LAContext *context = [[LAContext alloc] init];
    NSError *error = nil;
    
    BOOL canAuthenticate = [context canEvaluatePolicy:LAPolicyDeviceOwnerAuthenticationWithBiometrics error:&error];
    
    NSMutableDictionary *result = [NSMutableDictionary dictionary];
    result[@"available"] = @(canAuthenticate);
    result[@"hardware"] = @(error.code != LAErrorBiometryNotAvailable);
    result[@"permission"] = @YES;
    
    if (canAuthenticate) {
        if (@available(iOS 11.0, *)) {
            if (context.biometryType == LABiometryTypeFaceID) {
                result[@"biometryType"] = @"face";
            } else if (context.biometryType == LABiometryTypeTouchID) {
                result[@"biometryType"] = @"fingerprint";
            }
        } else {
            result[@"biometryType"] = @"fingerprint";
        }
    }
    
    resolve(result);
}

RCT_EXPORT_METHOD(isEnrolled:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    LAContext *context = [[LAContext alloc] init];
    NSError *error = nil;
    
    BOOL canAuthenticate = [context canEvaluatePolicy:LAPolicyDeviceOwnerAuthenticationWithBiometrics error:&error];
    resolve(@(canAuthenticate));
}

RCT_EXPORT_METHOD(cancelAuthentication:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    resolve(nil);
}

- (NSString *)mapErrorCode:(NSInteger)code {
    switch (code) {
        case LAErrorUserFallback:
        case LAErrorUserCancel:
        case LAErrorSystemCancel:
            return @"USER_CANCELED";
        case LAErrorAuthenticationFailed:
            return @"UNKNOWN";
        case LAErrorPasscodeNotSet:
        case LAErrorBiometryNotEnrolled:
            return @"NOT_ENROLLED";
        case LAErrorBiometryNotAvailable:
            return @"NOT_AVAILABLE";
        case LAErrorBiometryLockout:
            return @"LOCKOUT";
        default:
            return @"UNKNOWN";
    }
}

@end
