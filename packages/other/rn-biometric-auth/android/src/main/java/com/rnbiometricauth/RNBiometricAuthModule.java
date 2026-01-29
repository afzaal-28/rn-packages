package com.rnbiometricauth;

import android.os.Build;
import android.os.Bundle;
import androidx.biometric.BiometricManager;
import androidx.biometric.BiometricPrompt;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.FragmentActivity;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.concurrent.Executor;

public class RNBiometricAuthModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;
    private BiometricPrompt biometricPrompt;
    private Promise currentPromise;

    public RNBiometricAuthModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "RNBiometricAuth";
    }

    @ReactMethod
    public void authenticate(ReadableMap options, Promise promise) {
        if (currentPromise != null) {
            promise.reject("LOCKOUT", "Authentication already in progress");
            return;
        }

        try {
            android.app.Activity activity = getCurrentActivity();
            if (activity == null) {
                promise.reject("NO_ACTIVITY", "No activity found");
                return;
            }

            // BiometricPrompt requires FragmentActivity
            if (!(activity instanceof FragmentActivity)) {
                promise.reject("NOT_SUPPORTED", "Activity must be a FragmentActivity");
                return;
            }

            currentPromise = promise;

            Executor executor = ContextCompat.getMainExecutor(reactContext);
            BiometricPrompt.PromptInfo promptInfo = new BiometricPrompt.PromptInfo.Builder()
                .setTitle(options.hasKey("promptTitle") ? options.getString("promptTitle") : "Biometric Authentication")
                .setSubtitle(options.hasKey("promptMessage") ? options.getString("promptMessage") : "Authenticate to continue")
                .setNegativeButtonText(options.hasKey("cancelButtonText") ? options.getString("cancelButtonText") : "Cancel")
                .setConfirmationRequired(options.hasKey("fallbackToPasscode") ? options.getBoolean("fallbackToPasscode") : true)
                .build();

            biometricPrompt = new BiometricPrompt(
                (FragmentActivity) activity,
                executor,
                new BiometricPrompt.AuthenticationCallback() {
                    @Override
                    public void onAuthenticationSucceeded(BiometricPrompt.AuthenticationResult result) {
                        if (currentPromise != null) {
                            WritableMap resultMap = Arguments.createMap();
                            resultMap.putBoolean("success", true);
                            currentPromise.resolve(resultMap);
                            currentPromise = null;
                        }
                    }

                    @Override
                    public void onAuthenticationFailed() {
                        if (currentPromise != null) {
                            currentPromise.reject("UNKNOWN", "Authentication failed");
                            currentPromise = null;
                        }
                    }

                    @Override
                    public void onAuthenticationError(int errorCode, CharSequence errString) {
                        if (currentPromise != null) {
                            String error = mapErrorCode(errorCode);
                            currentPromise.reject(error, errString.toString());
                            currentPromise = null;
                        }
                    }
                });

            biometricPrompt.authenticate(promptInfo);
        } catch (Exception e) {
            if (currentPromise != null) {
                currentPromise.reject("NOT_AVAILABLE", e.getMessage());
                currentPromise = null;
            } else {
                promise.reject("NOT_AVAILABLE", e.getMessage());
            }
        }
    }

    @ReactMethod
    public void checkAvailability(Promise promise) {
        BiometricManager biometricManager = BiometricManager.from(reactContext);
        
        int canAuthenticate = biometricManager.canAuthenticate(BiometricManager.Authenticators.BIOMETRIC_WEAK);
        
        WritableMap result = Arguments.createMap();
        result.putBoolean("available", canAuthenticate == BiometricManager.BIOMETRIC_SUCCESS);
        result.putBoolean("hardware", canAuthenticate != BiometricManager.BIOMETRIC_ERROR_NO_HARDWARE);
        
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            if (biometricManager.canAuthenticate(BiometricManager.Authenticators.DEVICE_CREDENTIAL | BiometricManager.Authenticators.BIOMETRIC_WEAK) == BiometricManager.BIOMETRIC_SUCCESS) {
                result.putString("biometryType", "fingerprint");
            }
        }
        
        result.putBoolean("permission", true);
        
        promise.resolve(result);
    }

    @ReactMethod
    public void isEnrolled(Promise promise) {
        BiometricManager biometricManager = BiometricManager.from(reactContext);
        int canAuthenticate = biometricManager.canAuthenticate(BiometricManager.Authenticators.BIOMETRIC_WEAK);
        promise.resolve(canAuthenticate == BiometricManager.BIOMETRIC_SUCCESS);
    }

    @ReactMethod
    public void cancelAuthentication(Promise promise) {
        if (biometricPrompt != null) {
            biometricPrompt.cancelAuthentication();
        }
        if (currentPromise != null) {
            currentPromise.reject("USER_CANCELED", "Authentication cancelled");
            currentPromise = null;
        }
        promise.resolve(null);
    }

    private String mapErrorCode(int errorCode) {
        switch (errorCode) {
            case BiometricPrompt.ERROR_NO_DEVICE_CREDENTIAL:
                return "NOT_ENROLLED";
            case BiometricPrompt.ERROR_HW_NOT_PRESENT:
            case BiometricPrompt.ERROR_NO_SPACE:
            case BiometricPrompt.ERROR_SECURITY_UPDATE_REQUIRED:
                return "NOT_AVAILABLE";
            case BiometricPrompt.ERROR_UNABLE_TO_PROCESS:
            case BiometricPrompt.ERROR_TIMEOUT:
            case BiometricPrompt.ERROR_USER_CANCELED:
            case BiometricPrompt.ERROR_VENDOR:
                return "USER_CANCELED";
            case BiometricPrompt.ERROR_LOCKOUT:
                return "LOCKOUT";
            case BiometricPrompt.ERROR_LOCKOUT_PERMANENT:
                return "LOCKOUT_PERMANENT";
            default:
                return "UNKNOWN";
        }
    }

    private void sendEvent(String eventName, WritableMap params) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(eventName, params);
    }
}
