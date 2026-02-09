#import "RNOTR.h"

@implementation RNOTR

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents {
  return @[ @"onTextRecognized" ];
}

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

RCT_REMAP_METHOD(checkCameraPermission,
                 checkCameraPermissionWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
  // For now, always resolve granted; production code should query AVAuthorizationStatus
  resolve(@"granted");
}

RCT_REMAP_METHOD(requestCameraPermission,
                 requestCameraPermissionWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
  // For now, resolve YES; production code should request access and resolve based on result
  resolve(@(YES));
}

RCT_REMAP_METHOD(startCamera,
                 startCameraWithOptions:(NSDictionary *)options
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
  // TODO: Configure AVCaptureSession
  resolve(nil);
}

RCT_REMAP_METHOD(stopCamera,
                 stopCameraWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
  // TODO: Stop AVCaptureSession
  resolve(nil);
}

RCT_REMAP_METHOD(startLiveTextRecognition,
                 startLiveTextRecognitionWithOptions:(NSDictionary *)options
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
  // TODO: Start live Vision text recognition on camera frames
  resolve(nil);
}

RCT_REMAP_METHOD(stopLiveTextRecognition,
                 stopLiveTextRecognitionWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
  // TODO: Stop live recognition
  resolve(nil);
}

RCT_REMAP_METHOD(captureAndRecognize,
                 captureAndRecognizeWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
  reject(@"E_NOT_IMPLEMENTED", @"captureAndRecognize not yet implemented", nil);
}

RCT_REMAP_METHOD(recognizeFromImage,
                 recognizeFromImageWithPath:(NSString *)imagePathOrBase64
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
  // For now, return an empty result; production code should use Vision
  NSDictionary *result = @{
    @"text": @"",
    @"blocks": @[],
  };
  resolve(result);
}

@end
