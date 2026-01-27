/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;

function AppContent() {
  const insets = useSafeAreaInsets();

  // TTS State
  const [ttsText, setTtsText] = useState('Hello from rn-text-to-speech');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsLanguage, setTtsLanguage] = useState('en-US');
  const [ttsRate, setTtsRate] = useState('1.0');
  const [ttsPitch, setTtsPitch] = useState('1.0');
  const [ttsVolume, setTtsVolume] = useState('1.0');
  const [voices, setVoices] = useState<Array<{ id: string; name: string; language: string }>>([]);
  const [selectedVoice, setSelectedVoice] = useState('');

  // STT State
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
    // TTS Event Listeners
    const startListener = TextToSpeech.addEventListener('onStart', () =>
      setIsSpeaking(true),
    );
    const finishListener = TextToSpeech.addEventListener('onFinish', () =>
      setIsSpeaking(false),
    );
    const errorListener = TextToSpeech.addEventListener('onError', () =>
      setIsSpeaking(false),
    );

    // STT Event Listeners
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

    // Load available voices
    loadVoices();

    return () => {
      TextToSpeech.removeAllListeners();
      SpeechToText.removeAllListeners();
    };
  }, []);

  const loadVoices = async () => {
    try {
      const availableVoices = await TextToSpeech.getAvailableVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0].id);
      }
    } catch (error) {
      console.warn('Failed to load voices:', error);
    }
  };

  const handleSpeak = async () => {
    try {
      await TextToSpeech.speak(ttsText, {
        language: ttsLanguage,
        rate: parseFloat(ttsRate),
        pitch: parseFloat(ttsPitch),
        volume: parseFloat(ttsVolume),
        voice: selectedVoice || undefined,
      });
    } catch (e) {
      console.warn(e);
    }
  };

  const handleStopSpeak = async () => {
    await TextToSpeech.stop();
  };

  const handleSetDefaults = async () => {
    try {
      await TextToSpeech.setDefaultLanguage(ttsLanguage);
      await TextToSpeech.setDefaultRate(parseFloat(ttsRate));
      await TextToSpeech.setDefaultPitch(parseFloat(ttsPitch));
      Alert.alert('Success', 'Default settings updated');
    } catch (e) {
      Alert.alert('Error', 'Failed to set defaults');
    }
  };

  const handleCheckSpeaking = async () => {
    const speaking = await TextToSpeech.isSpeaking();
    Alert.alert('Status', speaking ? 'Currently speaking' : 'Not speaking');
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
        <View style={styles.hero}>
          <Text style={styles.title}>Speech Package Playground</Text>
          <Text style={styles.subtitle}>Test all features of rn-text-to-speech and rn-speech-to-text</Text>
        </View>

        <View style={styles.statusRow}>
          <StatusPill label="Speaking" active={isSpeaking} color="#7dd3fc" />
          <StatusPill label="Listening" active={isListening} color="#a7f3d0" />
        </View>

        {/* TTS Section */}
        <View style={styles.card}>
          <Text style={styles.heading}>rn-text-to-speech</Text>
          <Text style={styles.helper}>Text to speech synthesis with configurable options</Text>
          
          <Text style={styles.label}>Text:</Text>
          <TextInput
            style={styles.input}
            value={ttsText}
            onChangeText={setTtsText}
            multiline
          />

          <Text style={styles.label}>Language:</Text>
          <TextInput
            style={styles.input}
            value={ttsLanguage}
            onChangeText={setTtsLanguage}
            placeholder="en-US"
          />

          <Text style={styles.label}>Rate (0.1-10.0):</Text>
          <TextInput
            style={styles.input}
            value={ttsRate}
            onChangeText={setTtsRate}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Pitch (0.5-2.0):</Text>
          <TextInput
            style={styles.input}
            value={ttsPitch}
            onChangeText={setTtsPitch}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Volume (0.0-1.0):</Text>
          <TextInput
            style={styles.input}
            value={ttsVolume}
            onChangeText={setTtsVolume}
            keyboardType="numeric"
          />

          {voices.length > 0 && (
            <>
              <Text style={styles.label}>Voice:</Text>
              <View style={styles.row}>
                {voices.slice(0, 5).map((voice, index) => (
                  <Button
                    key={voice.id}
                    title={voice.name.substring(0, 10)}
                    onPress={() => setSelectedVoice(voice.id)}
                    color={selectedVoice === voice.id ? '#3b82f6' : undefined}
                  />
                ))}
              </View>
            </>
          )}

          <View style={styles.row}>
            <Button title={isSpeaking ? 'Speaking…' : 'Speak'} onPress={handleSpeak} disabled={isSpeaking} />
            <Button title="Stop" color="#d33" onPress={handleStopSpeak} />
          </View>

          <View style={styles.row}>
            <Button title="Set Defaults" onPress={handleSetDefaults} />
            <Button title="Check Status" onPress={handleCheckSpeaking} />
          </View>

          <Text style={styles.label}>Available Voices: {voices.length}</Text>
        </View>

        {/* STT Section */}
        <View style={styles.card}>
          <Text style={styles.heading}>rn-speech-to-text</Text>
          <Text style={styles.helper}>Speech recognition with configurable options</Text>

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

          <View style={styles.row}>
            <Button
              title={`Partial: ${sttPartialResults ? 'ON' : 'OFF'}`}
              onPress={() => setSttPartialResults(!sttPartialResults)}
            />
            <Button
              title={`Continuous: ${sttContinuous ? 'ON' : 'OFF'}`}
              onPress={() => setSttContinuous(!sttContinuous)}
            />
          </View>

          <View style={styles.row}>
            <Button
              title={isListening ? 'Listening…' : 'Start Listening'}
              onPress={handleStartListening}
              disabled={isListening}
            />
            <Button title="Stop" color="#d33" onPress={handleStopListening} />
            <Button title="Cancel" color="#f59e0b" onPress={handleCancelListening} />
          </View>

          <View style={styles.row}>
            <Button title="Check Status" onPress={handleCheckListening} />
            <Button title="Check Permissions" onPress={handleCheckPermissions} />
          </View>

          {isListening && (
            <View style={styles.inlineStatus}>
              <ActivityIndicator size="small" color="#a7f3d0" />
              <Text style={styles.inlineStatusText}>Listening… speak now</Text>
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
        </View>
      </ScrollView>
    </View>
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
  hero: {
    gap: 8,
    paddingHorizontal: 4,
    paddingTop: 12,
    paddingBottom: 4,
  },
  title: {
    fontSize: 26,
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
  card: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderColor: 'rgba(255,255,255,0.14)',
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
  input: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    marginBottom: 12,
    backgroundColor: 'rgba(0,6,30,0.55)',
    color: '#e5e7eb',
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
    color: '#d1d5db',
    fontWeight: '500',
  },
  label: {
    marginTop: 8,
    fontWeight: '600',
    color: '#cbd5e1',
  },
  output: {
    minHeight: 24,
    paddingVertical: 4,
    color: '#e5e7eb',
  },
  statusText: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
    fontStyle: 'italic',
  },
  errorBox: {
    backgroundColor: 'rgba(255,76,76,0.14)',
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
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  pillText: {
    fontWeight: '600',
    color: '#e5e7eb',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
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

export default App;
