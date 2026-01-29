#import "RNOCR.h"
#import <Vision/Vision.h>
#import <UIKit/UIKit.h>
#import <React/RCTConvert.h>

@implementation RNOCR

RCT_EXPORT_MODULE()

- (NSArray<NSString *> *)supportedEvents {
    return @[@"onResult", @"onError"];
}

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

RCT_EXPORT_METHOD(requestPermissions:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    AVAuthorizationStatus status = [AVCaptureDevice authorizationStatusForMediaType:AVMediaTypeVideo];
    resolve(@(status == AVAuthorizationStatusAuthorized));
}

RCT_EXPORT_METHOD(checkPermissions:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    AVAuthorizationStatus status = [AVCaptureDevice authorizationStatusForMediaType:AVMediaTypeVideo];
    resolve(@(status == AVAuthorizationStatusAuthorized));
}

RCT_EXPORT_METHOD(recognizeText:(NSString *)imageUri
                  options:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    UIImage *image = [self loadImageFromURI:imageUri];
    if (!image) {
        reject(@"NO_IMAGE", @"Failed to load image from URI", nil);
        return;
    }
    
    VNImageRequestHandler *handler = [[VNImageRequestHandler alloc] initWithImage:image options:@{}];
    VNRecognizeTextRequest *request = [[VNRecognizeTextRequest alloc] init];
    
    request.recognitionLevel = VNRequestTextRecognitionLevelAccurate;
    request.recognitionLanguages = @[@"en-US"];
    
    if (@available(iOS 13.0, *)) {
        request.usesLanguageCorrection = YES;
    }
    
    NSError *error = nil;
    [handler performRequests:@[request] error:&error];
    
    if (error) {
        reject(@"RECOGNITION_FAILED", error.localizedDescription, error);
        return;
    }
    
    NSMutableString *recognizedText = [NSMutableString string];
    VNTextObservation *firstObservation = nil;
    
    for (VNRecognizedTextObservation *observation in request.results) {
        for (VNRecognizedText *recognizedTextItem in observation.topLevelRecognizedItems) {
            [recognizedText appendString:[recognizedTextItem string]];
            [recognizedText appendString:@"\n"];
        }
        
        if (!firstObservation) {
            firstObservation = observation;
        }
    }
    
    NSDictionary *resultDict = @{
        @"text": recognizedText
    };
    
    if (firstObservation) {
        CGRect boundingBox = [firstObservation boundingBox];
        CGFloat imageSize = MAX(image.size.width, image.size.height);
        
        NSDictionary *boundingBoxDict = @{
            @"x": @(boundingBox.origin.x * imageSize),
            @"y": @(boundingBox.origin.y * imageSize),
            @"width": @(boundingBox.size.width * imageSize),
            @"height": @(boundingBox.size.height * imageSize)
        };
        
        NSMutableDictionary *mutableResult = [resultDict mutableCopy];
        mutableResult[@"boundingBox"] = boundingBoxDict;
        resultDict = mutableResult;
    }
    
    resolve(resultDict);
}

- (UIImage *)loadImageFromURI:(NSString *)uriString {
    NSURL *url = [NSURL URLWithString:uriString];
    
    if (!url || [url.scheme isEqualToString:@"file"]) {
        NSString *path = url ? url.path : uriString;
        if ([[NSFileManager defaultManager] fileExistsAtPath:path]) {
            return [UIImage imageWithContentsOfFile:path];
        }
        return nil;
    }
    
    if ([url.scheme isEqualToString:@"data"]) {
        NSString *base64Data = [uriString substringFromIndex:[uriString rangeOfString:@","].location + 1];
        NSData *decodedData = [[NSData alloc] initWithBase64EncodedString:base64Data options:0];
        return [UIImage imageWithData:decodedData];
    }
    
    if ([url.scheme isEqualToString:@"content"] || [url.scheme isEqualToString:@"assets-library"]) {
        PHFetchResult *fetchResult = [PHAsset fetchAssetsWithALAssetURLs:@[url] options:nil];
        PHAsset *asset = fetchResult.firstObject;
        
        if (asset) {
            PHImageManager *manager = [PHImageManager defaultManager];
            __block UIImage *image = nil;
            [manager requestImageForAsset:asset
                           targetSize:PHImageManagerMaximumSize
                          contentMode:PHImageContentModeAspectFill
                              options:nil
                        resultHandler:^(UIImage *result, NSDictionary *info) {
                image = result;
            }];
            return image;
        }
    }
    
    return nil;
}

@end
