import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, View, ActivityIndicator, LogBox } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LanguageProvider, useLanguage } from './src/i18n/LanguageContext';
import { AuthProvider, useAuth } from './src/auth/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import SplashScreen from './src/screens/SplashScreen';
import InputScreen from './src/screens/InputScreen';
import ProcessingScreen from './src/screens/ProcessingScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import BottomNavBar from './src/components/BottomNavBar';
import { analyzeContent } from './src/api/analyze';
import { COLORS } from './src/config/theme';

// Suppress React Native layout and console warning noise
LogBox.ignoreAllLogs(true);

function MainNavigator() {
  const { fontsLoaded } = useLanguage();
  const { user, isLoading } = useAuth();
  
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [activeTab, setActiveTab] = useState(0); // 0 = Input, 1 = Results, 2 = History, 3 = Settings
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiPromise, setApiPromise] = useState(null);
  const [activeResult, setActiveResult] = useState(null);

  if (!fontsLoaded || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  // Show Splash Screen First
  if (isSplashVisible) {
    return <SplashScreen onFinish={() => setIsSplashVisible(false)} />;
  }

  // Google Protected Authentication Gate
  if (!user) {
    return <LoginScreen />;
  }

  // Trigger analysis call and transition to Processing Screen
  const handleInitiateAnalysis = (inputContext) => {
    const promise = analyzeContent({
      text: inputContext.text,
      file: inputContext.file,
      fileType: inputContext.fileType
    });
    setApiPromise(promise);
    setIsProcessing(true);
  };

  const handleSelectHistoryItem = (storedData) => {
    setActiveResult(storedData);
    setActiveTab(1); // Redirect to results tab
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#210f37" />
      
      <View style={styles.responsiveWrapper}>
        <View style={styles.viewport}>
          {activeTab === 0 && !isProcessing && (
            <InputScreen onNavigateToProcessing={handleInitiateAnalysis} />
          )}
          {activeTab === 0 && isProcessing && apiPromise && (
            <ProcessingScreen
              inputContext={apiPromise}
              apiPromise={apiPromise}
              onCancel={() => {
                setIsProcessing(false);
                setApiPromise(null);
              }}
              onAnalysisComplete={async (data, error) => {
                setIsProcessing(false);
                setApiPromise(null);

                if (data) {
                  setActiveResult(data);
                  
                  // Sync completion details into AsyncStorage History cache (Max 10)
                  try {
                    const historyStr = await AsyncStorage.getItem('analyses_history');
                    let historyList = historyStr ? JSON.parse(historyStr) : [];
                    
                    const newRun = {
                      id: data.run_id || Math.random().toString(36).substring(7).toUpperCase(),
                      timestamp: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      domain: data.insights?.[0]?.type || "GENERAL",
                      title: data.insights?.[0]?.title || "Custom Content Analysis",
                      severity: data.severity || "3/5",
                      data: data
                    };

                    historyList.unshift(newRun);
                    historyList = historyList.slice(0, 10);
                    await AsyncStorage.setItem('analyses_history', JSON.stringify(historyList));
                  } catch (err) {
                    console.warn('Failed to cache analysis run in history storage', err);
                  }

                  // Instantly transition to Results tab
                  setActiveTab(1);
                } else {
                  // If there's an error, direct them to Results tab which renders detailed error retry states
                  setActiveResult(null);
                  setActiveTab(1);
                }
              }}
            />
          )}
          {activeTab === 1 && (
            <ResultsScreen apiResponse={activeResult} />
          )}
          {activeTab === 2 && (
            <HistoryScreen onSelectItem={handleSelectHistoryItem} />
          )}
          {activeTab === 3 && (
            <SettingsScreen />
          )}
        </View>

        {/* Sticky Bottom navigation menu */}
        <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MainNavigator />
      </AuthProvider>
    </LanguageProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#210f37', // Dark theme page background
  },
  responsiveWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: 800,      // Prevents extreme stretching on laptops/tablets
    alignSelf: 'center', // Centers the layout horizontally on wide screens
    backgroundColor: '#210f37',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#210f37',
  },
  viewport: {
    flex: 1,
  },
});
