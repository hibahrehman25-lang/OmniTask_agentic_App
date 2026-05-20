import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../config/theme';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../auth/AuthContext';
import OmniTaskLogo from '../components/OmniTaskLogo';
import GlassCard from '../components/GlassCard';
import ParticleBackground from '../components/ParticleBackground';

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, TextInput, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../config/theme';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../auth/AuthContext';
import OmniTaskLogo from '../components/OmniTaskLogo';
import GlassCard from '../components/GlassCard';
import ParticleBackground from '../components/ParticleBackground';

export default function LoginScreen() {
  const { t, isRTL, rtlText } = useLanguage();
  const { signIn, signInWithEmail, signUpWithEmail, isLoading: authLoading } = useAuth();
  
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    let result;
    if (isLoginMode) {
      result = await signInWithEmail(email, password);
    } else {
      result = await signUpWithEmail(email, password);
    }
    
    setIsSubmitting(false);

    if (!result.success) {
      Alert.alert('Authentication Failed', result.error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F4FF" />
      
      {/* 3-Color Fluid Gradient background specified in color system */}
      <LinearGradient
        colors={COLORS.heroGradient}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Interactive Particle Floating web layer */}
      <ParticleBackground />

      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.content}>
          
          {/* Hexagonal Svg Badge Logo */}
          <View style={styles.logoContainer}>
            <OmniTaskLogo size={64} />
          </View>

          {/* App Header Titles */}
          <Text style={[styles.title, isRTL && styles.rtlTitle]}>{t('appName')}</Text>
          <Text style={[styles.tagline, isRTL && styles.rtlTagline]}>{t('tagline')}</Text>
          <Text style={[styles.urTagline, isRTL && styles.rtlUrTagline]}>{t('urTagline')}</Text>

          {/* Glassmorphism auth card */}
          <GlassCard style={styles.authCard}>
            
            <View style={styles.toggleContainer}>
              <TouchableOpacity 
                style={[styles.toggleBtn, isLoginMode && styles.toggleBtnActive]}
                onPress={() => setIsLoginMode(true)}
              >
                <Text style={[styles.toggleBtnText, isLoginMode && styles.toggleBtnTextActive]}>Sign In</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.toggleBtn, !isLoginMode && styles.toggleBtnActive]}
                onPress={() => setIsLoginMode(false)}
              >
                <Text style={[styles.toggleBtnText, !isLoginMode && styles.toggleBtnTextActive]}>Sign Up</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={COLORS.textMuted}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <TouchableOpacity style={styles.primaryBtn} onPress={handleEmailAuth} activeOpacity={0.8} disabled={isSubmitting}>
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryBtnText}>{isLoginMode ? 'Sign In' : 'Create Account'}</Text>
              )}
            </TouchableOpacity>

            <View style={styles.orContainer}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.orLine} />
            </View>
            
            {/* Google OAuth Login Action button */}
            <TouchableOpacity style={styles.googleBtn} onPress={signIn} activeOpacity={0.9} disabled={isSubmitting}>
              <View style={styles.googleBtnContent}>
                {/* Embedded High-Fidelity Google Logo SVG */}
                <Svg width={20} height={20} viewBox="0 0 24 24" style={styles.googleIcon}>
                  <Path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <Path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <Path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                  <Path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                </Svg>
                <Text style={styles.googleBtnText}>{t('googleBtn')}</Text>
              </View>
            </TouchableOpacity>

            <Text style={[styles.secNote, rtlText]}>{t('secNote')}</Text>
          </GlassCard>

          {/* Landing Statistics Counter */}
          <View style={[styles.statsRow, isRTL && styles.rtlRow]}>
            <View style={styles.statCol}>
              <Text style={styles.statVal}>{t('statsAnalyzed').split(' ')[0]}</Text>
              <Text style={styles.statLabel}>{t('statsAnalyzed').split(' ')[1]}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statCol}>
              <Text style={styles.statVal}>{t('statsAgents').split(' ')[0]}</Text>
              <Text style={styles.statLabel}>{t('statsAgents').split(' ')[1]}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statCol}>
              <View style={styles.liveDotContainer}>
                <View style={styles.liveDot} />
                <Text style={styles.statVal}>{t('statsLive')}</Text>
              </View>
              <Text style={styles.statLabel}>Sync</Text>
            </View>
          </View>

        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeContainer: {
    flex: 1,
    zIndex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  logoContainer: {
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 28,
    fontWeight: '500',
    color: COLORS.textPrimary,
    fontFamily: 'Inter',
    marginBottom: SPACING.xs,
  },
  rtlTitle: {
    fontFamily: 'NotoNastaliqUrdu',
    textAlign: 'center',
  },
  tagline: {
    fontSize: FONT_SIZES.md,
    color: COLORS.primary,
    fontFamily: 'Inter',
    textAlign: 'center',
    marginBottom: 4,
  },
  rtlTagline: {
    fontFamily: 'NotoNastaliqUrdu',
  },
  urTagline: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontFamily: 'NotoNastaliqUrdu',
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  rtlUrTagline: {
    fontFamily: 'Inter',
    fontSize: FONT_SIZES.xs,
  },
  authCard: {
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: BORDER_RADIUS.md,
    padding: 4,
    marginBottom: SPACING.lg,
    width: '100%',
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.sm,
  },
  toggleBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  toggleBtnText: {
    fontFamily: 'Inter',
    fontWeight: '600',
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  toggleBtnTextActive: {
    color: COLORS.primary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.1)',
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.md,
    height: 48,
    width: '100%',
  },
  inputIcon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter',
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    width: '100%',
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 15,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: SPACING.sm,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  orText: {
    marginHorizontal: SPACING.sm,
    fontFamily: 'Inter',
    fontSize: 11,
    color: COLORS.textMuted,
  },
  googleBtn: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: SPACING.md,
    marginTop: SPACING.sm,
  },
  googleBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {
    marginRight: SPACING.sm,
  },
  googleBtnText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E1B4B',
    fontFamily: 'Inter',
  },
  secNote: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontFamily: 'Inter',
    textAlign: 'center',
    width: '100%',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    borderWidth: 0.5,
    borderColor: 'rgba(99, 102, 241, 0.12)',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: 20,
    width: '100%',
    maxWidth: 340,
  },
  rtlRow: {
    flexDirection: 'row-reverse',
  },
  statCol: {
    alignItems: 'center',
    flex: 1,
  },
  statVal: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primaryDark,
    fontFamily: 'Inter',
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
    fontFamily: 'Inter',
    textTransform: 'uppercase',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    marginHorizontal: SPACING.sm,
  },
  liveDotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.success,
    marginRight: 4,
  },
});
