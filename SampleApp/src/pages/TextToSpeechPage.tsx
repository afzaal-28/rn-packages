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
import TextToSpeech from 'rn-text-to-speech';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TextToSpeechPage() {
  const insets = useSafeAreaInsets();

  const [ttsText, setTtsText] = useState('Hello from rn-text-to-speech');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsLanguage, setTtsLanguage] = useState('en-US');
  const [ttsRate, setTtsRate] = useState('1.0');
  const [ttsPitch, setTtsPitch] = useState('1.0');
  const [ttsVolume, setTtsVolume] = useState('1.0');
  const [voices, setVoices] = useState<Array<{ id: string; name: string; language: string }>>([]);
  const [selectedVoice, setSelectedVoice] = useState('');

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

    loadVoices();

    return () => {
      TextToSpeech.removeAllListeners();
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

  const handlePause = async () => {
    await TextToSpeech.pause();
  };

  const handleResume = async () => {
    await TextToSpeech.resume();
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
          <Text style={styles.title}>Text to Speech</Text>
          <Text style={styles.subtitle}>All features of rn-text-to-speech</Text>
        </View>

        <View style={styles.statusRow}>
          <View style={[styles.statusPill, { borderColor: isSpeaking ? '#7dd3fc' : '#9ca3af', backgroundColor: isSpeaking ? 'rgba(125, 211, 252, 0.15)' : 'rgba(156, 163, 175, 0.15)' }]}>
            <View style={[styles.statusDot, { backgroundColor: isSpeaking ? '#7dd3fc' : '#9ca3af' }]} />
            <Text style={[styles.statusText, { color: isSpeaking ? '#7dd3fc' : '#9ca3af' }]}>
              {isSpeaking ? 'Speaking' : 'Idle'}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.heading}>Text Input</Text>
          <TextInput
            style={styles.input}
            value={ttsText}
            onChangeText={setTtsText}
            multiline
            placeholder="Enter text to speak..."
            placeholderTextColor="#6b7280"
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
              <View style={styles.voiceGrid}>
                {voices.slice(0, 6).map((voice, index) => (
                  <Button
                    key={voice.id}
                    title={voice.name.substring(0, 12)}
                    onPress={() => setSelectedVoice(voice.id)}
                    color={selectedVoice === voice.id ? '#3b82f6' : '#4b5563'}
                  />
                ))}
              </View>
            </>
          )}

          <View style={styles.buttonRow}>
            <Button title={isSpeaking ? 'Speaking…' : 'Speak'} onPress={handleSpeak} disabled={isSpeaking} />
            <Button title="Stop" color="#ef4444" onPress={handleStopSpeak} />
          </View>

          <View style={styles.buttonRow}>
            <Button title="Pause" color="#f59e0b" onPress={handlePause} />
            <Button title="Resume" color="#10b981" onPress={handleResume} />
          </View>

          <View style={styles.buttonRow}>
            <Button title="Set Defaults" onPress={handleSetDefaults} />
            <Button title="Check Status" onPress={handleCheckSpeaking} />
          </View>

          <Text style={styles.infoText}>Available Voices: {voices.length}</Text>
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
    minHeight: 80,
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
  voiceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  infoText: {
    marginTop: 12,
    color: '#9ca3af',
    fontSize: 12,
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
