import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLanguage } from '../../i18n/LanguageContext';

export default function BeforeAfterCard({ label, before, after, unit }) {
  const { isRTL, t } = useLanguage();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, isRTL && styles.rtlText]}>{label}</Text>
      <View style={[styles.row, isRTL && styles.rtlRow]}>
        <View style={[styles.box, styles.beforeBox]}>
          <Text style={styles.boxLabel}>{t('before')}</Text>
          <Text style={styles.boxValue}>{before}{unit}</Text>
        </View>
        <View style={styles.arrowContainer}>
          <Text style={styles.arrow}>→</Text>
        </View>
        <View style={[styles.box, styles.afterBox]}>
          <Text style={styles.boxLabel}>{t('after')}</Text>
          <Text style={styles.boxValue}>{after}{unit}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    color: '#94A3B8',
    fontSize: 14,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rtlRow: {
    flexDirection: 'row-reverse',
  },
  box: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  beforeBox: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  afterBox: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  boxLabel: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  boxValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  arrowContainer: {
    paddingHorizontal: 15,
  },
  arrow: {
    color: '#64748B',
    fontSize: 20,
  },
  rtlText: {
    textAlign: 'right',
    fontFamily: 'NotoNastaliqUrdu',
  },
});
