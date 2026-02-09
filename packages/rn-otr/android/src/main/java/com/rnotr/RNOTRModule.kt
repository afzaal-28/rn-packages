package com.rnotr

import android.net.Uri
import android.util.Log
import androidx.camera.core.Camera
import androidx.camera.core.CameraSelector
import androidx.camera.core.ImageAnalysis
import androidx.camera.core.ImageProxy
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.core.content.ContextCompat
import androidx.lifecycle.LifecycleOwner
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.text.TextRecognition
import com.google.mlkit.vision.text.latin.TextRecognizerOptions
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors

class RNOTRModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

  private val recognizer = TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS)

  private var cameraProvider: ProcessCameraProvider? = null
  private var camera: Camera? = null
  private var imageAnalysis: ImageAnalysis? = null
  private var cameraExecutor: ExecutorService? = null

  private var liveRecognitionEnabled: Boolean = false
  private var targetFrameIntervalMs: Long = 100L // default ~10 FPS
  private var lastAnalyzedTimestamp: Long = 0L

  override fun getName(): String = "RNOTR"

  @ReactMethod
  fun checkCameraPermission(promise: Promise) {
    // For now, assume caller handled runtime permissions at JS level.
    promise.resolve("granted")
  }

  @ReactMethod
  fun requestCameraPermission(promise: Promise) {
    // For now, assume caller requests PermissionsAndroid from JS.
    promise.resolve(true)
  }

  @ReactMethod
  fun startCamera(options: ReadableMap?, promise: Promise) {
    setupCamera(options, promise)
  }

  @ReactMethod
  fun stopCamera(promise: Promise) {
    try {
      cameraProvider?.unbindAll()
      imageAnalysis = null
      camera = null
      cameraExecutor?.shutdown()
      cameraExecutor = null
      promise.resolve(null)
    } catch (e: Exception) {
      promise.reject("E_STOP_CAMERA", e)
    }
  }

  @ReactMethod
  fun startLiveTextRecognition(options: ReadableMap?, promise: Promise) {
    liveRecognitionEnabled = true

    val fps = if (options != null && options.hasKey("fps")) options.getDouble("fps").toInt() else 10
    targetFrameIntervalMs = if (fps > 0) 1000L / fps else 100L

    // languageHints can be wired into ML Kit model selection later if needed

    setupCamera(options, promise)
  }

  @ReactMethod
  fun stopLiveTextRecognition(promise: Promise) {
    liveRecognitionEnabled = false
    promise.resolve(null)
  }

  @ReactMethod
  fun captureAndRecognize(promise: Promise) {
    // One-shot capture + recognize should be implemented via CameraX
    promise.reject("E_NOT_IMPLEMENTED", "captureAndRecognize not yet implemented")
  }

  @ReactMethod
  fun recognizeFromImage(imagePathOrBase64: String, promise: Promise) {
    try {
      val uri = Uri.parse(imagePathOrBase64)
      val context = reactApplicationContext
      val image = InputImage.fromFilePath(context, uri)

      recognizer.process(image)
        .addOnSuccessListener { visionText ->
          val blocksArray = Arguments.createArray()
          val fullText = visionText.text

          for (block in visionText.textBlocks) {
            val blockMap = Arguments.createMap()
            blockMap.putString("text", block.text)
            val rect = block.boundingBox
            val bbox = Arguments.createMap()
            if (rect != null) {
              bbox.putInt("x", rect.left)
              bbox.putInt("y", rect.top)
              bbox.putInt("width", rect.width())
              bbox.putInt("height", rect.height())
            }
            blockMap.putMap("boundingBox", bbox)
            blocksArray.pushMap(blockMap)
          }

          val result = Arguments.createMap()
          result.putString("text", fullText)
          result.putArray("blocks", blocksArray)
          promise.resolve(result)
        }
        .addOnFailureListener { e ->
          promise.reject("E_OCR_FAILED", e)
        }
    } catch (e: Exception) {
      promise.reject("E_INPUT_IMAGE", e)
    }
  }

  private fun sendEvent(eventName: String, params: WritableMap) {
    reactApplicationContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit(eventName, params)
  }

  private fun setupCamera(options: ReadableMap?, promise: Promise) {
    try {
      val currentActivity = currentActivity
      if (currentActivity == null || currentActivity !is LifecycleOwner) {
        promise.reject("E_NO_ACTIVITY", "Current activity is null or not a LifecycleOwner")
        return
      }

      if (cameraExecutor == null) {
        cameraExecutor = Executors.newSingleThreadExecutor()
      }

      val providerFuture = ProcessCameraProvider.getInstance(reactApplicationContext)
      providerFuture.addListener({
        try {
          val provider = providerFuture.get()
          cameraProvider = provider

          // Unbind any previous use cases
          provider.unbindAll()

          // Camera selector based on facing option
          val facing = options?.getString("facing") ?: "back"
          val cameraSelector = if (facing == "front") {
            CameraSelector.DEFAULT_FRONT_CAMERA
          } else {
            CameraSelector.DEFAULT_BACK_CAMERA
          }

          // ImageAnalysis use case for OCR
          val analysis = ImageAnalysis.Builder()
            .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
            .build()

          analysis.setAnalyzer(cameraExecutor!!) { imageProxy ->
            processImageProxy(imageProxy)
          }

          imageAnalysis = analysis

          // Bind to lifecycle; we don't create a Preview here, only analysis
          camera = provider.bindToLifecycle(currentActivity, cameraSelector, analysis)

          promise.resolve(null)
        } catch (e: Exception) {
          Log.e("RNOTR", "Failed to bind camera", e)
          promise.reject("E_START_CAMERA", e)
        }
      }, ContextCompat.getMainExecutor(reactApplicationContext))
    } catch (e: Exception) {
      promise.reject("E_START_CAMERA", e)
    }
  }

  private fun processImageProxy(imageProxy: ImageProxy) {
    try {
      val mediaImage = imageProxy.image
      if (mediaImage == null) {
        imageProxy.close()
        return
      }

      val now = System.currentTimeMillis()
      if (!liveRecognitionEnabled || now - lastAnalyzedTimestamp < targetFrameIntervalMs) {
        imageProxy.close()
        return
      }
      lastAnalyzedTimestamp = now

      val image = InputImage.fromMediaImage(mediaImage, imageProxy.imageInfo.rotationDegrees)

      recognizer.process(image)
        .addOnSuccessListener { visionText ->
          val blocksArray = Arguments.createArray()
          val fullText = visionText.text

          for (block in visionText.textBlocks) {
            val blockMap = Arguments.createMap()
            blockMap.putString("text", block.text)
            val rect = block.boundingBox
            val bbox = Arguments.createMap()
            if (rect != null) {
              bbox.putInt("x", rect.left)
              bbox.putInt("y", rect.top)
              bbox.putInt("width", rect.width())
              bbox.putInt("height", rect.height())
            }
            blockMap.putMap("boundingBox", bbox)
            blocksArray.pushMap(blockMap)
          }

          val result = Arguments.createMap()
          result.putString("text", fullText)
          result.putArray("blocks", blocksArray)

          sendEvent("onTextRecognized", result)
        }
        .addOnFailureListener { e ->
          Log.e("RNOTR", "ML Kit OCR failed", e)
        }
        .addOnCompleteListener {
          imageProxy.close()
        }
    } catch (e: Exception) {
      Log.e("RNOTR", "Error processing image", e)
      imageProxy.close()
    }
  }
}
