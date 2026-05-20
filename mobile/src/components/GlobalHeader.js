import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../config/theme';
import { useLanguage } from '../i18n/LanguageContext';
import OmniTaskLogo from './OmniTaskLogo';

export default function GlobalHeader() {
  const { currentLang, toggleLanguage, t, isRTL, rtlRow } = useLanguage();

  return (
    <View style={[styles.header, rtlRow]}>
      {/* Brand logo & name */}
      <View style={[styles.brandRow, isRTL && styles.rtlBrand]}>
        <OmniTaskLogo size={22} />
        <Text style={styles.brandText}>{t('appName')}</Text>
      </View>

      {/* Control pill */}
      <View style={[styles.controlRow, isRTL && styles.rtlControl]}>
        {/* Connection status badge */}
        <View style={styles.statusBadge}>
          <View style={styles.greenDot} />
          <Text style={styles.statusText}>Online</Text>
        </View>

        <TouchableOpacity 
          style={styles.langPill} 
          onPress={toggleLanguage}
          activeOpacity={0.8}
        >
          <Text style={styles.langText}>
            {currentLang === 'en' ? 'EN | اردو' : 'اردو | EN'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 52,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    backgroundColor: 'rgba(33, 15, 55, 0.92)',
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.cardBorderLight,
    zIndex: 10,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  rtlBrand: {
    flexDirection: 'row-reverse',
  },
  brandText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.secondary,
    fontFamily: 'Inter',
    letterSpacing: -0.3,
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  rtlControl: {
    flexDirection: 'row-reverse',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.successBg,
    borderWidth: 0.5,
    borderColor: 'rgba(52, 211, 153, 0.25)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: BORDER_RADIUS.round,
    gap: 4,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.success,
  },
  statusText: {
    fontSize: 10,
    color: COLORS.success,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  langPill: {
    backgroundColor: COLORS.overlayMedium,
    borderWidth: 0.5,
    borderColor: COLORS.cardBorder,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: BORDER_RADIUS.round,
  },
  langText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.secondary,
    fontFamily: 'Inter',
  },
});
