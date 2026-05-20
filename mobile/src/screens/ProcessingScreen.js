import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../config/theme';
import { useLanguage } from '../i18n/LanguageContext';
import ParticleBackground from '../components/ParticleBackground';

// Multi-agent definition as specified in Part 7
const AGENTS = [
  { key: '0', defaultName: "Content Parser", defaultDesc: "Extracting facts, entities and numbers", dur: "1.8s" },
  { key: '1', defaultName: "Insight Extractor", defaultDesc: "Identifying non-obvious patterns", dur: "1.4s" },
  { key: '2', defaultName: "Impact Analyzer", defaultDesc: "Quantifying risks and stakeholders", dur: "1.6s" },
  { key: '3', defaultName: "Action Generator", defaultDesc: "Recommending prioritized actions", dur: "1.2s" },
  { key: '4', defaultName: "Action Simulator", defaultDesc: "Executing in mock systems", dur: "2.0s" },
  { key: '5', defaultName: "Outcome Visualizer", defaultDesc: "Generating final report", dur: "1.0s" },
];

export default function ProcessingScreen({ inputContext, apiPromise, onCancel, onAnalysisComplete }) {
  const { t, isRTL, rtlRow, rtlText } = useLanguage();
  const [activeStep, setActiveStep] = useState(0); // 0 to 6
  const [stepStates, setStepStates] = useState(['WAITING', 'WAITING', 'WAITING', 'WAITING', 'WAITING', 'WAITING']);
  const [isWaitingForApi, setIsWaitingForApi] = useState(false);
  
  // Animated values for active pulsing dot
  const pulseAnim = useRef(new Animated.Value(0.8)).current;
  // Progress bar animated width
  const progressAnim = useRef(new Animated.Value(0)).current;
  // Dots animation for title
  const dotsAnim = useRef(new Animated.Value(0)).current;

  const timelineCompleteRef = useRef(false);
  const apiResponseRef = useRef(null);
  const apiErrorRef = useRef(null);

  // Active step pulsing animation
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.8,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [activeStep]);

  // Title dots loading animation
  useEffect(() => {
    const dots = Animated.loop(
      Animated.timing(dotsAnim, {
        toValue: 3,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    );
    dots.start();
    return () => dots.stop();
  }, []);

  // Parallel API listener & animation sequence timer
  useEffect(() => {
    // 1. Listen for backend API completion
    apiPromise
      .then((data) => {
        apiResponseRef.current = data;
        checkTransition();
      })
      .catch((err) => {
        apiErrorRef.current = err;
        // Immediate transition to let Results handle error display
        onAnalysisComplete(null, err);
      });

    // 2. Sequential timing milestones
    const updateStep = (step, nextState) => {
      setStepStates((prev) => {
        const next = [...prev];
        if (step > 0) next[step - 1] = 'COMPLETE';
        if (step < 6) next[step] = nextState;
        return next;
      });
      setActiveStep(step);

      // Smoothly animate progress bar
      Animated.timing(progressAnim, {
        toValue: step / 6,
        duration: 400,
        useNativeDriver: false,
      }).start();
    };

    // Agent 0 active (0ms)
    updateStep(0, 'PROCESSING');

    // Agent 1 active (1800ms)
    const t1 = setTimeout(() => updateStep(1, 'PROCESSING'), 1800);
    // Agent 2 active (3200ms)
    const t2 = setTimeout(() => updateStep(2, 'PROCESSING'), 3200);
    // Agent 3 active (4800ms)
    const t3 = setTimeout(() => updateStep(3, 'PROCESSING'), 4800);
    // Agent 4 active (6000ms)
    const t4 = setTimeout(() => updateStep(4, 'PROCESSING'), 6000);
    // Agent 5 active (8000ms)
    const t5 = setTimeout(() => updateStep(5, 'PROCESSING'), 8000);

    // All animation parts finished (9000ms)
    const t6 = setTimeout(() => {
      setStepStates(['COMPLETE', 'COMPLETE', 'COMPLETE', 'COMPLETE', 'COMPLETE', 'COMPLETE']);
      setActiveStep(6);
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: false,
      }).start();
      timelineCompleteRef.current = true;
      if (!apiResponseRef.current && !apiErrorRef.current) {
        setIsWaitingForApi(true);
      }
      checkTransition();
    }, 9000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
    };
  }, [apiPromise]);

  const checkTransition = () => {
    if (timelineCompleteRef.current && apiResponseRef.current) {
      onAnalysisComplete(apiResponseRef.current, null);
    }
  };

  const getDotsText = () => {
    const val = Math.floor(dotsAnim._value || 0);
    if (val === 0) return '';
    if (val === 1) return '.';
    if (val === 2) return '..';
    return '...';
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={COLORS.heroGradient}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <ParticleBackground />

      <SafeAreaView style={styles.safeContainer}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Header block */}
          <View style={styles.headerBlock}>
            <Text style={[styles.title, rtlText]}>{t('processingTitle')}</Text>
            <Text style={[styles.subtitle, rtlText]}>{t('processingSub')}</Text>
          </View>

          {/* Progress Bar Component */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressHeader, rtlRow]}>
              <Text style={styles.progressLabel}>{t('pipelineProgress')}</Text>
              <Text style={styles.progressCount}>
                {Math.min(activeStep, 6)} / 6 {t('complete')}
              </Text>
            </View>
            <View style={styles.progressBarBg}>
              <Animated.View style={[styles.progressBarFill, {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                })
              }]}>
                <LinearGradient
                  colors={['#6366F1', '#06B6D4']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={StyleSheet.absoluteFillObject}
                />
              </Animated.View>
            </View>
          </View>

          {/* 6 Agent Timeline Cards List */}
          <View style={styles.agentList}>
            {AGENTS.map((item, index) => {
              const state = stepStates[index];
              const name = t('agentNames')?.[index] || item.defaultName;
              const desc = t('agentDescs')?.[index] || item.defaultDesc;

              let cardStyle = styles.cardWaiting;
              let borderStyle = styles.borderWaiting;
              let numBg = styles.numBgWaiting;
              let numText = styles.numTextWaiting;
              let nameStyle = styles.nameWaiting;
              let descStyle = styles.descWaiting;

              if (state === 'PROCESSING') {
                cardStyle = styles.cardActive;
                borderStyle = styles.borderActive;
                numBg = styles.numBgActive;
                numText = styles.numTextActive;
                nameStyle = styles.nameActive;
                descStyle = styles.descActive;
              } else if (state === 'COMPLETE') {
                cardStyle = styles.cardDone;
                borderStyle = styles.borderDone;
                numBg = styles.numBgDone;
                numText = styles.numTextDone;
                nameStyle = styles.nameDone;
                descStyle = styles.descDone;
              }

              return (
                <View key={item.key} style={[styles.agentCard, cardStyle, borderStyle, rtlRow]}>
                  {/* Flat Left State Color line (done within style border-l-[2.5px]) */}
                  
                  {/* Step index badge circle */}
                  <View style={[styles.numCircle, numBg]}>
                    {state === 'COMPLETE' ? (
                      <Ionicons name="checkmark" size={12} color="#065F46" />
                    ) : (
                      <Text style={[styles.numText, numText]}>{index + 1}</Text>
                    )}
                  </View>

                  {/* Descriptions block */}
                  <View style={styles.detailsBlock}>
                    <Text style={[styles.agentName, nameStyle, isRTL && styles.rtlUrName]}>{name}</Text>
                    <Text style={[styles.agentDesc, descStyle, isRTL && styles.rtlUrDesc]}>{desc}</Text>
                  </View>

                  {/* Pulsing indicator or completed timings */}
                  <View style={styles.statusSide}>
                    {state === 'PROCESSING' && (
                      <Animated.View style={[styles.pulseCircle, { transform: [{ scale: pulseAnim }] }]} />
                    )}
                    {state === 'COMPLETE' && (
                      <Text style={styles.durationBadge}>{item.dur}</Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>

          {/* Long running API indicator */}
          {isWaitingForApi && (
            <View style={styles.waitingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={[styles.waitingText, rtlText]}>
                Agents are still processing your document...
              </Text>
            </View>
          )}

          {/* Cancel button */}
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel} activeOpacity={0.85}>
            <Text style={styles.cancelText}>{t('cancel')}</Text>
          </TouchableOpacity>

          {/* Padding to prevent layout clip */}
          <View style={{ height: 60 }} />

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xl,
  },
  headerBlock: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
    fontFamily: 'Inter',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.primary,
    fontFamily: 'Inter',
  },
  progressContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderWidth: 0.5,
    borderColor: 'rgba(99, 102, 241, 0.12)',
    borderRadius: 14,
    padding: 12,
    marginBottom: SPACING.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
    fontFamily: 'Inter',
  },
  progressCount: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryDark,
    fontFamily: 'Inter',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  agentList: {
    gap: 8,
    marginBottom: SPACING.xl,
  },
  agentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 0.5,
    borderLeftWidth: 3, // Flat side color indicator specified
    gap: 12,
  },
  // Waiting State Colors
  cardWaiting: {
    backgroundColor: 'rgba(248, 250, 252, 0.7)',
  },
  borderWaiting: {
    borderColor: '#E2E8F0',
    borderLeftColor: '#E2E8F0',
  },
  numBgWaiting: {
    backgroundColor: '#F1F5F9',
  },
  numTextWaiting: {
    color: '#94A3B8',
  },
  nameWaiting: {
    color: '#94A3B8',
  },
  descWaiting: {
    color: '#CBD5E1',
  },
  // Processing State Colors
  cardActive: {
    backgroundColor: 'rgba(238, 242, 255, 0.92)',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  borderActive: {
    borderColor: 'rgba(99, 102, 241, 0.25)',
    borderLeftColor: '#6366F1',
  },
  numBgActive: {
    backgroundColor: '#EEF2FF',
  },
  numTextActive: {
    color: '#4F46E5',
  },
  nameActive: {
    color: '#3730A3',
    fontWeight: '600',
  },
  descActive: {
    color: '#6366F1',
  },
  // Complete State Colors
  cardDone: {
    backgroundColor: 'rgba(236, 253, 245, 0.85)',
  },
  borderDone: {
    borderColor: 'rgba(16, 185, 129, 0.18)',
    borderLeftColor: '#10B981',
  },
  numBgDone: {
    backgroundColor: '#D1FAE5',
  },
  numTextDone: {
    color: '#065F46',
  },
  nameDone: {
    color: '#065F46',
    fontWeight: '500',
  },
  descDone: {
    color: '#10B981',
  },
  numCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numText: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  detailsBlock: {
    flex: 1,
    justifyContent: 'center',
  },
  agentName: {
    fontSize: 13,
    fontFamily: 'Inter',
    marginBottom: 2,
  },
  rtlUrName: {
    fontFamily: 'NotoNastaliqUrdu',
    fontSize: 11,
  },
  agentDesc: {
    fontSize: 10,
    fontFamily: 'Inter',
  },
  rtlUrDesc: {
    fontFamily: 'NotoNastaliqUrdu',
    fontSize: 8,
    marginTop: 2,
  },
  statusSide: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
  },
  pulseCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  durationBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.success,
    fontFamily: 'Inter',
  },
  cancelButton: {
    height: 48,
    borderWidth: 1.5,
    borderColor: COLORS.danger,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  cancelText: {
    color: COLORS.danger,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  waitingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    marginBottom: SPACING.md,
  },
  waitingText: {
    marginTop: SPACING.sm,
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '500',
    fontFamily: 'Inter',
  },
});
