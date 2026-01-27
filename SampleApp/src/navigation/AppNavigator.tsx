import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text } from 'react-native';

// Pages
import TextToSpeechPage from '../pages/TextToSpeechPage';
import SpeechToTextPage from '../pages/SpeechToTextPage';
import VoiceAssistantPage from '../pages/VoiceAssistantPage';
import OCRPage from '../pages/OCRPage';
import SettingsPage from '../pages/SettingsPage';
import HistoryPage from '../pages/HistoryPage';
import VoiceLibraryPage from '../pages/VoiceLibraryPage';
import AboutPage from '../pages/AboutPage';
import WebPreviewPage from '../pages/WebPreviewPage';
import HTMLRenderPage from '../pages/HTMLRenderPage';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

type TabBarIconProps = {
  focused: boolean;
  color: string;
  size: number;
};

function TabBarIcon({ focused }: TabBarIconProps) {
  return (
    <Text style={{ color: focused ? '#7dd3fc' : '#9ca3af', fontSize: 20 }}>
      {focused ? '●' : '○'}
    </Text>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Stack.Screen name="MainTabs">
        {() => (
          <Tab.Navigator
            screenOptions={{
              tabBarIcon: TabBarIcon,
              tabBarActiveTintColor: '#7dd3fc',
              tabBarInactiveTintColor: '#9ca3af',
              tabBarStyle: {
                backgroundColor: 'rgba(5, 9, 20, 0.85)',
                borderTopColor: 'rgba(255, 255, 255, 0.1)',
                borderTopWidth: 1,
                height: 70,
                paddingBottom: 10,
                paddingTop: 8,
              },
              headerShown: false,
            }}
          >
            <Tab.Screen 
              name="TextToSpeech" 
              component={TextToSpeechPage}
              options={{ title: 'TTS' }}
            />
            <Tab.Screen 
              name="SpeechToText" 
              component={SpeechToTextPage}
              options={{ title: 'STT' }}
            />
            <Tab.Screen 
              name="VoiceAssistant" 
              component={VoiceAssistantPage}
              options={{ title: 'Assistant' }}
            />
            <Tab.Screen 
              name="OCR" 
              component={OCRPage}
              options={{ title: 'OCR' }}
            />
            <Tab.Screen 
              name="Settings" 
              component={SettingsPage}
              options={{ title: 'Settings' }}
            />
            <Tab.Screen 
              name="History" 
              component={HistoryPage}
              options={{ title: 'History' }}
            />
            <Tab.Screen 
              name="VoiceLibrary" 
              component={VoiceLibraryPage}
              options={{ title: 'Voices' }}
            />
            <Tab.Screen 
              name="About" 
              component={AboutPage}
              options={{ title: 'About' }}
            />
            <Tab.Screen 
              name="WebPreview" 
              component={WebPreviewPage}
              options={{ title: 'Web' }}
            />
            <Tab.Screen 
              name="HTMLRender" 
              component={HTMLRenderPage}
              options={{ title: 'HTML' }}
            />
          </Tab.Navigator>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
