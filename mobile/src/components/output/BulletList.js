import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLanguage } from '../../i18n/LanguageContext';

export default function BulletList({ items, color = '#3B82F6' }) {
  const { isRTL } = useLanguage();

  return (
    <View style={styles.container}>
      {items.map((item, idx) => (
        <View key={idx} style={[styles.row, isRTL && styles.rtlRow]}>
          <View style={[styles.bullet, { backgroundColor: color }]} />
          <Text style={[styles.text, isRTL && styles.rtlText]}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rtlRow: {
    flexDirection: 'row-reverse',
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 10,
    marginLeft: 10, // Added to handle both RTL and LTR bullet spacing
  },
  text: {
    color: '#CBD5E1',
    fontSize: 14,
    flex: 1,
  },
  rtlText: {
    textAlign: 'right',
    fontFamily: 'NotoNastaliqUrdu',
  },
});
