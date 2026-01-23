#import "RNSpeechToText.h"
#import <Speech/Speech.h>
#import <AVFoundation/AVFoundation.h>

@interface RNSpeechToText () <SFSpeechRecognizerDelegate>

@property (nonatomic, strong) SFSpeechRecognizer *speechRecognizer;
@property (nonatomic, strong) SFSpeechAudioBufferRecognitionRequest *recognitionRequest;
@property (nonatomic, strong) SFSpeechRecognitionTask *recognitionTask;
@property (nonatomic, strong) AVAudioEngine *audioEngine;
@property (nonatomic, assign) BOOL isListening;

@end

@implementation RNSpeechToText

RCT_EXPORT_MODULE()

- (instancetype)init {
    self = [super init];
    if (self) {
        _audioEngine = [[AVAudioEngine alloc] init];
        _isListening = NO;
    }
    return self;
}

- (NSArray<NSString *> *)supportedEvents {
    return @[@"onStart", @"onPartialResult", @"onResult", @"onError", @"onEnd"];
}

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

RCT_EXPORT_METHOD(startListening:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    if (self.isListening) {
        reject(@"RECOGNIZER_BUSY", @"Speech recognizer is already listening", nil);
        return;
    }
    
    NSString *language = options[@"language"] ?: @"en-US";
    NSLocale *locale = [NSLocale localeWithLocaleIdentifier:language];
    self.speechRecognizer = [[SFSpeechRecognizer alloc] initWithLocale:locale];
    
    if (!self.speechRecognizer) {
        reject(@"NOT_AVAILABLE", @"Speech recognition is not available for this language", nil);
        return;
    }
    
    self.speechRecognizer.delegate = self;
    
    [SFSpeechRecognizer requestAuthorization:^(SFSpeechRecognizerAuthorizationStatus status) {
        dispatch_async(dispatch_get_main_queue(), ^{
            switch (status) {
                case SFSpeechRecognizerAuthorizationStatusAuthorized:
                    [self startRecognitionWithOptions:options resolver:resolve rejecter:reject];
                    break;
                case SFSpeechRecognizerAuthorizationStatusDenied:
                    reject(@"INSUFFICIENT_PERMISSIONS", @"Speech recognition permission denied", nil);
                    break;
                case SFSpeechRecognizerAuthorizationStatusRestricted:
                    reject(@"INSUFFICIENT_PERMISSIONS", @"Speech recognition restricted on this device", nil);
                    break;
                case SFSpeechRecognizerAuthorizationStatusNotDetermined:
                    reject(@"INSUFFICIENT_PERMISSIONS", @"Speech recognition permission not determined", nil);
                    break;
            }
        });
    }];
}

- (void)startRecognitionWithOptions:(NSDictionary *)options
                           resolver:(RCTPromiseResolveBlock)resolve
                           rejecter:(RCTPromiseRejectBlock)reject {
    
    AVAudioSession *audioSession = [AVAudioSession sharedInstance];
    NSError *error = nil;
    
    [audioSession setCategory:AVAudioSessionCategoryRecord
                         mode:AVAudioSessionModeMeasurement
                      options:AVAudioSessionCategoryOptionDuckOthers
                        error:&error];
    
    if (error) {
        reject(@"AUDIO", @"Failed to set audio session category", error);
        return;
    }
    
    [audioSession setActive:YES withOptions:AVAudioSessionSetActiveOptionNotifyOthersOnDeactivation error:&error];
    
    if (error) {
        reject(@"AUDIO", @"Failed to activate audio session", error);
        return;
    }
    
    if (self.recognitionTask) {
        [self.recognitionTask cancel];
        self.recognitionTask = nil;
    }
    
    self.recognitionRequest = [[SFSpeechAudioBufferRecognitionRequest alloc] init];
    
    AVAudioInputNode *inputNode = self.audioEngine.inputNode;
    if (!inputNode) {
        reject(@"AUDIO", @"Audio engine has no input node", nil);
        return;
    }
    
    if (!self.recognitionRequest) {
        reject(@"ERROR", @"Unable to create recognition request", nil);
        return;
    }
    
    BOOL partialResults = options[@"partialResults"] ? [options[@"partialResults"] boolValue] : YES;
    self.recognitionRequest.shouldReportPartialResults = partialResults;
    
    if (@available(iOS 13.0, *)) {
        self.recognitionRequest.requiresOnDeviceRecognition = NO;
    }
    
    __weak typeof(self) weakSelf = self;
    self.recognitionTask = [self.speechRecognizer recognitionTaskWithRequest:self.recognitionRequest
                                                                resultHandler:^(SFSpeechRecognitionResult *result, NSError *error) {
        __strong typeof(weakSelf) strongSelf = weakSelf;
        if (!strongSelf) return;
        
        if (error) {
            [strongSelf handleError:error];
            [strongSelf stopRecognition];
            return;
        }
        
        if (result) {
            NSString *transcript = result.bestTranscription.formattedString;
            NSDictionary *resultDict = @{
                @"transcript": transcript ?: @"",
                @"isFinal": @(result.isFinal)
            };
            
            if (result.isFinal) {
                [strongSelf sendEventWithName:@"onResult" body:resultDict];
                [strongSelf stopRecognition];
                [strongSelf sendEventWithName:@"onEnd" body:@{}];
            } else {
                [strongSelf sendEventWithName:@"onPartialResult" body:resultDict];
            }
        }
    }];
    
    AVAudioFormat *recordingFormat = [inputNode outputFormatForBus:0];
    [inputNode installTapOnBus:0 bufferSize:1024 format:recordingFormat block:^(AVAudioPCMBuffer *buffer, AVAudioTime *when) {
        __strong typeof(weakSelf) strongSelf = weakSelf;
        if (strongSelf && strongSelf.recognitionRequest) {
            [strongSelf.recognitionRequest appendAudioPCMBuffer:buffer];
        }
    }];
    
    [self.audioEngine prepare];
    [self.audioEngine startAndReturnError:&error];
    
    if (error) {
        reject(@"AUDIO", @"Failed to start audio engine", error);
        return;
    }
    
    self.isListening = YES;
    [self sendEventWithName:@"onStart" body:@{}];
    resolve(nil);
}

RCT_EXPORT_METHOD(stopListening:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    if (!self.isListening) {
        resolve(nil);
        return;
    }
    
    [self stopRecognition];
    resolve(nil);
}

RCT_EXPORT_METHOD(cancel:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    if (self.recognitionTask) {
        [self.recognitionTask cancel];
        self.recognitionTask = nil;
    }
    
    [self stopRecognition];
    self.isListening = NO;
    resolve(nil);
}

RCT_EXPORT_METHOD(isListening:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    resolve(@(self.isListening));
}

RCT_EXPORT_METHOD(requestPermissions:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    [SFSpeechRecognizer requestAuthorization:^(SFSpeechRecognizerAuthorizationStatus status) {
        BOOL authorized = (status == SFSpeechRecognizerAuthorizationStatusAuthorized);
        
        if (authorized) {
            [[AVAudioSession sharedInstance] requestRecordPermission:^(BOOL granted) {
                resolve(@(granted));
            }];
        } else {
            resolve(@NO);
        }
    }];
}

RCT_EXPORT_METHOD(checkPermissions:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    SFSpeechRecognizerAuthorizationStatus speechStatus = [SFSpeechRecognizer authorizationStatus];
    BOOL speechAuthorized = (speechStatus == SFSpeechRecognizerAuthorizationStatusAuthorized);
    
    AVAudioSessionRecordPermission micPermission = [[AVAudioSession sharedInstance] recordPermission];
    BOOL micAuthorized = (micPermission == AVAudioSessionRecordPermissionGranted);
    
    resolve(@(speechAuthorized && micAuthorized));
}

- (void)stopRecognition {
    self.isListening = NO;
    
    if (self.audioEngine.isRunning) {
        [self.audioEngine stop];
        [self.audioEngine.inputNode removeTapOnBus:0];
    }
    
    if (self.recognitionRequest) {
        [self.recognitionRequest endAudio];
        self.recognitionRequest = nil;
    }
    
    if (self.recognitionTask) {
        [self.recognitionTask finish];
        self.recognitionTask = nil;
    }
}

- (void)handleError:(NSError *)error {
    NSString *errorCode = @"UNKNOWN";
    NSString *errorMessage = error.localizedDescription ?: @"Unknown error";
    
    if ([error.domain isEqualToString:@"kLSRErrorDomain"]) {
        switch (error.code) {
            case 1110:
                errorCode = @"NO_MATCH";
                errorMessage = @"No speech detected";
                break;
            case 1700:
                errorCode = @"NETWORK";
                errorMessage = @"Network error";
                break;
            default:
                errorCode = @"SERVER";
                break;
        }
    }
    
    NSDictionary *errorDict = @{
        @"code": errorCode,
        @"message": errorMessage
    };
    
    [self sendEventWithName:@"onError" body:errorDict];
}

#pragma mark - SFSpeechRecognizerDelegate

- (void)speechRecognizer:(SFSpeechRecognizer *)speechRecognizer availabilityDidChange:(BOOL)available {
    if (!available && self.isListening) {
        [self stopRecognition];
        NSDictionary *errorDict = @{
            @"code": @"NOT_AVAILABLE",
            @"message": @"Speech recognition became unavailable"
        };
        [self sendEventWithName:@"onError" body:errorDict];
    }
}

- (void)dealloc {
    [self stopRecognition];
}

@end
