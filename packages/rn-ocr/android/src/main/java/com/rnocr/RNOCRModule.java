package com.rnocr;

import android.Manifest;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.util.Base64;

import androidx.core.content.ContextCompat;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import com.google.mlkit.vision.common.InputImage;
import com.google.mlkit.vision.text.Text;
import com.google.mlkit.vision.text.TextRecognition;
import com.google.mlkit.vision.text.TextRecognizer;
import com.google.mlkit.vision.text.latin.TextRecognizerOptions;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

public class RNOCRModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;
    private TextRecognizer textRecognizer;

    public RNOCRModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.textRecognizer = TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS);
    }

    @Override
    public String getName() {
        return "RNOCR";
    }

    @ReactMethod
    public void requestPermissions(Promise promise) {
        boolean granted = ContextCompat.checkSelfPermission(
            reactContext,
            Manifest.permission.CAMERA
        ) == PackageManager.PERMISSION_GRANTED;

        promise.resolve(granted);
    }

    @ReactMethod
    public void checkPermissions(Promise promise) {
        boolean granted = ContextCompat.checkSelfPermission(
            reactContext,
            Manifest.permission.CAMERA
        ) == PackageManager.PERMISSION_GRANTED;

        promise.resolve(granted);
    }

    @ReactMethod
    public void recognizeText(String imageUri, ReadableMap options, Promise promise) {
        try {
            Bitmap bitmap = loadBitmapFromUri(imageUri);
            if (bitmap == null) {
                promise.reject("NO_IMAGE", "Failed to load image from URI: " + imageUri);
                return;
            }

            InputImage image = InputImage.fromBitmap(bitmap, 0);
            
            textRecognizer.process(image)
                .addOnSuccessListener(result -> {
                    String recognizedText = result.getText();
                    WritableMap resultMap = Arguments.createMap();
                    resultMap.putString("text", recognizedText);
                    
                    if (result.getTextBlocks().size() > 0) {
                        Text.TextBlock firstBlock = result.getTextBlocks().get(0);
                        WritableMap boundingBox = Arguments.createMap();
                        boundingBox.putInt("x", firstBlock.getBoundingBox().left);
                        boundingBox.putInt("y", firstBlock.getBoundingBox().top);
                        boundingBox.putInt("width", firstBlock.getBoundingBox().width());
                        boundingBox.putInt("height", firstBlock.getBoundingBox().height());
                        resultMap.putMap("boundingBox", boundingBox);
                    }
                    
                    promise.resolve(resultMap);
                })
                .addOnFailureListener(e -> {
                    promise.reject("RECOGNITION_FAILED", e.getMessage());
                });

        } catch (Exception e) {
            promise.reject("UNKNOWN", e.getMessage());
        }
    }

    private Bitmap loadBitmapFromUri(String uriString) throws IOException {
        if (uriString == null || uriString.isEmpty()) {
            return null;
        }

        Uri uri = Uri.parse(uriString);
        String scheme = uri.getScheme();

        if (scheme == null || scheme.equals("file")) {
            String path = uri.getPath();
            if (path != null) {
                File file = new File(path);
                if (file.exists()) {
                    FileInputStream fis = new FileInputStream(file);
                    return BitmapFactory.decodeStream(fis);
                }
            }
        } else if (scheme.equals("content")) {
            try {
                android.content.ContentResolver resolver = reactContext.getContentResolver();
                android.graphics.Bitmap bitmap = android.provider.MediaStore.Images.Media.getBitmap(resolver, uri);
                return bitmap;
            } catch (Exception e) {
                android.util.Log.e("RNOCR", "Failed to load content URI: " + uriString, e);
                return null;
            }
        } else if (scheme.equals("data")) {
            try {
                String base64Data = uriString.substring(uriString.indexOf(",") + 1);
                byte[] decodedBytes = Base64.decode(base64Data, Base64.DEFAULT);
                return BitmapFactory.decodeByteArray(decodedBytes, 0, decodedBytes.length);
            } catch (Exception e) {
                android.util.Log.e("RNOCR", "Failed to decode base64 data", e);
                return null;
            }
        } else {
            android.util.Log.e("RNOCR", "Unsupported URI scheme: " + scheme);
        }

        return null;
    }

    private void sendEvent(String eventName, WritableMap params) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(eventName, params);
    }
}
