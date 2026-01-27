import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  Switch,
  Button,
  Alert,
} from 'react-native';
import BiometricAuth from 'rn-biometric-auth';
import SmartNotifications from 'rn-smart-notifications';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type SettingItem = {
  id: string;
  title: string;
  description: string;
  type: 'toggle' | 'input' | 'select';
  value: any;
};

export default function SettingsPage() {
  const insets = useSafeAreaInsets();

  const [settings, setSettings] = useState<SettingItem[]>([
    { id: '1', title: 'Dark Mode', description: 'Use dark theme', type: 'toggle', value: true },
    { id: '2', title: 'Auto-scroll', description: 'Auto-scroll to new messages', type: 'toggle', value: true },
    { id: '3', title: 'Sound Effects', description: 'Play sound on events', type: 'toggle', value: false },
    { id: '4', title: 'Default Language', description: 'Speech recognition language', type: 'input', value: 'en-US' },
    { id: '5', title: 'Speech Rate', description: 'Text-to-speech rate', type: 'input', value: '1.0' },
    { id: '6', title: 'Voice Pitch', description: 'Text-to-speech pitch', type: 'input', value: '1.0' },
    { id: '7', title: 'Show Timestamps', description: 'Display message timestamps', type: 'toggle', value: true },
    { id: '8', title: 'Haptic Feedback', description: 'Vibrate on interactions', type: 'toggle', value: true },
    { id: '9', title: 'Biometric Auth', description: 'Use fingerprint/face ID', type: 'toggle', value: false },
    { id: '10', title: 'Notifications', description: 'Enable push notifications', type: 'toggle', value: true },
  ]);

  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricEnrolled, setBiometricEnrolled] = useState(false);

  useEffect(() => {
    // Check biometric availability
    BiometricAuth.checkAvailability().then((availability) => {
      setBiometricAvailable(availability.isAvailable);
    }).catch(() => {
      setBiometricAvailable(false);
    });

    BiometricAuth.isEnrolled().then((enrolled) => {
      setBiometricEnrolled(enrolled);
    }).catch(() => {
      setBiometricEnrolled(false);
    });

    // Setup notification channel
    SmartNotifications.createChannel({
      channelId: 'default',
      channelName: 'Default',
      importance: 'high',
    }).catch(console.error);
  }, []);

  const handleToggle = async (id: string) => {
    const setting = settings.find(s => s.id === id);
    
    // Special handling for biometric auth
    if (id === '9' && setting?.value === false) {
      if (!biometricAvailable) {
        Alert.alert('Not Available', 'Biometric authentication is not available on this device.');
        return;
      }
      if (!biometricEnrolled) {
        Alert.alert('Not Enrolled', 'Please enroll a fingerprint or face ID first.');
        return;
      }
      
      try {
        const result = await BiometricAuth.authenticate({
          promptMessage: 'Authenticate to enable biometric login',
          promptTitle: 'Biometric Authentication',
          cancelButtonText: 'Cancel',
          fallbackToPasscode: true,
        });
        
        if (result.success) {
          setSettings(prev =>
            prev.map(item =>
              item.id === id ? { ...item, value: !item.value } : item
            )
          );
          
          // Show notification
          await SmartNotifications.showNotification('biometric-enabled', {
            title: 'Biometric Enabled',
            body: 'Biometric authentication has been enabled',
            channelId: 'default',
          });
        }
      } catch (error) {
        Alert.alert('Authentication Failed', 'Unable to authenticate');
      }
      return;
    }
    
    // Special handling for notifications
    if (id === '10' && setting?.value === false) {
      const granted = await SmartNotifications.requestPermissions();
      if (!granted) {
        Alert.alert('Permission Required', 'Notification permission is required.');
        return;
      }
      
      await SmartNotifications.showNotification('notifications-enabled', {
        title: 'Notifications Enabled',
        body: 'Push notifications have been enabled',
        channelId: 'default',
      });
    }
    
    setSettings(prev =>
      prev.map(item =>
        item.id === id ? { ...item, value: !item.value } : item
      )
    );
  };

  const handleInputChange = (id: string, value: string) => {
    setSettings(prev =>
      prev.map(item =>
        item.id === id ? { ...item, value } : item
      )
    );
  };

  const handleSave = () => {
    Alert.alert('Settings Saved', 'Your settings have been saved successfully.');
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to default?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setSettings([
              { id: '1', title: 'Dark Mode', description: 'Use dark theme', type: 'toggle', value: true },
              { id: '2', title: 'Auto-scroll', description: 'Auto-scroll to new messages', type: 'toggle', value: true },
              { id: '3', title: 'Sound Effects', description: 'Play sound on events', type: 'toggle', value: false },
              { id: '4', title: 'Default Language', description: 'Speech recognition language', type: 'input', value: 'en-US' },
              { id: '5', title: 'Speech Rate', description: 'Text-to-speech rate', type: 'input', value: '1.0' },
              { id: '6', title: 'Voice Pitch', description: 'Text-to-speech pitch', type: 'input', value: '1.0' },
              { id: '7', title: 'Show Timestamps', description: 'Display message timestamps', type: 'toggle', value: true },
              { id: '8', title: 'Haptic Feedback', description: 'Vibrate on interactions', type: 'toggle', value: true },
            ]);
            Alert.alert('Reset Complete', 'Settings have been reset to defaults.');
          },
        },
      ]
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
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Customize your experience</Text>
        </View>

        {settings.map((setting) => (
          <View key={setting.id} style={styles.card}>
            <Text style={styles.settingTitle}>{setting.title}</Text>
            <Text style={styles.settingDesc}>{setting.description}</Text>

            {setting.type === 'toggle' && (
              <Switch
                value={setting.value}
                onValueChange={() => handleToggle(setting.id)}
                trackColor={{ false: '#374151', true: '#3b82f6' }}
                thumbColor={setting.value ? '#60a5fa' : '#9ca3af'}
              />
            )}

            {setting.type === 'input' && (
              <TextInput
                style={styles.input}
                value={setting.value}
                onChangeText={(value) => handleInputChange(setting.id, value)}
                placeholder={setting.title}
                placeholderTextColor="#6b7280"
              />
            )}
          </View>
        ))}

        <View style={styles.buttonRow}>
          <Button title="Save Settings" onPress={handleSave} />
          <Button title="Reset to Default" color="#ef4444" onPress={handleReset} />
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
    gap: 12,
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
    borderRadius: 16,
    padding: 16,
    shadowColor: '#00f0ff',
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e5e7eb',
    marginBottom: 4,
  },
  settingDesc: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 8,
    padding: 12,
    backgroundColor: 'rgba(0, 6, 30, 0.55)',
    color: '#e5e7eb',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
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
