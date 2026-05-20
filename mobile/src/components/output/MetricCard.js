import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLanguage } from '../../i18n/LanguageContext';

export default function MetricCard({ label, value, unit, trend }) {
  const { isRTL } = useLanguage();
  const isPositive = trend === 'up';

  return (
    <View style={styles.card}>
      <Text style={[styles.label, isRTL && styles.rtlText]}>{label}</Text>
      <View style={[styles.valueRow, isRTL && styles.rtlRow]}>
        <Text style={styles.value}>{value}{unit}</Text>
        {trend && (
          <Text style={[styles.trend, { color: isPositive ? '#10B981' : '#EF4444' }]}>
            {isPositive ? '↑' : '↓'}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E293B',
    padding: 15,
    borderRadius: 12,
    flex: 1,
    margin: 5,
  },
  label: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 5,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  rtlRow: {
    flexDirection: 'row-reverse',
  },
  value: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  trend: {
    fontSize: 16,
    marginLeft: 5,
  },
  rtlText: {
    textAlign: 'right',
    fontFamily: 'NotoNastaliqUrdu',
  },
});
