import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../config/theme';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../auth/AuthContext';
import GlobalHeader from '../components/GlobalHeader';
import GlassCard from '../components/GlassCard';
import OmniTaskLogo from '../components/OmniTaskLogo';

export default function SettingsScreen() {
  const { t, isRTL, rtlRow, rtlText, toggleLanguage, currentLang } = useLanguage();
  const { user, signOut } = useAuth();
  
  const defaultUrl = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://127.0.0.1:5000';
  const [backendUrl, setBackendUrl] = useState(defaultUrl);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
  const [healthStatus, setHealthStatus] = useState('unknown'); // 'connected' | 'disconnected' | 'unknown'
  const [starRating, setStarRating] = useState(5);

  useEffect(() => {
    const loadBackendUrl = async () => {
      try {
        const stored = await AsyncStorage.getItem('backendUrl');
        if (stored) {
          setBackendUrl(stored);
          checkHealth(stored);
        } else {
          checkHealth(backendUrl);
        }
      } catch (err) {
        console.warn('Failed to load backend URL from storage', err);
      }
    };
    loadBackendUrl();
  }, []);

  const checkHealth = async (url) => {
    setIsCheckingHealth(true);
    try {
      const cleanUrl = url.trim().replace(/\/$/, "");
      const res = await fetch(`${cleanUrl}/api/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(5000), 
      });
      if (res.ok) {
        setHealthStatus('connected');
      } else {
        setHealthStatus('disconnected');
      }
    } catch (err) {
      setHealthStatus('disconnected');
    } finally {
      setIsCheckingHealth(false);
    }
  };

  const handleSaveUrl = async () => {
    const cleanUrl = backendUrl.trim().replace(/\/$/, "");
    try {
      await AsyncStorage.setItem('backendUrl', cleanUrl);
      await checkHealth(cleanUrl);
      Alert.alert(t('configSaved'), `${t('configSavedDesc')}${cleanUrl}`);
    } catch (err) {
      Alert.alert(t('saveFailed'), t('saveFailedDesc'));
    }
  };

  const handleClearHistory = async () => {
    Alert.alert(
      t('clearHistoryTitle') || "Clear History",
      t('clearHistoryDesc') || "Are you sure you want to permanently delete all analyzed runs from history?",
      [
        { text: t('cancel') || "Cancel", style: "cancel" },
        { 
          text: t('delete') || "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('analyses_history');
              Alert.alert(t('deleted') || "Success", t('historyCleared') || "All analyzed runs have been cleared.");
            } catch (err) {
              Alert.alert("Error", "Failed to clear history.");
            }
          }
        }
      ]
    );
  };

  const handleRateApp = () => {
    Alert.alert(
      "Thank you!",
      "You rated the OmniTask Autonomous Agent 50 out of 50 stars! Your support inspires our engineering team."
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeContainer}>
        {/* Sticky GlobalHeader */}
        <GlobalHeader />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.headerBlock}>
            <Text style={[styles.title, rtlText]}>{t('settings')}</Text>
          </View>

          {/* SECTION 1: User Profile Card */}
          {user && (
            <GlassCard style={styles.cardMargin}>
              <View style={[styles.profileRow, rtlRow]}>
                <Image source={{ uri: user.photo }} style={styles.avatar} />
                <View style={styles.profileDetails}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userEmail}>{user.email}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.logoutBtn} onPress={signOut} activeOpacity={0.85}>
                <Ionicons name="log-out-outline" size={16} color={COLORS.danger} />
                <Text style={styles.logoutText}>{t('logout')}</Text>
              </TouchableOpacity>
            </GlassCard>
          )}

          {/* SECTION 2: Language & General Options */}
          <GlassCard style={styles.cardMargin}>
            <Text style={[styles.sectionHeading, rtlText]}>{t('language')}</Text>
            <View style={[styles.langToggleRow, rtlRow]}>
              <Text style={styles.langLabel}>
                {t('currentLanguage')}{currentLang === 'en' ? 'English' : 'Urdu (اردو)'}
              </Text>
              <TouchableOpacity style={styles.toggleBtn} onPress={toggleLanguage} activeOpacity={0.8}>
                <Text style={styles.toggleBtnText}>
                  {currentLang === 'en' ? 'اردو' : 'EN'}
                </Text>
              </TouchableOpacity>
            </View>
          </GlassCard>

          {/* SECTION 3: Backend URL configuration */}
          <GlassCard style={styles.cardMargin}>
            <Text style={[styles.sectionHeading, rtlText]}>{t('backendUrl')}</Text>
            
            <TextInput
              style={styles.urlInput}
              value={backendUrl}
              onChangeText={setBackendUrl}
              placeholder="http://192.168.1.X:5000"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              placeholderTextColor="rgba(255,255,255,0.3)"
            />

            <View style={[styles.healthRow, rtlRow]}>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveUrl} activeOpacity={0.85}>
                {isCheckingHealth ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.saveBtnText}>{t('saveAndCheck')}</Text>
                )}
              </TouchableOpacity>

              <View style={styles.healthStatusBadge}>
                <View style={[
                  styles.healthDot,
                  healthStatus === 'connected' ? styles.dotGreen :
                  healthStatus === 'disconnected' ? styles.dotRed : styles.dotGray
                ]} />
                <Text style={[
                  styles.healthStatusText,
                  healthStatus === 'connected' ? styles.textGreen :
                  healthStatus === 'disconnected' ? styles.textRed : styles.textGray
                ]}>
                  {healthStatus === 'connected' ? t('connected') :
                   healthStatus === 'disconnected' ? t('disconnected') : t('unknownStatus')}
                </Text>
              </View>
            </View>
          </GlassCard>

          {/* SECTION 4: Maintenance Actions */}
          <GlassCard style={styles.cardMargin}>
            <Text style={[styles.sectionHeading, rtlText]}>System Controls</Text>
            
            <TouchableOpacity style={[styles.actionRowBtn, rtlRow]} onPress={handleClearHistory} activeOpacity={0.8}>
              <View style={[styles.actionRowLeft, rtlRow]}>
                <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
                <Text style={styles.actionRowText}>Clear Analyzed Runs History</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
            </TouchableOpacity>

            <View style={styles.gridDivider} />

            <TouchableOpacity style={[styles.actionRowBtn, rtlRow]} onPress={handleRateApp} activeOpacity={0.8}>
              <View style={[styles.actionRowLeft, rtlRow]}>
                <Ionicons name="star" size={18} color="#FBBF24" />
                <Text style={styles.actionRowText}>Rate Antigravity Agent Pipeline</Text>
              </View>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingBadgeText}>50 / 50</Text>
              </View>
            </TouchableOpacity>
          </GlassCard>

          {/* SECTION 5: About Information */}
          <GlassCard style={styles.cardMargin}>
            <Text style={[styles.sectionHeading, rtlText]}>{t('about')}</Text>
            <View style={styles.aboutContent}>
              <View style={styles.aboutLogoRow}>
                <OmniTaskLogo size={32} />
                <View>
                  <Text style={styles.aboutName}>{t('appName')}</Text>
                  <Text style={styles.aboutTagline}>{t('tagline')}</Text>
                </View>
              </View>

              <View style={styles.aboutGrid}>
                <View style={[styles.aboutGridRow, rtlRow]}>
                  <Text style={styles.aboutLabel}>{t('appVersion')}</Text>
                  <Text style={styles.aboutValue}>v2.0.0 (Production Build)</Text>
                </View>
                <View style={{ height: 0.5, backgroundColor: COLORS.cardBorder }} />
                <View style={[styles.aboutGridRow, rtlRow]}>
                  <Text style={styles.aboutLabel}>{t('activeAgents')}</Text>
                  <Text style={styles.aboutValue}>{t('activeAgentsValue')}</Text>
                </View>
                <View style={{ height: 0.5, backgroundColor: COLORS.cardBorder }} />
                <View style={[styles.aboutGridRow, rtlRow]}>
                  <Text style={styles.aboutLabel}>Architecture</Text>
                  <Text style={styles.aboutValue}>Multi-Agent Orchestrated System</Text>
                </View>
              </View>
            </View>
          </GlassCard>

          {/* Spacer to prevent navbar overlapping */}
          <View style={{ height: 100 }} />

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#210f37', // Fully dark theme background
  },
  safeContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xl,
  },
  headerBlock: {
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF', // High-contrast White Title
    fontFamily: 'Inter',
  },
  cardMargin: {
    marginBottom: SPACING.md,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  profileDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF', // White text
    fontFamily: 'Inter',
  },
  userEmail: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontFamily: 'Inter',
    marginTop: 2,
  },
  logoutBtn: {
    height: 38,
    borderWidth: 1,
    borderColor: COLORS.danger,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(251, 113, 133, 0.05)',
  },
  logoutText: {
    color: COLORS.danger,
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.secondary, // Accent color for sections
    marginBottom: SPACING.md,
    fontFamily: 'Inter',
    textTransform: 'uppercase',
  },
  langToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  langLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontFamily: 'Inter',
  },
  toggleBtn: {
    backgroundColor: 'rgba(165, 91, 75, 0.25)',
    borderWidth: 0.5,
    borderColor: COLORS.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: BORDER_RADIUS.sm,
  },
  toggleBtnText: {
    color: COLORS.secondary,
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'Inter',
  },
  urlInput: {
    height: 42,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderWidth: 0.5,
    borderColor: COLORS.cardBorder,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#FFFFFF', // White input text
    fontFamily: 'Inter',
    marginBottom: SPACING.md,
  },
  healthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 110,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  healthStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  healthDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotGreen: {
    backgroundColor: COLORS.success,
  },
  dotRed: {
    backgroundColor: COLORS.danger,
  },
  dotGray: {
    backgroundColor: COLORS.textMuted,
  },
  healthStatusText: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Inter',
  },
  textGreen: {
    color: COLORS.success,
  },
  textRed: {
    color: COLORS.danger,
  },
  textGray: {
    color: COLORS.textMuted,
  },
  aboutContent: {
    gap: SPACING.md,
  },
  aboutLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  aboutName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF', // White text
    fontFamily: 'Inter',
  },
  aboutTagline: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontFamily: 'Inter',
    marginTop: 2,
  },
  aboutGrid: {
    borderWidth: 0.5,
    borderColor: COLORS.cardBorder,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    overflow: 'hidden',
  },
  aboutGridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  aboutLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontFamily: 'Inter',
  },
  aboutValue: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF', // White text
    fontFamily: 'Inter',
  },
  actionRowBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  actionRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionRowText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontFamily: 'Inter',
    fontWeight: '500',
  },
  gridDivider: {
    height: 0.5,
    backgroundColor: COLORS.cardBorderLight,
    marginVertical: 4,
  },
  ratingBadge: {
    backgroundColor: 'rgba(249, 191, 36, 0.15)',
    borderWidth: 0.5,
    borderColor: '#FBBF24',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  ratingBadgeText: {
    color: '#FBBF24',
    fontSize: 9,
    fontWeight: '700',
    fontFamily: 'Inter',
  },
});
