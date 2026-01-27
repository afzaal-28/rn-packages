import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ActivityIndicator,
  Button,
  ScrollView,
  Alert,
} from 'react-native';
import SpeechToText from 'rn-speech-to-text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SpeechToTextPage() {
  const insets = useSafeAreaInsets();

  const [sttPartial, setSttPartial] = useState('');
  const [sttFinal, setSttFinal] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [sttError, setSttError] = useState('');
  const [sttLanguage, setSttLanguage] = useState('en-US');
  const [sttPartialResults, setSttPartialResults] = useState(true);
  const [sttContinuous, setSttContinuous] = useState(false);
  const [sttMaxResults, setSttMaxResults] = useState('5');
  const [sttTimeout, setSttTimeout] = useState('30');

  useEffect(() => {
    const sttStart = SpeechToText.addEventListener('onStart', () =>
      setIsListening(true),
    );
    const sttPartialListener = SpeechToText.addEventListener(
      'onPartialResult',
      result => setSttPartial(result.transcript),
    );
    const sttResultListener = SpeechToText.addEventListener('onResult', result => {
      setSttFinal(result.transcript);
      setSttPartial('');
      setIsListening(false);
      setSttError('');
    });
    const sttError = SpeechToText.addEventListener('onError', error => {
      setIsListening(false);
      setSttError(error?.message ?? 'Speech recognition error');
    });
    const sttEnd = SpeechToText.addEventListener('onEnd', () =>
      setIsListening(false),
    );

    return () => {
      SpeechToText.removeAllListeners();
    };
  }, []);

  const handleStartListening = async () => {
    const granted = await SpeechToText.requestPermissions();
    if (!granted) {
      setSttError('Microphone permission is required to use speech-to-text.');
      return;
    }
    setSttPartial('');
    setSttFinal('');
    setSttError('');
    await SpeechToText.startListening({
      language: sttLanguage,
      partialResults: sttPartialResults,
      continuous: sttContinuous,
      maxResults: parseInt(sttMaxResults),
      timeout: parseInt(sttTimeout) * 1000,
    });
  };

  const handleStopListening = async () => {
    await SpeechToText.stopListening();
  };

  const handleCancelListening = async () => {
    await SpeechToText.cancel();
    setIsListening(false);
    setSttPartial('');
    setSttFinal('');
  };

  const handleCheckListening = async () => {
    const listening = await SpeechToText.isListening();
    Alert.alert('Status', listening ? 'Currently listening' : 'Not listening');
  };

  const handleCheckPermissions = async () => {
    const granted = await SpeechToText.checkPermissions();
    Alert.alert(
      'Permissions',
      granted ? 'Permissions granted' : 'Permissions not granted'
    );
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
          <Text style={styles.title}>Speech to Text</Text>
          <Text style={styles.subtitle}>All features of rn-speech-to-text</Text>
        </View>

        <View style={styles.statusRow}>
          <View style={[styles.statusPill, { borderColor: isListening ? '#a7f3d0' : '#9ca3af', backgroundColor: isListening ? 'rgba(167, 243, 208, 0.15)' : 'rgba(156, 163, 175, 0.15)' }]}>
            <View style={[styles.statusDot, { backgroundColor: isListening ? '#a7f3d0' : '#9ca3af' }]} />
            <Text style={[styles.statusText, { color: isListening ? '#a7f3d0' : '#9ca3af' }]}>
              {isListening ? 'Listening' : 'Idle'}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.heading}>Configuration</Text>

          <Text style={styles.label}>Language:</Text>
          <TextInput
            style={styles.input}
            value={sttLanguage}
            onChangeText={setSttLanguage}
            placeholder="en-US"
          />

          <Text style={styles.label}>Max Results:</Text>
          <TextInput
            style={styles.input}
            value={sttMaxResults}
            onChangeText={setSttMaxResults}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Timeout (seconds):</Text>
          <TextInput
            style={styles.input}
            value={sttTimeout}
            onChangeText={setSttTimeout}
            keyboardType="numeric"
          />

          <View style={styles.buttonRow}>
            <Button
              title={`Partial: ${sttPartialResults ? 'ON' : 'OFF'}`}
              onPress={() => setSttPartialResults(!sttPartialResults)}
            />
            <Button
              title={`Continuous: ${sttContinuous ? 'ON' : 'OFF'}`}
              onPress={() => setSttContinuous(!sttContinuous)}
            />
          </View>

          <View style={styles.buttonRow}>
            <Button
              title={isListening ? 'Listening…' : 'Start Listening'}
              onPress={handleStartListening}
              disabled={isListening}
            />
            <Button title="Stop" color="#ef4444" onPress={handleStopListening} />
            <Button title="Cancel" color="#f59e0b" onPress={handleCancelListening} />
          </View>

          <View style={styles.buttonRow}>
            <Button title="Check Status" onPress={handleCheckListening} />
            <Button title="Check Permissions" onPress={handleCheckPermissions} />
          </View>

          {isListening && (
            <View style={styles.inlineStatus}>
              <ActivityIndicator size="small" color="#a7f3d0" />
              <Text style={styles.inlineStatusText}>Listening… speak now</Text>
            </View>
          )}

          <Text style={styles.label}>Partial Result:</Text>
          <View style={styles.outputBox}>
            <Text style={styles.outputText}>{sttPartial || '—'}</Text>
          </View>

          <Text style={styles.label}>Final Result:</Text>
          <View style={styles.outputBox}>
            <Text style={styles.outputText}>{sttFinal || '—'}</Text>
          </View>

          {!!sttError && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{sttError}</Text>
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
  statusRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  statusText: {
    fontWeight: '600',
    fontSize: 14,
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
    marginBottom: 12,
    color: '#e5e7eb',
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: 'rgba(0, 6, 30, 0.55)',
    color: '#e5e7eb',
  },
  label: {
    marginTop: 8,
    fontWeight: '600',
    color: '#cbd5e1',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  inlineStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
  },
  inlineStatusText: {
    color: '#d1d5db',
    fontWeight: '500',
  },
  outputBox: {
    backgroundColor: 'rgba(0, 6, 30, 0.55)',
    borderColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 60,
  },
  outputText: {
    color: '#e5e7eb',
  },
  errorBox: {
    backgroundColor: 'rgba(255, 76, 76, 0.14)',
    borderColor: '#fb7185',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
  },
  errorText: {
    color: '#fecdd3',
    fontWeight: '600',
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
