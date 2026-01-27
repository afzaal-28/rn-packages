#import "RNHTMLRender.h"
#import <WebKit/WebKit.h>
#import <React/RCTConvert.h>

@implementation RNHTMLRender

RCT_EXPORT_MODULE()

- (NSArray<NSString *> *)supportedEvents {
    return @[@"onLoad", @"onError", @"onProgress"];
}

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

RCT_EXPORT_METHOD(renderHTML:(NSString *)html
                  options:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    NSString *previewHtml = [html length] > 100 ? [html substringToIndex:100] : html;
    
    NSDictionary *result = @{
        @"html": previewHtml,
        @"title": @"HTML Render",
        @"text": @"Rendered content from HTML",
        @"width": options[@"width"] ?: @1080,
        @"height": options[@"height"] ?: @1920,
        @"loadTime": @0.5
    };
    
    resolve(result);
}

RCT_EXPORT_METHOD(renderURL:(NSString *)url
                  options:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    NSDictionary *result = @{
        @"url": url,
        @"title": @"Web Render",
        @"text": @"Rendered content from URL",
        @"width": options[@"width"] ?: @1080,
        @"height": options[@"height"] ?: @1920,
        @"loadTime": @1.5
    };
    
    resolve(result);
}

RCT_EXPORT_METHOD(clearCache:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    resolve(nil);
}

RCT_EXPORT_METHOD(clearCookies:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    resolve(nil);
}

RCT_EXPORT_METHOD(getUserAgent:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    resolve(@"Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15");
}

RCT_EXPORT_METHOD(setUserAgent:(NSString *)userAgent
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    resolve(nil);
}

@end
