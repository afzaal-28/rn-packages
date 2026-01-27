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
import SpeechToText from 'rn-speech-to-text';
import SmartNotifications from 'rn-smart-notifications';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Message = {
  id: string;
  text: string;
  type: 'user' | 'assistant';
  timestamp: Date;
};

export default function VoiceAssistantPage() {
  const insets = useSafeAreaInsets();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I am your voice assistant. You can speak to me and I will respond.',
      type: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [partialResult, setPartialResult] = useState('');

  useEffect(() => {
    const sttStart = SpeechToText.addEventListener('onStart', () =>
      setIsListening(true),
    );
    const sttPartialListener = SpeechToText.addEventListener(
      'onPartialResult',
      result => setPartialResult(result.transcript),
    );
    const sttResultListener = SpeechToText.addEventListener('onResult', result => {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: result.transcript,
        type: 'user',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);
      setPartialResult('');
      setIsListening(false);
      
      // Generate a simple response
      setTimeout(() => {
        const responses = [
          'I understand what you said.',
          'That\'s interesting! Tell me more.',
          'I can help you with that.',
          'Great question!',
          'Let me think about that.',
          'I hear you loud and clear.',
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: randomResponse,
          type: 'assistant',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
        
        // Speak the response
        TextToSpeech.speak(randomResponse, { language: 'en-US' });
      }, 500);
    });
    const sttError = SpeechToText.addEventListener('onError', () =>
      setIsListening(false),
    );
    const sttEnd = SpeechToText.addEventListener('onEnd', () =>
      setIsListening(false),
    );

    const ttsStart = TextToSpeech.addEventListener('onStart', () =>
      setIsSpeaking(true),
    );
    const ttsFinish = TextToSpeech.addEventListener('onFinish', () =>
      setIsSpeaking(false),
    );

    return () => {
      SpeechToText.removeAllListeners();
      TextToSpeech.removeAllListeners();
    };
  }, []);

  const handleStartListening = async () => {
    const granted = await SpeechToText.requestPermissions();
    if (!granted) {
      Alert.alert('Permission Required', 'Microphone permission is required.');
      return;
    }
    setPartialResult('');
    await SpeechToText.startListening({
      language: 'en-US',
      partialResults: true,
      continuous: false,
      maxResults: 1,
    });
  };

  const handleStopListening = async () => {
    await SpeechToText.stopListening();
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      type: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Generate a simple response
    setTimeout(() => {
      const responses = [
        'I understand what you said.',
        'That\'s interesting! Tell me more.',
        'I can help you with that.',
        'Great question!',
        'Let me think about that.',
        'I hear you loud and clear.',
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        type: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      
      // Speak the response
      TextToSpeech.speak(randomResponse, { language: 'en-US' });
    }, 500);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.auroraOne} />
      <View style={styles.auroraTwo} />
      
      <View style={styles.header}>
        <Text style={styles.title}>Voice Assistant</Text>
        <Text style={styles.subtitle}>Speak or type to interact</Text>
      </View>

      <View style={styles.statusRow}>
        <View style={[styles.statusPill, { borderColor: isListening ? '#a7f3d0' : '#9ca3af', backgroundColor: isListening ? 'rgba(167, 243, 208, 0.15)' : 'rgba(156, 163, 175, 0.15)' }]}>
          <View style={[styles.statusDot, { backgroundColor: isListening ? '#a7f3d0' : '#9ca3af' }]} />
          <Text style={[styles.statusText, { color: isListening ? '#a7f3d0' : '#9ca3af' }]}>
            {isListening ? 'Listening' : 'Idle'}
          </Text>
        </View>
        <View style={[styles.statusPill, { borderColor: isSpeaking ? '#7dd3fc' : '#9ca3af', backgroundColor: isSpeaking ? 'rgba(125, 211, 252, 0.15)' : 'rgba(156, 163, 175, 0.15)' }]}>
          <View style={[styles.statusDot, { backgroundColor: isSpeaking ? '#7dd3fc' : '#9ca3af' }]} />
          <Text style={[styles.statusText, { color: isSpeaking ? '#7dd3fc' : '#9ca3af' }]}>
            {isSpeaking ? 'Speaking' : 'Idle'}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.messagesContainer} contentContainerStyle={styles.messagesContent}>
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageBubble,
              message.type === 'user' ? styles.userMessage : styles.assistantMessage,
            ]}
          >
            <Text style={[styles.messageText, message.type === 'user' ? styles.userText : styles.assistantText]}>
              {message.text}
            </Text>
          </View>
        ))}
        {partialResult && (
          <View style={[styles.messageBubble, styles.userMessage, styles.partialMessage]}>
            <Text style={[styles.messageText, styles.userText]}>{partialResult}</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          placeholderTextColor="#6b7280"
          multiline
        />
        <View style={styles.buttonRow}>
          <Button
            title={isListening ? 'Stop' : '🎤'}
            onPress={isListening ? handleStopListening : handleStartListening}
            color={isListening ? '#ef4444' : '#10b981'}
          />
          <Button title="Send" onPress={handleSendMessage} disabled={!inputText.trim()} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050914',
  },
  header: {
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
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
    paddingHorizontal: 16,
    marginBottom: 8,
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
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesContent: {
    paddingBottom: 16,
    gap: 12,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  userMessage: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  assistantMessage: {
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderColor: 'rgba(255, 255, 255, 0.14)',
    borderWidth: 1,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  partialMessage: {
    opacity: 0.6,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userText: {
    color: '#e5e7eb',
  },
  assistantText: {
    color: '#e5e7eb',
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 12,
    padding: 12,
    backgroundColor: 'rgba(0, 6, 30, 0.55)',
    color: '#e5e7eb',
    maxHeight: 100,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
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
