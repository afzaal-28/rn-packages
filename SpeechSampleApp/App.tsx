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
    });
    const sttError = SpeechToText.addEventListener('onError', () =>
      setIsListening(false),
    );
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
    if (!granted) return;
    setSttPartial('');
    setSttFinal('');
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
      <Text style={styles.label}>Partial:</Text>
      <Text style={styles.output}>{sttPartial || '—'}</Text>
      <Text style={styles.label}>Final:</Text>
      <Text style={styles.output}>{sttFinal || '—'}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  content: {
    paddingBottom: 32,
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
  label: {
    marginTop: 8,
    fontWeight: '600',
  },
  output: {
    minHeight: 24,
    paddingVertical: 4,
    color: '#333',
  },
});

export default App;
