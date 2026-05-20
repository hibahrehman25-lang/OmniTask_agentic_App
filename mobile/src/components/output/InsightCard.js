import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLanguage } from '../../i18n/LanguageContext';

export default function InsightCard({ title, description, badge, confidence }) {
  const { isRTL, t } = useLanguage();

  // Robust confidence mapping for string values
  let numericConfidence = 0.8; // default fallback
  if (typeof confidence === 'number') {
    numericConfidence = confidence;
  } else if (typeof confidence === 'string') {
    const lower = confidence.toLowerCase();
    if (lower === 'high') numericConfidence = 0.9;
    else if (lower === 'medium') numericConfidence = 0.7;
    else if (lower === 'low') numericConfidence = 0.4;
    else {
      const parsed = parseFloat(confidence);
      if (!isNaN(parsed)) numericConfidence = parsed;
    }
  }

  return (
    <View style={styles.card}>
      <View style={[styles.header, isRTL && styles.rtlRow]}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
        <Text style={styles.confidenceText}>{t('confidence')}: {Math.round(numericConfidence * 100)}%</Text>
      </View>
      <Text style={[styles.title, isRTL && styles.rtlText]}>{title}</Text>
      <Text style={[styles.description, isRTL && styles.rtlText]}>{description}</Text>
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${numericConfidence * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  rtlRow: {
    flexDirection: 'row-reverse',
  },
  badge: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    color: '#3B82F6',
    fontSize: 10,
    fontWeight: 'bold',
  },
  confidenceText: {
    color: '#94A3B8',
    fontSize: 10,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  description: {
    color: '#CBD5E1',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: '#334155',
    borderRadius: 2,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 2,
  },
  rtlText: {
    textAlign: 'right',
    fontFamily: 'NotoNastaliqUrdu',
  },
});
