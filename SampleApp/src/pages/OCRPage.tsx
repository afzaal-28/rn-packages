import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Button,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import OCR from 'rn-ocr';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function OCRPage() {
  const insets = useSafeAreaInsets();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  const requestPermissions = async () => {
    const granted = await OCR.requestPermissions();
    setHasPermission(granted);
    if (!granted) {
      Alert.alert('Permission Required', 'Camera and storage permissions are required for OCR.');
    }
    return granted;
  };

  const handleSelectImage = async () => {
    const granted = await requestPermissions();
    if (!granted) {
      return;
    }

    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
      });

      if (result.didCancel) {
        return;
      }

      if (result.errorCode) {
        Alert.alert('Error', result.errorMessage || 'Failed to pick image');
        return;
      }

      if (result.assets && result.assets[0]) {
        setSelectedImage(result.assets[0].uri || null);
        setExtractedText('');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open image picker');
      console.error('Image picker error:', error);
    }
  };

  const handleProcessImage = async () => {
    if (!selectedImage) {
      Alert.alert('No Image', 'Please select an image first.');
      return;
    }

    setIsProcessing(true);

    try {
      const result = await OCR.recognizeText(selectedImage, {});

      setExtractedText(result.text || 'No text detected in the image');
    } catch (error) {
      Alert.alert('Error', 'Failed to process image with OCR');
      console.error('OCR Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClear = () => {
    setSelectedImage(null);
    setExtractedText('');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.auroraOne} />
      <View style={styles.auroraTwo} />

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scroll}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.title}>OCR</Text>
          <Text style={styles.subtitle}>Image to Text Recognition</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.heading}>OCR Features</Text>
          <Text style={styles.helper}>
            Extract text from images using Optical Character Recognition
          </Text>

          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>📷</Text>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Image Selection</Text>
                <Text style={styles.featureDesc}>Choose photos from gallery</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🔍</Text>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Text Recognition</Text>
                <Text style={styles.featureDesc}>Extract text from images</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🌐</Text>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Multi-language</Text>
                <Text style={styles.featureDesc}>Support for various languages</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>✨</Text>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>High Accuracy</Text>
                <Text style={styles.featureDesc}>Advanced recognition algorithms</Text>
              </View>
            </View>
          </View>

          <View style={styles.buttonRow}>
            <Button title="Select Image" onPress={handleSelectImage} />
            {selectedImage && (
              <Button title="Process" onPress={handleProcessImage} disabled={isProcessing} />
            )}
          </View>

          {isProcessing && (
            <View style={styles.processingBox}>
              <ActivityIndicator size="small" color="#fcd34d" />
              <Text style={styles.processingText}>Processing image...</Text>
            </View>
          )}

          {selectedImage && (
            <View style={styles.imagePreview}>
              <Image source={{ uri: selectedImage }} style={styles.previewImage} />
            </View>
          )}

          {extractedText && (
            <View style={styles.resultBox}>
              <Text style={styles.resultHeading}>Extracted Text:</Text>
              <Text style={styles.resultText}>{extractedText}</Text>
              <Button title="Clear" color="#ef4444" onPress={handleClear} />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050914',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 48,
    paddingHorizontal: 16,
    gap: 18,
  },
  header: {
    gap: 8,
    paddingHorizontal: 4,
    paddingTop: 12,
    paddingBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#e2e8f0',
    letterSpacing: 0.3,
  },
  subtitle: {
    color: '#cbd5e1',
    lineHeight: 20,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderColor: 'rgba(255, 255, 255, 0.14)',
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    shadowColor: '#00f0ff',
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
    color: '#e5e7eb',
  },
  helper: {
    color: '#9ca3af',
    marginBottom: 16,
    lineHeight: 20,
  },
  featureList: {
    gap: 12,
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: 'rgba(0, 6, 30, 0.4)',
    borderRadius: 12,
  },
  featureIcon: {
    fontSize: 28,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontWeight: '600',
    color: '#e5e7eb',
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 12,
    color: '#9ca3af',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  processingBox: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: '#f59e0b',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  processingText: {
    color: '#fcd34d',
    fontWeight: '600',
  },
  imagePreview: {
    marginTop: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
  },
  resultBox: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: '#10b981',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  resultHeading: {
    fontWeight: '600',
    color: '#10b981',
    marginBottom: 8,
  },
  resultText: {
    color: '#e5e7eb',
    lineHeight: 20,
    marginBottom: 12,
  },
  auroraOne: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 999,
    backgroundColor: '#1d4ed8',
    opacity: 0.18,
    top: -40,
    right: -60,
    transform: [{ rotate: '18deg' }],
  },
  auroraTwo: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 999,
    backgroundColor: '#14b8a6',
    opacity: 0.16,
    top: 120,
    left: -80,
    transform: [{ rotate: '-12deg' }],
  },
});
