import React, {useCallback, useEffect, useState} from 'react';
import {Button, ScrollView, StyleSheet, Text, View} from 'react-native';
import otr, {OCRResult} from 'rn-otr';

function OtrTestScreen() {
  const [running, setRunning] = useState(false);
  const [lastResult, setLastResult] = useState<OCRResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (running) {
        otr.stopLiveTextRecognition().catch(() => {});
        otr.stopCamera().catch(() => {});
      }
    };
  }, [running]);

  const start = useCallback(async () => {
    try {
      setError(null);
      const granted = await otr.requestCameraPermission();
      if (!granted) {
        setError('Camera permission not granted');
        return;
      }

      await otr.startCamera({facing: 'back'});
      await otr.startLiveTextRecognition({
        fps: 10,
        onTextRecognized: (result: OCRResult) => {
          setLastResult(result);
        },
      });
      setRunning(true);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    }
  }, []);

  const stop = useCallback(async () => {
    try {
      await otr.stopLiveTextRecognition();
      await otr.stopCamera();
      setRunning(false);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>rn-otr Live OCR Test</Text>
      <View style={styles.buttons}>
        <Button title="Start" onPress={start} disabled={running} />
        <Button title="Stop" onPress={stop} disabled={!running} />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <ScrollView style={styles.resultBox}>
        <Text style={styles.resultTitle}>Recognized text:</Text>
        <Text style={styles.resultText}>{lastResult?.text ?? '—'}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  error: {
    color: 'red',
    marginBottom: 12,
  },
  resultBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
  },
  resultTitle: {
    fontWeight: '500',
    marginBottom: 4,
  },
  resultText: {
    fontSize: 14,
  },
});

export default OtrTestScreen;
