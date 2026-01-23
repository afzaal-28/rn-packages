package com.rnspeechtotext;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.modules.core.PermissionAwareActivity;
import com.facebook.react.modules.core.PermissionListener;

import java.util.ArrayList;
import java.util.Locale;

public class RNSpeechToTextModule extends ReactContextBaseJavaModule implements RecognitionListener {
    private static final String MODULE_NAME = "RNSpeechToText";
    private static final int PERMISSION_REQUEST_CODE = 1001;
    
    private final ReactApplicationContext reactContext;
    private SpeechRecognizer speechRecognizer;
    private boolean isListening = false;
    private Promise permissionPromise;

    public RNSpeechToTextModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return MODULE_NAME;
    }

    @ReactMethod
    public void startListening(ReadableMap options, Promise promise) {
        if (isListening) {
            promise.reject("RECOGNIZER_BUSY", "Speech recognizer is already listening");
            return;
        }

        if (!checkAudioPermission()) {
            promise.reject("INSUFFICIENT_PERMISSIONS", "Audio recording permission not granted");
            return;
        }

        if (!SpeechRecognizer.isRecognitionAvailable(reactContext)) {
            promise.reject("NOT_AVAILABLE", "Speech recognition is not available on this device");
            return;
        }

        try {
            if (speechRecognizer == null) {
                speechRecognizer = SpeechRecognizer.createSpeechRecognizer(reactContext);
                speechRecognizer.setRecognitionListener(this);
            }

            Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
            intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
            
            String language = options.hasKey("language") ? options.getString("language") : "en-US";
            intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, language);
            intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_PREFERENCE, language);
            
            int maxResults = options.hasKey("maxResults") ? options.getInt("maxResults") : 5;
            intent.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, maxResults);
            
            boolean partialResults = options.hasKey("partialResults") ? options.getBoolean("partialResults") : true;
            intent.putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, partialResults);

            speechRecognizer.startListening(intent);
            isListening = true;
            promise.resolve(null);
        } catch (Exception e) {
            promise.reject("ERROR", "Failed to start listening: " + e.getMessage());
        }
    }

    @ReactMethod
    public void stopListening(Promise promise) {
        if (!isListening) {
            promise.resolve(null);
            return;
        }

        try {
            if (speechRecognizer != null) {
                speechRecognizer.stopListening();
            }
            promise.resolve(null);
        } catch (Exception e) {
            promise.reject("ERROR", "Failed to stop listening: " + e.getMessage());
        }
    }

    @ReactMethod
    public void cancel(Promise promise) {
        try {
            if (speechRecognizer != null) {
                speechRecognizer.cancel();
            }
            isListening = false;
            promise.resolve(null);
        } catch (Exception e) {
            promise.reject("ERROR", "Failed to cancel: " + e.getMessage());
        }
    }

    @ReactMethod
    public void isListening(Promise promise) {
        promise.resolve(isListening);
    }

    @ReactMethod
    public void requestPermissions(Promise promise) {
        if (checkAudioPermission()) {
            promise.resolve(true);
            return;
        }

        PermissionAwareActivity activity = (PermissionAwareActivity) getCurrentActivity();
        if (activity == null) {
            promise.reject("ERROR", "Activity is null");
            return;
        }

        permissionPromise = promise;
        activity.requestPermissions(
            new String[]{Manifest.permission.RECORD_AUDIO},
            PERMISSION_REQUEST_CODE,
            new PermissionListener() {
                @Override
                public boolean onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
                    if (requestCode == PERMISSION_REQUEST_CODE) {
                        boolean granted = grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED;
                        if (permissionPromise != null) {
                            permissionPromise.resolve(granted);
                            permissionPromise = null;
                        }
                        return true;
                    }
                    return false;
                }
            }
        );
    }

    @ReactMethod
    public void checkPermissions(Promise promise) {
        promise.resolve(checkAudioPermission());
    }

    private boolean checkAudioPermission() {
        return ContextCompat.checkSelfPermission(reactContext, Manifest.permission.RECORD_AUDIO) 
            == PackageManager.PERMISSION_GRANTED;
    }

    private void sendEvent(String eventName, WritableMap params) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(eventName, params);
    }

    @Override
    public void onReadyForSpeech(Bundle params) {
        sendEvent("onStart", Arguments.createMap());
    }

    @Override
    public void onBeginningOfSpeech() {
    }

    @Override
    public void onRmsChanged(float rmsdB) {
    }

    @Override
    public void onBufferReceived(byte[] buffer) {
    }

    @Override
    public void onEndOfSpeech() {
        isListening = false;
    }

    @Override
    public void onError(int error) {
        isListening = false;
        
        WritableMap errorMap = Arguments.createMap();
        String errorCode = getErrorCode(error);
        String errorMessage = getErrorMessage(error);
        
        errorMap.putString("code", errorCode);
        errorMap.putString("message", errorMessage);
        
        sendEvent("onError", errorMap);
    }

    @Override
    public void onResults(Bundle results) {
        isListening = false;
        
        ArrayList<String> matches = results.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
        float[] scores = results.getFloatArray(SpeechRecognizer.CONFIDENCE_SCORES);
        
        if (matches != null && !matches.isEmpty()) {
            WritableMap result = Arguments.createMap();
            result.putString("transcript", matches.get(0));
            result.putBoolean("isFinal", true);
            
            if (scores != null && scores.length > 0) {
                result.putDouble("confidence", scores[0]);
            }
            
            sendEvent("onResult", result);
        }
        
        sendEvent("onEnd", Arguments.createMap());
    }

    @Override
    public void onPartialResults(Bundle partialResults) {
        ArrayList<String> matches = partialResults.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
        
        if (matches != null && !matches.isEmpty()) {
            WritableMap result = Arguments.createMap();
            result.putString("transcript", matches.get(0));
            result.putBoolean("isFinal", false);
            
            sendEvent("onPartialResult", result);
        }
    }

    @Override
    public void onEvent(int eventType, Bundle params) {
    }

    private String getErrorCode(int error) {
        switch (error) {
            case SpeechRecognizer.ERROR_AUDIO:
                return "AUDIO";
            case SpeechRecognizer.ERROR_CLIENT:
                return "CLIENT";
            case SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS:
                return "INSUFFICIENT_PERMISSIONS";
            case SpeechRecognizer.ERROR_NETWORK:
                return "NETWORK";
            case SpeechRecognizer.ERROR_NETWORK_TIMEOUT:
                return "NETWORK_TIMEOUT";
            case SpeechRecognizer.ERROR_NO_MATCH:
                return "NO_MATCH";
            case SpeechRecognizer.ERROR_RECOGNIZER_BUSY:
                return "RECOGNIZER_BUSY";
            case SpeechRecognizer.ERROR_SERVER:
                return "SERVER";
            case SpeechRecognizer.ERROR_SPEECH_TIMEOUT:
                return "SPEECH_TIMEOUT";
            default:
                return "UNKNOWN";
        }
    }

    private String getErrorMessage(int error) {
        switch (error) {
            case SpeechRecognizer.ERROR_AUDIO:
                return "Audio recording error";
            case SpeechRecognizer.ERROR_CLIENT:
                return "Client side error";
            case SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS:
                return "Insufficient permissions";
            case SpeechRecognizer.ERROR_NETWORK:
                return "Network error";
            case SpeechRecognizer.ERROR_NETWORK_TIMEOUT:
                return "Network timeout";
            case SpeechRecognizer.ERROR_NO_MATCH:
                return "No speech match";
            case SpeechRecognizer.ERROR_RECOGNIZER_BUSY:
                return "Recognition service busy";
            case SpeechRecognizer.ERROR_SERVER:
                return "Server error";
            case SpeechRecognizer.ERROR_SPEECH_TIMEOUT:
                return "No speech input";
            default:
                return "Unknown error";
        }
    }

    @Override
    public void invalidate() {
        super.invalidate();
        if (speechRecognizer != null) {
            speechRecognizer.destroy();
            speechRecognizer = null;
        }
    }
}
