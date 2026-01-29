# rn-text-to-speech

A React Native native module for text-to-speech (TTS) with TypeScript support for Android and iOS.

## Features

- 🔊 **Text-to-speech synthesis** with native performance
- 📱 **Cross-platform** support for Android and iOS
- 🔗 **Auto-linking** support (React Native ≥ 0.60)
- 🎯 **TypeScript** type definitions included
- ⚡ **Promise-based API** with event emitters
- 🎚️ **Configurable** speech rate, pitch, volume, and voice selection
- 🌍 **Multi-language** support
- 📦 **Zero dependencies** (peer dependencies only)

## Installation

```bash
npm install rn-text-to-speech
# or
yarn add rn-text-to-speech
```

For React Native ≥ 0.60, the library will auto-link. After installation, rebuild your app:

```bash
# iOS
cd ios && pod install && cd ..
npx react-native run-ios

# Android
npx react-native run-android
```

## Usage

### Basic Example

```typescript
import TextToSpeech from 'rn-text-to-speech';

// Speak text with default settings
await TextToSpeech.speak('Hello from React Native!');

// Check if currently speaking
const speaking = await TextToSpeech.isSpeaking();

// Stop speaking
await TextToSpeech.stop();
```

### Advanced Example with Options

```typescript
import TextToSpeech from 'rn-text-to-speech';

await TextToSpeech.speak('Hello, how are you?', {
  language: 'en-US',
  rate: 1.0,      // 0.1 to 10.0
  pitch: 1.0,     // 0.5 to 2.0
  volume: 1.0,    // 0.0 to 1.0
});
```

### Event Listeners

```typescript
import TextToSpeech from 'rn-text-to-speech';

// Listen for speech events
const onStartListener = TextToSpeech.addEventListener('onStart', () => {
  console.log('Speech started');
});

const onFinishListener = TextToSpeech.addEventListener('onFinish', () => {
  console.log('Speech finished');
});

const onErrorListener = TextToSpeech.addEventListener('onError', (error) => {
  console.error('Error:', error.code, error.message);
});

// Clean up listeners
TextToSpeech.removeEventListener(onStartListener);
// or remove all
TextToSpeech.removeAllListeners();
```

### Get Available Voices

```typescript
const voices = await TextToSpeech.getAvailableVoices();
voices.forEach(voice => {
  console.log(`${voice.name} (${voice.language})`);
});

// Use a specific voice
await TextToSpeech.speak('Hello', { voice: voices[0].id });
```

### Set Default Configuration

```typescript
// Set default language
await TextToSpeech.setDefaultLanguage('es-ES');

// Set default rate
await TextToSpeech.setDefaultRate(1.5);

// Set default pitch
await TextToSpeech.setDefaultPitch(1.2);
```

### Complete React Component Example

```typescript
import React, { useEffect, useState } from 'react';
import { View, Button, TextInput, StyleSheet } from 'react-native';
import TextToSpeech from 'rn-text-to-speech';

export default function TTSScreen() {
  const [text, setText] = useState('Hello from React Native!');
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const startListener = TextToSpeech.addEventListener('onStart', () => {
      setIsSpeaking(true);
    });

    const finishListener = TextToSpeech.addEventListener('onFinish', () => {
      setIsSpeaking(false);
    });

    const errorListener = TextToSpeech.addEventListener('onError', (error) => {
      console.error(error);
      setIsSpeaking(false);
    });

    return () => {
      TextToSpeech.removeAllListeners();
    };
  }, []);

  const handleSpeak = async () => {
    try {
      await TextToSpeech.speak(text, {
        rate: 1.0,
        pitch: 1.0,
      });
    } catch (error) {
      console.error('Failed to speak:', error);
    }
  };

  const handleStop = async () => {
    await TextToSpeech.stop();
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Enter text to speak"
        multiline
      />
      <Button
        title={isSpeaking ? 'Speaking...' : 'Speak'}
        onPress={handleSpeak}
        disabled={isSpeaking}
      />
      {isSpeaking && <Button title="Stop" onPress={handleStop} color="red" />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    minHeight: 100,
  },
});
```

## API Reference

### Methods

#### `speak(text: string, options?: TextToSpeechOptions): Promise<void>`

Speaks the given text with optional configuration.

```typescript
interface TextToSpeechOptions {
  language?: string;  // default: 'en-US'
  rate?: number;      // default: 1.0 (range: 0.1-10.0)
  pitch?: number;     // default: 1.0 (range: 0.5-2.0)
  volume?: number;    // default: 1.0 (range: 0.0-1.0)
  voice?: string;     // Voice ID from getAvailableVoices()
}
```

#### `stop(): Promise<void>`

Stops the current speech immediately.

#### `isSpeaking(): Promise<boolean>`

Returns whether speech is currently active.

#### `getAvailableVoices(): Promise<Voice[]>`

Returns an array of available voices on the device.

```typescript
interface Voice {
  id: string;
  name: string;
  language: string;
  quality?: string;
}
```

#### `setDefaultLanguage(language: string): Promise<void>`

Sets the default language for speech synthesis.

#### `setDefaultRate(rate: number): Promise<void>`

Sets the default speech rate (0.1 to 10.0).

#### `setDefaultPitch(pitch: number): Promise<void>`

Sets the default speech pitch (0.5 to 2.0).

### Events

- **onStart**: Emitted when speech starts
- **onFinish**: Emitted when speech completes
- **onError**: Emitted when an error occurs

```typescript
interface TextToSpeechError {
  code: string;
  message: string;
}
```

**Error Codes:**
- `INITIALIZATION_ERROR`: TTS engine failed to initialize
- `NOT_AVAILABLE`: TTS not available or language not supported
- `INVALID_REQUEST`: Invalid parameters provided
- `NETWORK_ERROR`: Network-related error
- `SYNTHESIS_ERROR`: Speech synthesis failed
- `UNKNOWN`: Unknown error

### Event Management

#### `addEventListener<K extends keyof TextToSpeechEvents>(event: K, handler: Function): EmitterSubscription`

Adds an event listener.

#### `removeEventListener(listener: EmitterSubscription): void`

Removes a specific event listener.

#### `removeAllListeners(): void`

Removes all event listeners.

## Supported Languages

Common language codes: `en-US`, `en-GB`, `es-ES`, `es-MX`, `fr-FR`, `de-DE`, `it-IT`, `ja-JP`, `ko-KR`, `zh-CN`, `pt-BR`, `ru-RU`, `ar-SA`, `hi-IN`

The library supports all languages available on the device. Use `getAvailableVoices()` to see what's available.

## Platform Differences

### Android
- Uses `android.speech.tts.TextToSpeech`
- Supports rate range: 0.1 to 10.0
- Supports pitch range: 0.5 to 2.0
- Voice quality levels: very-low, low, normal, high, very-high
- May require Google TTS engine or other TTS apps

### iOS
- Uses `AVSpeechSynthesizer` with `AVSpeechUtterance`
- Requires iOS 12.0 or later
- Voice quality levels: default, enhanced, premium
- Rate is normalized to iOS range internally

## Requirements

- React Native ≥ 0.60.0
- Android: minSdkVersion 21 (Android 5.0)
- iOS: iOS 12.0 or later

## Troubleshooting

### Android

**Issue:** No speech output
- Ensure a TTS engine is installed (Google Text-to-Speech recommended)
- Check device TTS settings
- Verify language data is downloaded

**Issue:** Language not supported
- Install language packs in device TTS settings
- Use `getAvailableVoices()` to check available languages

### iOS

**Issue:** Speech not working
- Verify iOS version is 12.0 or later
- Check that the requested language is available
- Some voices may require internet connection for first use

## License

MIT

## Author

afzaal