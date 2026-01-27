import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Button,
  Linking,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AboutPage() {
  const insets = useSafeAreaInsets();

  const handleOpenRepo = () => {
    Linking.openURL('https://github.com/afzaal-28/rn-packages').catch(() => {
      Alert.alert('Error', 'Unable to open the repository link.');
    });
  };

  const handleContact = () => {
    Alert.alert('Contact', 'For support, please open an issue on GitHub.');
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
          <Text style={styles.title}>About</Text>
          <Text style={styles.subtitle}>Speech Packages Sample App</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>🎤</Text>
          </View>
          <Text style={styles.appName}>Speech Sample App</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
          <Text style={styles.description}>
            A comprehensive sample application demonstrating the features of rn-text-to-speech
            and rn-speech-to-text packages with a beautiful liquid glass UI design.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.heading}>Features</Text>
          <View style={styles.featureList}>
            <Text style={styles.featureItem}>✨ Text-to-Speech with full control</Text>
            <Text style={styles.featureItem}>🎤 Speech-to-Text recognition</Text>
            <Text style={styles.featureItem}>🤖 Voice Assistant integration</Text>
            <Text style={styles.featureItem}>📷 OCR capabilities (placeholder)</Text>
            <Text style={styles.featureItem}>⚙️ Customizable settings</Text>
            <Text style={styles.featureItem}>📜 Activity history</Text>
            <Text style={styles.featureItem}>🎭 Voice library management</Text>
            <Text style={styles.featureItem}>💎 Liquid glass UI design</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.heading}>Packages Used</Text>
          <View style={styles.packageList}>
            <Text style={styles.packageItem}>• rn-text-to-speech</Text>
            <Text style={styles.packageItem}>• rn-speech-to-text</Text>
            <Text style={styles.packageItem}>• react-navigation</Text>
            <Text style={styles.packageItem}>• react-native-safe-area-context</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.heading}>Technical Details</Text>
          <View style={styles.techList}>
            <Text style={styles.techItem}>React Native 0.83.1</Text>
            <Text style={styles.techItem}>TypeScript</Text>
            <Text style={styles.techItem}>Navigation with bottom tabs</Text>
            <Text style={styles.techItem}>Glassmorphism UI design</Text>
          </View>
        </View>

        <View style={styles.buttonRow}>
          <Button title="View on GitHub" onPress={handleOpenRepo} />
          <Button title="Contact Support" onPress={handleContact} />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Built with ❤️ using React Native
          </Text>
          <Text style={styles.footerText}>
            © 2024 Afzaal Ahmed
          </Text>
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
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 48,
    paddingHorizontal: 16,
    gap: 16,
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
  logoContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  logo: {
    fontSize: 48,
  },
  appName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#e5e7eb',
    textAlign: 'center',
    marginBottom: 4,
  },
  version: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    color: '#cbd5e1',
    lineHeight: 20,
    textAlign: 'center',
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e5e7eb',
    marginBottom: 12,
  },
  featureList: {
    gap: 8,
  },
  featureItem: {
    color: '#cbd5e1',
    lineHeight: 24,
  },
  packageList: {
    gap: 6,
  },
  packageItem: {
    color: '#cbd5e1',
    lineHeight: 22,
  },
  techList: {
    gap: 6,
  },
  techItem: {
    color: '#cbd5e1',
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  footer: {
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  footerText: {
    fontSize: 12,
    color: '#6b7280',
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
