package com.rntexttospeech;

import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;
import android.speech.tts.Voice;

import android.os.Bundle;
import java.io.File;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.Locale;
import java.util.Set;

public class RNTextToSpeechModule extends ReactContextBaseJavaModule {
    private static final String MODULE_NAME = "RNTextToSpeech";
    private static final String UTTERANCE_ID = "RNTextToSpeech";
    
    private final ReactApplicationContext reactContext;
    private TextToSpeech tts;
    private boolean isInitialized = false;
    private boolean isSpeaking = false;
    private String defaultLanguage = "en-US";
    private float defaultRate = 1.0f;
    private float defaultPitch = 1.0f;

    public RNTextToSpeechModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        initializeTTS();
    }

    @Override
    public String getName() {
        return MODULE_NAME;
    }

    private void initializeTTS() {
        tts = new TextToSpeech(reactContext, new TextToSpeech.OnInitListener() {
            @Override
            public void onInit(int status) {
                if (status == TextToSpeech.SUCCESS) {
                    isInitialized = true;
                    setupUtteranceListener();
                    
                    int result = tts.setLanguage(Locale.US);
                    if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
                        sendEvent("onError", createErrorMap("INITIALIZATION_ERROR", "Language not supported"));
                    }
                } else {
                    sendEvent("onError", createErrorMap("INITIALIZATION_ERROR", "Failed to initialize TTS engine"));
                }
            }
        });
    }

    private void setupUtteranceListener() {
        tts.setOnUtteranceProgressListener(new UtteranceProgressListener() {
            @Override
            public void onStart(String utteranceId) {
                isSpeaking = true;
                sendEvent("onStart", Arguments.createMap());
            }

            @Override
            public void onDone(String utteranceId) {
                isSpeaking = false;
                sendEvent("onFinish", Arguments.createMap());
            }

            @Override
            public void onError(String utteranceId) {
                isSpeaking = false;
                sendEvent("onError", createErrorMap("SYNTHESIS_ERROR", "Speech synthesis failed"));
            }
        });
    }

    @ReactMethod
    public void speak(String text, ReadableMap options, Promise promise) {
        if (!isInitialized) {
            promise.reject("NOT_AVAILABLE", "TTS engine not initialized");
            return;
        }

        if (text == null || text.trim().isEmpty()) {
            promise.reject("INVALID_REQUEST", "Text cannot be empty");
            return;
        }

        try {
            String language = options.hasKey("language") ? options.getString("language") : defaultLanguage;
            float rate = options.hasKey("rate") ? (float) options.getDouble("rate") : defaultRate;
            float pitch = options.hasKey("pitch") ? (float) options.getDouble("pitch") : defaultPitch;
            float volume = options.hasKey("volume") ? (float) options.getDouble("volume") : 1.0f;
            String voiceId = options.hasKey("voice") ? options.getString("voice") : null;

            Locale locale = parseLocale(language);
            int result = tts.setLanguage(locale);
            
            if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
                promise.reject("NOT_AVAILABLE", "Language not supported: " + language);
                return;
            }

            tts.setSpeechRate(rate);
            tts.setPitch(pitch);

            if (voiceId != null) {
                Set<Voice> voices = tts.getVoices();
                for (Voice voice : voices) {
                    if (voice.getName().equals(voiceId)) {
                        tts.setVoice(voice);
                        break;
                    }
                }
            }

            Bundle params = new Bundle();
            params.putString(TextToSpeech.Engine.KEY_PARAM_UTTERANCE_ID, UTTERANCE_ID);
            params.putFloat(TextToSpeech.Engine.KEY_PARAM_VOLUME, volume);

            int speakResult = tts.speak(text, TextToSpeech.QUEUE_FLUSH, params, UTTERANCE_ID);
            
            if (speakResult == TextToSpeech.SUCCESS) {
                promise.resolve(null);
            } else {
                promise.reject("SYNTHESIS_ERROR", "Failed to start speech synthesis");
            }
        } catch (Exception e) {
            promise.reject("UNKNOWN", "Error: " + e.getMessage());
        }
    }

    @ReactMethod
    public void stop(Promise promise) {
        try {
            if (tts != null) {
                tts.stop();
                isSpeaking = false;
            }
            promise.resolve(null);
        } catch (Exception e) {
            promise.reject("ERROR", "Failed to stop: " + e.getMessage());
        }
    }

    @ReactMethod
    public void isSpeaking(Promise promise) {
        promise.resolve(isSpeaking);
    }

    @ReactMethod
    public void getAvailableVoices(Promise promise) {
        if (!isInitialized) {
            promise.reject("NOT_AVAILABLE", "TTS engine not initialized");
            return;
        }

        try {
            WritableArray voicesArray = Arguments.createArray();
            Set<Voice> voices = tts.getVoices();
            
            if (voices != null) {
                for (Voice voice : voices) {
                    WritableMap voiceMap = Arguments.createMap();
                    voiceMap.putString("id", voice.getName());
                    voiceMap.putString("name", voice.getName());
                    voiceMap.putString("language", voice.getLocale().toString());
                    voiceMap.putString("quality", getQualityString(voice.getQuality()));
                    voicesArray.pushMap(voiceMap);
                }
            }
            
            promise.resolve(voicesArray);
        } catch (Exception e) {
            promise.reject("ERROR", "Failed to get voices: " + e.getMessage());
        }
    }

    @ReactMethod
    public void setDefaultLanguage(String language, Promise promise) {
        try {
            Locale locale = parseLocale(language);
            int result = tts.setLanguage(locale);
            
            if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
                promise.reject("NOT_AVAILABLE", "Language not supported: " + language);
                return;
            }
            
            defaultLanguage = language;
            promise.resolve(null);
        } catch (Exception e) {
            promise.reject("ERROR", "Failed to set language: " + e.getMessage());
        }
    }

    @ReactMethod
    public void setDefaultRate(double rate, Promise promise) {
        try {
            defaultRate = (float) rate;
            tts.setSpeechRate(defaultRate);
            promise.resolve(null);
        } catch (Exception e) {
            promise.reject("ERROR", "Failed to set rate: " + e.getMessage());
        }
    }

    @ReactMethod
    public void setDefaultPitch(double pitch, Promise promise) {
        try {
            defaultPitch = (float) pitch;
            tts.setPitch(defaultPitch);
            promise.resolve(null);
        } catch (Exception e) {
            promise.reject("ERROR", "Failed to set pitch: " + e.getMessage());
        }
    }

    @ReactMethod
    public void exportToFile(String text, ReadableMap options, Promise promise) {
        if (!isInitialized) {
            promise.reject("NOT_AVAILABLE", "TTS engine not initialized");
            return;
        }

        if (text == null || text.trim().isEmpty()) {
            promise.reject("INVALID_REQUEST", "Text cannot be empty");
            return;
        }

        if (!options.hasKey("outputPath")) {
            promise.reject("INVALID_REQUEST", "Output path is required");
            return;
        }

        try {
            String outputPath = options.getString("outputPath");
            String language = options.hasKey("language") ? options.getString("language") : defaultLanguage;
            float rate = options.hasKey("rate") ? (float) options.getDouble("rate") : defaultRate;
            float pitch = options.hasKey("pitch") ? (float) options.getDouble("pitch") : defaultPitch;
            String voiceId = options.hasKey("voice") ? options.getString("voice") : null;

            Locale locale = parseLocale(language);
            int result = tts.setLanguage(locale);
            
            if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
                promise.reject("NOT_AVAILABLE", "Language not supported: " + language);
                return;
            }

            tts.setSpeechRate(rate);
            tts.setPitch(pitch);

            if (voiceId != null) {
                Set<Voice> voices = tts.getVoices();
                for (Voice voice : voices) {
                    if (voice.getName().equals(voiceId)) {
                        tts.setVoice(voice);
                        break;
                    }
                }
            }

            Bundle params = new Bundle();
            String utteranceId = "export_" + System.currentTimeMillis();
            params.putString(TextToSpeech.Engine.KEY_PARAM_UTTERANCE_ID, utteranceId);

            File outputFile = new File(outputPath);
            int synthesizeResult = tts.synthesizeToFile(text, params, outputFile, utteranceId);
            
            if (synthesizeResult == TextToSpeech.SUCCESS) {
                promise.resolve(outputPath);
            } else {
                promise.reject("EXPORT_ERROR", "Failed to export speech to file");
            }
        } catch (Exception e) {
            promise.reject("UNKNOWN", "Error: " + e.getMessage());
        }
    }

    private Locale parseLocale(String language) {
        String[] parts = language.replace("_", "-").split("-");
        if (parts.length == 1) {
            return new Locale(parts[0]);
        } else if (parts.length == 2) {
            return new Locale(parts[0], parts[1]);
        } else {
            return new Locale(parts[0], parts[1], parts[2]);
        }
    }

    private String getQualityString(int quality) {
        switch (quality) {
            case Voice.QUALITY_VERY_HIGH:
                return "very-high";
            case Voice.QUALITY_HIGH:
                return "high";
            case Voice.QUALITY_NORMAL:
                return "normal";
            case Voice.QUALITY_LOW:
                return "low";
            case Voice.QUALITY_VERY_LOW:
                return "very-low";
            default:
                return "unknown";
        }
    }

    private WritableMap createErrorMap(String code, String message) {
        WritableMap errorMap = Arguments.createMap();
        errorMap.putString("code", code);
        errorMap.putString("message", message);
        return errorMap;
    }

    private void sendEvent(String eventName, WritableMap params) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(eventName, params);
    }

    @Override
    public void invalidate() {
        super.invalidate();
        if (tts != null) {
            tts.stop();
            tts.shutdown();
            tts = null;
        }
    }
}
