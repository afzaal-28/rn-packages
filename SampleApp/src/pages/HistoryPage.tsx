import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type HistoryItem = {
  id: string;
  type: 'speech' | 'text' | 'ocr';
  content: string;
  timestamp: Date;
};

export default function HistoryPage() {
  const insets = useSafeAreaInsets();

  const mockHistory: HistoryItem[] = [
    {
      id: '1',
      type: 'speech',
      content: 'Hello, how are you today?',
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: '2',
      type: 'text',
      content: 'This is a sample text that was spoken',
      timestamp: new Date(Date.now() - 7200000),
    },
    {
      id: '3',
      type: 'speech',
      content: 'Can you help me with something?',
      timestamp: new Date(Date.now() - 10800000),
    },
    {
      id: '4',
      type: 'ocr',
      content: 'Sample text extracted from image',
      timestamp: new Date(Date.now() - 14400000),
    },
    {
      id: '5',
      type: 'text',
      content: 'Another example of spoken text',
      timestamp: new Date(Date.now() - 18000000),
    },
  ];

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);

    if (hours > 0) {
      return `${hours}h ago`;
    }
    if (minutes > 0) {
      return `${minutes}m ago`;
    }
    return 'Just now';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'speech':
        return '🎤';
      case 'text':
        return '💬';
      case 'ocr':
        return '📷';
      default:
        return '📝';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'speech':
        return '#a7f3d0';
      case 'text':
        return '#7dd3fc';
      case 'ocr':
        return '#fcd34d';
      default:
        return '#9ca3af';
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.auroraOne} />
      <View style={styles.auroraTwo} />
      
      <View style={styles.header}>
        <Text style={styles.title}>History</Text>
        <Text style={styles.subtitle}>Recent activity and logs</Text>
      </View>

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scroll}
        contentContainerStyle={styles.content}
      >
        {mockHistory.map((item) => (
          <TouchableOpacity key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.typeIcon}>{getTypeIcon(item.type)}</Text>
              <View style={styles.cardHeaderContent}>
                <Text style={[styles.typeLabel, { color: getTypeColor(item.type) }]}>
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                </Text>
                <Text style={styles.timestamp}>{formatTime(item.timestamp)}</Text>
              </View>
            </View>
            <Text style={styles.contentText}>{item.content}</Text>
          </TouchableOpacity>
        ))}
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
    marginBottom: 8,
  },
  typeIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  cardHeaderContent: {
    flex: 1,
  },
  typeLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 12,
    color: '#9ca3af',
  },
  contentText: {
    color: '#e5e7eb',
    lineHeight: 20,
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
