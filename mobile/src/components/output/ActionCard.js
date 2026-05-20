import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLanguage } from '../../i18n/LanguageContext';

export default function ActionCard({ action, isPrimary }) {
  const { isRTL, t } = useLanguage();

  return (
    <View style={[styles.card, isPrimary && styles.primaryCard]}>
      {isPrimary && (
        <View style={styles.primaryBadge}>
          <Text style={styles.primaryBadgeText}>{t('primaryAction')}</Text>
        </View>
      )}
      <View style={[styles.row, isRTL && styles.rtlRow]}>
        <View style={styles.rankCircle}>
          <Text style={styles.rankText}>{action.rank}</Text>
        </View>
        <Text style={[styles.title, isRTL && styles.rtlText]}>{action.title}</Text>
      </View>
      
      <View style={styles.details}>
        <View style={[styles.detailRow, isRTL && styles.rtlRow]}>
          <Text style={styles.detailLabel}>{t('owner')}: </Text>
          <Text style={styles.detailValue}>{action.owner}</Text>
        </View>
        <View style={[styles.detailRow, isRTL && styles.rtlRow]}>
          <Text style={styles.detailLabel}>{t('timeline')}: </Text>
          <Text style={styles.detailValue}>{action.timeline}</Text>
        </View>
      </View>

      <View style={[styles.chipContainer, isRTL && styles.rtlRow]}>
        {action.tools?.map((tool, idx) => (
          <View key={idx} style={styles.chip}>
            <Text style={styles.chipText}>{tool}</Text>
          </View>
        ))}
      </View>

      <View style={styles.outcomeContainer}>
        <Text style={[styles.outcomeHeader, isRTL && styles.rtlText]}>{t('expected')}</Text>
        <Text style={[styles.outcomeText, isRTL && styles.rtlText]}>{action.expected_outcome}</Text>
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
  },
  primaryCard: {
    borderColor: '#10B981',
    borderWidth: 1,
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
  },
  primaryBadge: {
    position: 'absolute',
    top: -10,
    right: 16,
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  primaryBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rtlRow: {
    flexDirection: 'row-reverse',
  },
  rankCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  rankText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  details: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  detailLabel: {
    color: '#94A3B8',
    fontSize: 12,
  },
  detailValue: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  chip: {
    backgroundColor: '#334155',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 6,
    marginBottom: 6,
  },
  chipText: {
    color: '#CBD5E1',
    fontSize: 10,
  },
  outcomeContainer: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    padding: 10,
    borderRadius: 8,
  },
  outcomeHeader: {
    color: '#3B82F6',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  outcomeText: {
    color: '#CBD5E1',
    fontSize: 12,
    lineHeight: 18,
  },
  rtlText: {
    textAlign: 'right',
    fontFamily: 'NotoNastaliqUrdu',
  },
});
