/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {
  StatusBar,
  StyleSheet,
  View,
  Text,
  TextInput,
  ActivityIndicator,
  Button,
  ScrollView,
  useColorScheme,
} from 'react-native';
import TextToSpeech from 'rn-text-to-speech';
import SpeechToText from 'rn-speech-to-text';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const insets = useSafeAreaInsets();

  const [ttsText, setTtsText] = useState('Hello from rn-text-to-speech');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [sttPartial, setSttPartial] = useState('');
  const [sttFinal, setSttFinal] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [sttError, setSttError] = useState('');

  useEffect(() => {
    const startListener = TextToSpeech.addEventListener('onStart', () =>
      setIsSpeaking(true),
    );
    const finishListener = TextToSpeech.addEventListener('onFinish', () =>
      setIsSpeaking(false),
    );
    const errorListener = TextToSpeech.addEventListener('onError', () =>
      setIsSpeaking(false),
    );

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
      TextToSpeech.removeAllListeners();
      SpeechToText.removeAllListeners();
    };
  }, []);

  const handleSpeak = async () => {
    try {
      await TextToSpeech.speak(ttsText, { rate: 1.0, pitch: 1.0 });
    } catch (e) {
      console.warn(e);
    }
  };

  const handleStopSpeak = async () => {
    await TextToSpeech.stop();
  };

  const handleStartListening = async () => {
    const granted = await SpeechToText.requestPermissions();
    if (!granted) {
      setSttError('Microphone permission is required to use speech-to-text.');
      return;
    }
    setSttPartial('');
    setSttFinal('');
    setSttError('');
    await SpeechToText.startListening({ language: 'en-US', partialResults: true });
  };

  const handleStopListening = async () => {
    await SpeechToText.stopListening();
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.statusRow}>
        <StatusPill label="Speaking" active={isSpeaking} color="#2563eb" />
        <StatusPill label="Listening" active={isListening} color="#16a34a" />
      </View>

      <Text style={styles.heading}>rn-text-to-speech</Text>
      <TextInput
        style={styles.input}
        value={ttsText}
        onChangeText={setTtsText}
        multiline
      />
      <View style={styles.row}>
        <Button title={isSpeaking ? 'Speaking…' : 'Speak'} onPress={handleSpeak} disabled={isSpeaking} />
        <Button title="Stop" color="#d33" onPress={handleStopSpeak} />
      </View>

      <Text style={[styles.heading, { marginTop: 24 }]}>rn-speech-to-text</Text>
      <View style={styles.row}>
        <Button
          title={isListening ? 'Listening…' : 'Start Listening'}
          onPress={handleStartListening}
          disabled={isListening}
        />
        <Button title="Stop" color="#d33" onPress={handleStopListening} />
      </View>
      {isListening && (
        <View style={styles.inlineStatus}>
          <ActivityIndicator size="small" color="#16a34a" />
          <Text style={styles.inlineStatusText}>Listening… speak now</Text>
        </View>
      )}
      {isSpeaking && (
        <View style={styles.inlineStatus}>
          <ActivityIndicator size="small" color="#2563eb" />
          <Text style={styles.inlineStatusText}>Playing speech…</Text>
        </View>
      )}
      <Text style={styles.label}>Partial:</Text>
      <Text style={styles.output}>{sttPartial || '—'}</Text>
      <Text style={styles.label}>Final:</Text>
      <Text style={styles.output}>{sttFinal || '—'}</Text>
      {!!sttError && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{sttError}</Text>
        </View>
      )}
    </ScrollView>
  );
}

type StatusPillProps = {
  label: string;
  active: boolean;
  color: string;
};

function StatusPill({ label, active, color }: StatusPillProps) {
  return (
    <View style={[styles.pill, { borderColor: color, backgroundColor: active ? `${color}15` : '#f6f7f9' }]}> 
      <View style={[styles.dot, { backgroundColor: active ? color : '#9ca3af' }]} />
      <Text style={[styles.pillText, { color: active ? color : '#6b7280' }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: 'white'
  },
  content: {
    paddingBottom: 32,
  },
  statusRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  inlineStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
  },
  inlineStatusText: {
    color: '#374151',
    fontWeight: '500',
  },
  label: {
    marginTop: 8,
    fontWeight: '600',
  },
  output: {
    minHeight: 24,
    paddingVertical: 4,
    color: '#333',
  },
  errorBox: {
    backgroundColor: '#fee2e2',
    borderColor: '#fca5a5',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
  },
  errorText: {
    color: '#b91c1c',
    fontWeight: '600',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  pillText: {
    fontWeight: '600',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
});

export default App;
