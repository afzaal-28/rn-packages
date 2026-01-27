import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  Button,
  Alert,
  ActivityIndicator,
} from 'react-native';
import WebPreview from 'rn-web-preview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function WebPreviewPage() {
  const insets = useSafeAreaInsets();
  const [url, setUrl] = useState('https://example.com');
  const [html, setHtml] = useState('<h1>Hello World</h1><p>This is a sample HTML content.</p>');
  const [previewResult, setPreviewResult] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState<'url' | 'html'>('url');

  const handlePreviewURL = async () => {
    if (!url) {
      Alert.alert('Error', 'Please enter a URL');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await WebPreview.previewURL(url, {
        width: 1080,
        height: 1920,
        enableJavaScript: true,
        enableCache: true,
        timeout: 30000,
      });

      setPreviewResult(result);
      Alert.alert('Success', `Preview generated: ${result.width}x${result.height}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate preview');
      console.error('WebPreview Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePreviewHTML = async () => {
    setIsProcessing(true);
    try {
      const result = await WebPreview.previewHTML(html, {
        width: 1080,
        height: 1920,
        enableJavaScript: true,
        enableCache: false,
        timeout: 30000,
      });

      setPreviewResult(result);
      Alert.alert('Success', `Preview generated: ${result.width}x${result.height}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate preview');
      console.error('WebPreview Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearCache = async () => {
    try {
      await WebPreview.clearCache();
      Alert.alert('Success', 'Cache cleared');
    } catch (error) {
      Alert.alert('Error', 'Failed to clear cache');
    }
  };

  const handleClearCookies = async () => {
    try {
      await WebPreview.clearCookies();
      Alert.alert('Success', 'Cookies cleared');
    } catch (error) {
      Alert.alert('Error', 'Failed to clear cookies');
    }
  };

  const handleGetUserAgent = async () => {
    try {
      const userAgent = await WebPreview.getUserAgent();
      Alert.alert('User Agent', userAgent);
    } catch (error) {
      Alert.alert('Error', 'Failed to get user agent');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.auroraOne} />
      <View style={styles.auroraTwo} />
      
      <View style={styles.header}>
        <Text style={styles.title}>Web Preview</Text>
        <Text style={styles.subtitle}>URL and HTML rendering with rn-web-preview</Text>
      </View>

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scroll}
        contentContainerStyle={styles.content}
      >
        <View style={styles.card}>
          <Text style={styles.heading}>Preview Mode</Text>
          <View style={styles.buttonRow}>
            <Button
              title="URL Mode"
              onPress={() => setMode('url')}
              color={mode === 'url' ? '#3b82f6' : '#4b5563'}
            />
            <Button
              title="HTML Mode"
              onPress={() => setMode('html')}
              color={mode === 'html' ? '#3b82f6' : '#4b5563'}
            />
          </View>
        </View>

        {mode === 'url' && (
          <View style={styles.card}>
            <Text style={styles.heading}>URL Preview</Text>
            <Text style={styles.helper}>Generate a preview image from a URL</Text>

            <Text style={styles.label}>URL:</Text>
            <TextInput
              style={styles.input}
              value={url}
              onChangeText={setUrl}
              placeholder="https://example.com"
              placeholderTextColor="#6b7280"
            />

            <Button
              title={isProcessing ? 'Processing...' : 'Generate Preview'}
              onPress={handlePreviewURL}
              disabled={isProcessing}
            />

            {isProcessing && (
              <View style={styles.processingBox}>
                <ActivityIndicator size="small" color="#7dd3fc" />
                <Text style={styles.processingText}>Generating preview...</Text>
              </View>
            )}

            {previewResult && (
              <View style={styles.resultBox}>
                <Text style={styles.resultHeading}>Preview Result:</Text>
                <Text style={styles.resultText}>Width: {previewResult.width}</Text>
                <Text style={styles.resultText}>Height: {previewResult.height}</Text>
                <Text style={styles.resultText}>Format: {previewResult.format}</Text>
                <Text style={styles.resultText}>Size: {previewResult.size} bytes</Text>
              </View>
            )}
          </View>
        )}

        {mode === 'html' && (
          <View style={styles.card}>
            <Text style={styles.heading}>HTML Preview</Text>
            <Text style={styles.helper}>Generate a preview image from HTML content</Text>

            <Text style={styles.label}>HTML Content:</Text>
            <TextInput
              style={[styles.input, { minHeight: 120 }]}
              value={html}
              onChangeText={setHtml}
              multiline
              placeholder="Enter HTML content..."
              placeholderTextColor="#6b7280"
            />

            <Button
              title={isProcessing ? 'Processing...' : 'Generate Preview'}
              onPress={handlePreviewHTML}
              disabled={isProcessing}
            />

            {isProcessing && (
              <View style={styles.processingBox}>
                <ActivityIndicator size="small" color="#7dd3fc" />
                <Text style={styles.processingText}>Generating preview...</Text>
              </View>
            )}

            {previewResult && (
              <View style={styles.resultBox}>
                <Text style={styles.resultHeading}>Preview Result:</Text>
                <Text style={styles.resultText}>Width: {previewResult.width}</Text>
                <Text style={styles.resultText}>Height: {previewResult.height}</Text>
                <Text style={styles.resultText}>Format: {previewResult.format}</Text>
                <Text style={styles.resultText}>Size: {previewResult.size} bytes</Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.heading}>Cache & Cookies</Text>
          <View style={styles.buttonRow}>
            <Button title="Clear Cache" onPress={handleClearCache} />
            <Button title="Clear Cookies" onPress={handleClearCookies} />
          </View>
          <Button title="Get User Agent" onPress={handleGetUserAgent} />
        </View>

        <View style={styles.card}>
          <Text style={styles.heading}>Features</Text>
          <View style={styles.featureList}>
            <Text style={styles.featureItem}>✨ URL to Image Preview</Text>
            <Text style={styles.featureItem}>📄 HTML to Image Preview</Text>
            <Text style={styles.featureItem}>⚙️ Customizable Dimensions</Text>
            <Text style={styles.featureItem}>🔒 JavaScript Control</Text>
            <Text style={styles.featureItem}>💾 Cache Management</Text>
            <Text style={styles.featureItem}>🍪 Cookie Management</Text>
            <Text style={styles.featureItem}>🌐 User Agent Control</Text>
            <Text style={styles.featureItem}>⏱️ Timeout Configuration</Text>
          </View>
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
    marginBottom: 12,
    lineHeight: 20,
  },
  label: {
    marginTop: 8,
    fontWeight: '600',
    color: '#cbd5e1',
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    marginBottom: 12,
    backgroundColor: 'rgba(0, 6, 30, 0.55)',
    color: '#e5e7eb',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  processingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
  },
  processingText: {
    color: '#d1d5db',
    fontWeight: '500',
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
  },
  featureList: {
    gap: 8,
  },
  featureItem: {
    color: '#cbd5e1',
    lineHeight: 24,
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
