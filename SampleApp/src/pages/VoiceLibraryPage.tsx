import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Button,
  Alert,
} from 'react-native';
import TextToSpeech from 'rn-text-to-speech';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type VoiceProfile = {
  id: string;
  name: string;
  language: string;
  rate: number;
  pitch: number;
  isFavorite: boolean;
};

export default function VoiceLibraryPage() {
  const insets = useSafeAreaInsets();
  const [voices, setVoices] = useState<Array<{ id: string; name: string; language: string }>>([]);
  const [profiles, setProfiles] = useState<VoiceProfile[]>([
    {
      id: '1',
      name: 'Default Voice',
      language: 'en-US',
      rate: 1.0,
      pitch: 1.0,
      isFavorite: true,
    },
    {
      id: '2',
      name: 'Fast Voice',
      language: 'en-US',
      rate: 1.5,
      pitch: 1.0,
      isFavorite: false,
    },
    {
      id: '3',
      name: 'Slow Voice',
      language: 'en-US',
      rate: 0.8,
      pitch: 1.0,
      isFavorite: false,
    },
  ]);

  useEffect(() => {
    loadVoices();
  }, []);

  const loadVoices = async () => {
    try {
      const availableVoices = await TextToSpeech.getAvailableVoices();
      setVoices(availableVoices);
    } catch (error) {
      console.warn('Failed to load voices:', error);
    }
  };

  const handleToggleFavorite = (id: string) => {
    setProfiles(prev =>
      prev.map(profile =>
        profile.id === id ? { ...profile, isFavorite: !profile.isFavorite } : profile
      )
    );
  };

  const handleTestVoice = (profile: VoiceProfile) => {
    TextToSpeech.speak('This is a test of the voice profile.', {
      language: profile.language,
      rate: profile.rate,
      pitch: profile.pitch,
    });
  };

  const handleDeleteProfile = (id: string) => {
    Alert.alert(
      'Delete Profile',
      'Are you sure you want to delete this voice profile?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setProfiles(prev => prev.filter(p => p.id !== id));
          },
        },
      ]
    );
  };

  const handleCreateProfile = () => {
    const newProfile: VoiceProfile = {
      id: Date.now().toString(),
      name: `Voice ${profiles.length + 1}`,
      language: 'en-US',
      rate: 1.0,
      pitch: 1.0,
      isFavorite: false,
    };
    setProfiles(prev => [...prev, newProfile]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.auroraOne} />
      <View style={styles.auroraTwo} />
      
      <View style={styles.header}>
        <Text style={styles.title}>Voice Library</Text>
        <Text style={styles.subtitle}>Manage voice profiles and settings</Text>
      </View>

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scroll}
        contentContainerStyle={styles.content}
      >
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Available Voices</Text>
          <Text style={styles.infoText}>Total: {voices.length}</Text>
        </View>

        {profiles.map((profile) => (
          <View key={profile.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{profile.name}</Text>
                <Text style={styles.profileDetails}>
                  {profile.language} • Rate: {profile.rate}x • Pitch: {profile.pitch}
                </Text>
              </View>
              <TouchableOpacity onPress={() => handleToggleFavorite(profile.id)}>
                <Text style={styles.favoriteIcon}>
                  {profile.isFavorite ? '⭐' : '☆'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonRow}>
              <Button
                title="Test"
                onPress={() => handleTestVoice(profile)}
                color="#3b82f6"
              />
              <Button
                title="Delete"
                onPress={() => handleDeleteProfile(profile.id)}
                color="#ef4444"
              />
            </View>
          </View>
        ))}

        <Button title="Create New Profile" onPress={handleCreateProfile} />
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
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 48,
    gap: 12,
  },
  infoCard: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderColor: '#3b82f6',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#60a5fa',
    marginBottom: 4,
  },
  infoText: {
    color: '#93c5fd',
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e5e7eb',
    marginBottom: 4,
  },
  profileDetails: {
    fontSize: 12,
    color: '#9ca3af',
  },
  favoriteIcon: {
    fontSize: 24,
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
