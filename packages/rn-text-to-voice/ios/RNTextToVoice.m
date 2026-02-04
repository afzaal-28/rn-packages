#import "RNTextToVoice.h"
#import <AVFoundation/AVFoundation.h>

@interface RNTextToVoice () <AVSpeechSynthesizerDelegate>

@property (nonatomic, strong) AVSpeechSynthesizer *synthesizer;
@property (nonatomic, assign) BOOL isSpeaking;
@property (nonatomic, strong) NSString *defaultLanguage;
@property (nonatomic, assign) float defaultRate;
@property (nonatomic, assign) float defaultPitch;

@end

@implementation RNTextToVoice

RCT_EXPORT_MODULE()

- (instancetype)init {
    self = [super init];
    if (self) {
        _synthesizer = [[AVSpeechSynthesizer alloc] init];
        _synthesizer.delegate = self;
        _isSpeaking = NO;
        _defaultLanguage = @"en-US";
        _defaultRate = AVSpeechUtteranceDefaultSpeechRate;
        _defaultPitch = 1.0f;
    }
    return self;
}

- (NSArray<NSString *> *)supportedEvents {
    return @[@"onStart", @"onFinish", @"onError"];
}

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

RCT_EXPORT_METHOD(speak:(NSString *)text
                  options:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    if (!text || [text length] == 0) {
        reject(@"INVALID_REQUEST", @"Text cannot be empty", nil);
        return;
    }
    
    dispatch_async(dispatch_get_main_queue(), ^{
        AVSpeechUtterance *utterance = [AVSpeechUtterance speechUtteranceWithString:text];
        
        NSString *language = options[@"language"] ?: self.defaultLanguage;
        float rate = options[@"rate"] ? [options[@"rate"] floatValue] : self.defaultRate;
        float pitch = options[@"pitch"] ? [options[@"pitch"] floatValue] : self.defaultPitch;
        float volume = options[@"volume"] ? [options[@"volume"] floatValue] : 1.0f;
        NSString *voiceId = options[@"voice"];
        
        AVSpeechSynthesisVoice *voice = nil;
        if (voiceId) {
            voice = [AVSpeechSynthesisVoice voiceWithIdentifier:voiceId];
        }
        
        if (!voice) {
            voice = [AVSpeechSynthesisVoice voiceWithLanguage:language];
        }
        
        if (!voice) {
            reject(@"NOT_AVAILABLE", [NSString stringWithFormat:@"Voice not available for language: %@", language], nil);
            return;
        }
        
        utterance.voice = voice;
        utterance.rate = rate;
        utterance.pitchMultiplier = pitch;
        utterance.volume = volume;
        
        if (self.synthesizer.isSpeaking) {
            [self.synthesizer stopSpeakingAtBoundary:AVSpeechBoundaryImmediate];
        }
        
        [self.synthesizer speakUtterance:utterance];
        self.isSpeaking = YES;
        resolve(nil);
    });
}

RCT_EXPORT_METHOD(stop:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    dispatch_async(dispatch_get_main_queue(), ^{
        if (self.synthesizer.isSpeaking) {
            [self.synthesizer stopSpeakingAtBoundary:AVSpeechBoundaryImmediate];
        }
        self.isSpeaking = NO;
        resolve(nil);
    });
}

RCT_EXPORT_METHOD(isSpeaking:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    resolve(@(self.isSpeaking));
}

RCT_EXPORT_METHOD(getAvailableVoices:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    NSArray<AVSpeechSynthesisVoice *> *voices = [AVSpeechSynthesisVoice speechVoices];
    NSMutableArray *voicesArray = [NSMutableArray array];
    
    for (AVSpeechSynthesisVoice *voice in voices) {
        NSDictionary *voiceDict = @{
            @"id": voice.identifier,
            @"name": voice.name,
            @"language": voice.language,
            @"quality": [self getQualityString:voice.quality]
        };
        [voicesArray addObject:voiceDict];
    }
    
    resolve(voicesArray);
}

RCT_EXPORT_METHOD(setDefaultLanguage:(NSString *)language
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    AVSpeechSynthesisVoice *voice = [AVSpeechSynthesisVoice voiceWithLanguage:language];
    if (!voice) {
        reject(@"NOT_AVAILABLE", [NSString stringWithFormat:@"Language not supported: %@", language], nil);
        return;
    }
    
    self.defaultLanguage = language;
    resolve(nil);
}

RCT_EXPORT_METHOD(setDefaultRate:(double)rate
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    self.defaultRate = (float)rate;
    resolve(nil);
}

RCT_EXPORT_METHOD(setDefaultPitch:(double)pitch
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    self.defaultPitch = (float)pitch;
    resolve(nil);
}

RCT_EXPORT_METHOD(exportToFile:(NSString *)text
                  options:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    if (!text || [text length] == 0) {
        reject(@"INVALID_REQUEST", @"Text cannot be empty", nil);
        return;
    }
    
    NSString *outputPath = options[@"outputPath"];
    if (!outputPath) {
        reject(@"INVALID_REQUEST", @"Output path is required", nil);
        return;
    }
    
    if (@available(iOS 13.0, *)) {
        AVSpeechUtterance *utterance = [[AVSpeechUtterance alloc] initWithString:text];
        
        NSString *language = options[@"language"] ?: self.defaultLanguage;
        float rate = options[@"rate"] ? [options[@"rate"] floatValue] : self.defaultRate;
        float pitch = options[@"pitch"] ? [options[@"pitch"] floatValue] : self.defaultPitch;
        NSString *voiceId = options[@"voice"];
        
        AVSpeechSynthesisVoice *voice = nil;
        if (voiceId) {
            voice = [AVSpeechSynthesisVoice voiceWithIdentifier:voiceId];
        }
        
        if (!voice) {
            voice = [AVSpeechSynthesisVoice voiceWithLanguage:language];
        }
        
        if (!voice) {
            reject(@"NOT_AVAILABLE", [NSString stringWithFormat:@"Voice not available for language: %@", language], nil);
            return;
        }
        
        utterance.voice = voice;
        utterance.rate = rate;
        utterance.pitchMultiplier = pitch;
        
        AVSpeechSynthesizer *fileSynthesizer = [[AVSpeechSynthesizer alloc] init];
        NSURL *outputURL = [NSURL fileURLWithPath:outputPath];
        
        __block AVAudioFile *output = nil;
        
        [fileSynthesizer writeUtterance:utterance toBufferCallback:^(AVAudioBuffer * _Nonnull buffer) {
            AVAudioPCMBuffer *pcmBuffer = (AVAudioPCMBuffer*)buffer;
            if (!pcmBuffer) {
                NSLog(@"Error: Invalid buffer type");
                return;
            }
            
            if (pcmBuffer.frameLength == 0) {
            } else {
                if (output == nil) {
                    NSError *fileError = nil;
                    output = [[AVAudioFile alloc] initForWriting:outputURL
                                                         settings:pcmBuffer.format.settings
                                                     commonFormat:AVAudioPCMFormatInt16
                                                      interleaved:NO
                                                            error:&fileError];
                    if (fileError) {
                        NSLog(@"Error creating audio file: %@", fileError.localizedDescription);
                        return;
                    }
                }
                
                NSError *writeError = nil;
                [output writeFromBuffer:pcmBuffer error:&writeError];
                if (writeError) {
                    NSLog(@"Error writing buffer: %@", writeError.localizedDescription);
                }
            }
        }];
        
        resolve(outputPath);
    } else {
        reject(@"NOT_SUPPORTED", @"Export to file requires iOS 13.0 or later", nil);
    }
}

- (NSString *)getQualityString:(AVSpeechSynthesisVoiceQuality)quality {
    switch (quality) {
        case AVSpeechSynthesisVoiceQualityDefault:
            return @"default";
        case AVSpeechSynthesisVoiceQualityEnhanced:
            return @"enhanced";
        case AVSpeechSynthesisVoiceQualityPremium:
            return @"premium";
        default:
            return @"unknown";
    }
}

#pragma mark - AVSpeechSynthesizerDelegate

- (void)speechSynthesizer:(AVSpeechSynthesizer *)synthesizer didStartSpeechUtterance:(AVSpeechUtterance *)utterance {
    self.isSpeaking = YES;
    [self sendEventWithName:@"onStart" body:@{}];
}

- (void)speechSynthesizer:(AVSpeechSynthesizer *)synthesizer didFinishSpeechUtterance:(AVSpeechUtterance *)utterance {
    self.isSpeaking = NO;
    [self sendEventWithName:@"onFinish" body:@{}];
}

- (void)speechSynthesizer:(AVSpeechSynthesizer *)synthesizer didCancelSpeechUtterance:(AVSpeechUtterance *)utterance {
    self.isSpeaking = NO;
    [self sendEventWithName:@"onFinish" body:@{}];
}

- (void)dealloc {
    if (self.synthesizer.isSpeaking) {
        [self.synthesizer stopSpeakingAtBoundary:AVSpeechBoundaryImmediate];
    }
}

@end
