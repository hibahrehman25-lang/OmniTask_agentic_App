import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLanguage } from '../../i18n/LanguageContext';

export default function AgentTraceCard({ agent, reasoning }) {
  const [expanded, setExpanded] = useState(false);
  const { isRTL, t } = useLanguage();

  return (
    <View style={styles.card}>
      <TouchableOpacity 
        style={[styles.header, isRTL && styles.rtlRow]} 
        onPress={() => setExpanded(!expanded)}
      >
        <View style={[styles.agentInfo, isRTL && styles.rtlRow]}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🤖</Text>
          </View>
          <View style={[styles.titleContainer, isRTL && styles.rtlTitle]}>
            <Text style={styles.agentName}>{agent}</Text>
            <Text style={styles.statusText}>{t('done')}</Text>
          </View>
        </View>
        <Text style={styles.toggleIcon}>{expanded ? '−' : '+'}</Text>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.content}>
          {(Array.isArray(reasoning) ? reasoning : (typeof reasoning === 'string' ? [reasoning] : [])).map((step, idx) => (
            <View key={idx} style={[styles.reasoningRow, isRTL && styles.rtlRow]}>
              <Text style={styles.stepBullet}>•</Text>
              <Text style={[styles.stepText, isRTL && styles.rtlText]}>{step}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  rtlRow: {
    flexDirection: 'row-reverse',
  },
  agentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 18,
  },
  titleContainer: {
    justifyContent: 'center',
  },
  rtlTitle: {
    marginRight: 12,
    alignItems: 'flex-end',
  },
  agentName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  statusText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  toggleIcon: {
    color: '#94A3B8',
    fontSize: 20,
  },
  content: {
    padding: 16,
    paddingTop: 0,
    backgroundColor: 'rgba(51, 65, 85, 0.3)',
  },
  reasoningRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  stepBullet: {
    color: '#3B82F6',
    marginRight: 8,
    fontSize: 16,
  },
  stepText: {
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  rtlText: {
    textAlign: 'right',
    fontFamily: 'NotoNastaliqUrdu',
  },
});
