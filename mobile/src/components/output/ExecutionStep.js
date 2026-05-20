import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLanguage } from '../../i18n/LanguageContext';

export default function ExecutionStep({ time, desc, status, isLast }) {
  const { isRTL, t } = useLanguage();

  return (
    <View style={[styles.container, isRTL && styles.rtlRow]}>
      <View style={styles.leftColumn}>
        <View style={[styles.dot, { backgroundColor: status === 'done' ? '#10B981' : '#F59E0B' }]} />
        {!isLast && <View style={styles.line} />}
      </View>
      <View style={[styles.content, isRTL && styles.rtlContent]}>
        <Text style={styles.time}>{time}</Text>
        <Text style={[styles.desc, isRTL && styles.rtlText]}>{desc}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  rtlRow: {
    flexDirection: 'row-reverse',
  },
  leftColumn: {
    alignItems: 'center',
    width: 20,
    marginRight: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    zIndex: 1,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: '#334155',
    marginVertical: 4,
  },
  content: {
    flex: 1,
    paddingBottom: 20,
  },
  rtlContent: {
    paddingLeft: 10,
    paddingRight: 0,
  },
  time: {
    color: '#94A3B8',
    fontSize: 10,
    marginBottom: 4,
  },
  desc: {
    color: '#E2E8F0',
    fontSize: 13,
    lineHeight: 18,
  },
  rtlText: {
    textAlign: 'right',
    fontFamily: 'NotoNastaliqUrdu',
  },
});
