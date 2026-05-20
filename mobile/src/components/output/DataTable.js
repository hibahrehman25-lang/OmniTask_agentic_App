import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLanguage } from '../../i18n/LanguageContext';

export default function DataTable({ headers, data }) {
  const { isRTL } = useLanguage();

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          <View style={[styles.headerRow, isRTL && styles.rtlRow]}>
            {headers.map((header, idx) => (
              <View key={idx} style={[styles.headerCell, { width: header.width || 100 }]}>
                <Text style={styles.headerText}>{header.label}</Text>
              </View>
            ))}
          </View>
          {data.map((row, rowIdx) => (
            <View key={rowIdx} style={[styles.dataRow, rowIdx % 2 === 1 && styles.alternateRow, isRTL && styles.rtlRow]}>
              {headers.map((header, colIdx) => (
                <View key={colIdx} style={[styles.dataCell, { width: header.width || 100 }]}>
                  <Text style={[styles.dataText, header.color && { color: header.color }]}>
                    {row[header.key]}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 10,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#334155',
    paddingVertical: 10,
  },
  rtlRow: {
    flexDirection: 'row-reverse',
  },
  headerCell: {
    paddingHorizontal: 12,
  },
  headerText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  dataRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  alternateRow: {
    backgroundColor: 'rgba(51, 65, 85, 0.3)',
  },
  dataCell: {
    paddingHorizontal: 12,
  },
  dataText: {
    color: '#E2E8F0',
    fontSize: 13,
  },
});
