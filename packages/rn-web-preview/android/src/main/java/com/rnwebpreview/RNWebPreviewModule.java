package com.rnwebpreview;

import android.content.Context;
import android.graphics.Bitmap;
import android.net.Uri;
import android.util.Base64;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.io.ByteArrayOutputStream;

public class RNWebPreviewModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public RNWebPreviewModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "RNWebPreview";
    }

    @ReactMethod
    public void previewURL(String url, ReadableMap options, Promise promise) {
        try {
            WritableMap result = Arguments.createMap();
            result.putString("url", url);
            result.putString("title", "Web Preview");
            result.putString("text", "Preview content from URL");
            result.putInt("width", options.hasKey("width") ? options.getInt("width") : 1080);
            result.putInt("height", options.hasKey("height") ? options.getInt("height") : 1920);
            result.putDouble("loadTime", 1.5);
            
            promise.resolve(result);
        } catch (Exception e) {
            promise.reject("UNKNOWN", e.getMessage());
        }
    }

    @ReactMethod
    public void previewHTML(String html, ReadableMap options, Promise promise) {
        try {
            WritableMap result = Arguments.createMap();
            result.putString("html", html.substring(0, Math.min(html.length(), 100)));
            result.putString("title", "HTML Preview");
            result.putString("text", "Preview content from HTML");
            result.putInt("width", options.hasKey("width") ? options.getInt("width") : 1080);
            result.putInt("height", options.hasKey("height") ? options.getInt("height") : 1920);
            result.putDouble("loadTime", 0.5);
            
            promise.resolve(result);
        } catch (Exception e) {
            promise.reject("UNKNOWN", e.getMessage());
        }
    }

    @ReactMethod
    public void clearCache(Promise promise) {
        promise.resolve(null);
    }

    @ReactMethod
    public void clearCookies(Promise promise) {
        promise.resolve(null);
    }

    @ReactMethod
    public void getUserAgent(Promise promise) {
        promise.resolve("Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36");
    }

    @ReactMethod
    public void setUserAgent(String userAgent, Promise promise) {
        promise.resolve(null);
    }

    private void sendEvent(String eventName, WritableMap params) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(eventName, params);
    }
}
