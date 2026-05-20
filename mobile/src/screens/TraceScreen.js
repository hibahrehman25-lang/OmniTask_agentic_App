/**
 * Agent Trace Screen
 * Shows the complete reasoning and decision logs from each agent.
 * This screen is critical for judges to see the AI agent pipeline in action.
 */
import React, { useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../config/theme';
import { useLanguage } from '../i18n/LanguageContext';
import AgentTraceCard from '../components/output/AgentTraceCard';

export default function TraceScreen({ traces, pipelineDuration, onBack }) {
  const { t, isRTL } = useLanguage();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  const totalDuration = (traces || []).reduce((sum, t) => sum + (t.duration_ms || t.duration_hint || 0), 0);

  return (
    <LinearGradient colors={[COLORS.gradientStart, COLORS.gradientEnd]} style={styles.container}>
      <Animated.View style={[styles.main, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={[styles.header, isRTL && styles.rtlRow]}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Ionicons name={isRTL ? "arrow-forward" : "arrow-back"} size={20} color="#FFF" />
          </TouchableOpacity>
          <View style={[styles.headerInfo, isRTL && styles.rtlInfo]}>
            <Text style={styles.headerTitle}>{t('traceHeader')}</Text>
            <Text style={styles.headerMeta}>{t('traceSubtitle')}</Text>
          </View>
          <View style={[styles.durationBadge, isRTL && styles.rtlRow]}>
            <Ionicons name="timer-outline" size={14} color="#3B82F6" />
            <Text style={styles.durationText}>{pipelineDuration || totalDuration}ms</Text>
          </View>
        </View>
 
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Pipeline Summary Card */}
          <View style={styles.summaryCard}>
            <LinearGradient colors={['rgba(59, 130, 246, 0.15)', 'rgba(16, 185, 129, 0.1)']} style={styles.summaryGradient}>
              <View style={[styles.summaryRow, isRTL && styles.rtlRow]}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>{(traces || []).length}</Text>
                  <Text style={styles.summaryLabel}>{t('agentsRun')}</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>{totalDuration}ms</Text>
                  <Text style={styles.summaryLabel}>{t('totalTime')}</Text>
                </View>
              </View>
            </LinearGradient>
          </View>
 
          {/* Agent Trace Cards */}
          <Text style={[styles.sectionLabel, isRTL && styles.rtlText]}>{t('reasoningLog')}</Text>
          {(traces || []).map((trace, index) => (
            <AgentTraceCard 
              key={index}
              agent={trace.agent || trace.agent_name}
              reasoning={trace.reasoning || trace.reasoning_steps}
            />
          ))}

          {/* Tech Stack Badge */}
          <View style={styles.techCard}>
            <Text style={styles.techTitle}>{t('poweredBy')}</Text>
            <View style={[styles.techRow, isRTL && styles.rtlRow]}>
              {['Google Gemini', 'Antigravity', 'React Native', 'Flask'].map((tech) => (
                <View key={tech} style={styles.techBadge}>
                  <Text style={styles.techText}>{tech}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  main: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 15, gap: 15 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#1E293B', alignItems: 'center', justifyContent: 'center' },
  headerInfo: { flex: 1 },
  rtlInfo: { alignItems: 'flex-end' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#FFF' },
  headerMeta: { fontSize: 10, color: '#64748B' },
  durationBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#1E293B', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  durationText: { fontSize: 11, color: '#3B82F6', fontWeight: '700' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  summaryCard: { marginBottom: 25 },
  summaryGradient: { borderRadius: 12, padding: 20 },
  summaryRow: { flexDirection: 'row', alignItems: 'center' },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryValue: { fontSize: 20, fontWeight: '800', color: '#FFF' },
  summaryLabel: { fontSize: 10, color: '#94A3B8', marginTop: 4 },
  summaryDivider: { width: 1, height: 30, backgroundColor: '#334155' },
  sectionLabel: { fontSize: 16, fontWeight: 'bold', color: '#FFF', marginBottom: 15 },
  techCard: { alignItems: 'center', marginTop: 30, paddingVertical: 20 },
  techTitle: { fontSize: 10, color: '#64748B', marginBottom: 10, textTransform: 'uppercase', fontWeight: '700' },
  techRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
  techBadge: { backgroundColor: '#1E293B', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#334155' },
  techText: { fontSize: 11, color: '#94A3B8' },
  rtlRow: { flexDirection: 'row-reverse' },
  rtlText: { textAlign: 'right', fontFamily: 'NotoNastaliqUrdu' },
});
