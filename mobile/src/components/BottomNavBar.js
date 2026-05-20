import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS } from '../config/theme';
import { useLanguage } from '../i18n/LanguageContext';

export default function BottomNavBar({ activeTab, setActiveTab }) {
  const { t, isRTL, rtlRow } = useLanguage();

  const tabs = [
    { key: 'home', label: t('navHome'), icon: 'home-outline', iconActive: 'home' },
    { key: 'results', label: t('navResults'), icon: 'bar-chart-outline', iconActive: 'bar-chart' },
    { key: 'history', label: t('navHistory'), icon: 'time-outline', iconActive: 'time' },
    { key: 'settings', label: t('navSettings'), icon: 'settings-outline', iconActive: 'settings' },
  ];

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={[styles.container, rtlRow]}>
        {tabs.map((tab, idx) => {
          const isActive = activeTab === idx;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabButton, isActive && styles.activeTabButton]}
              onPress={() => setActiveTab(idx)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isActive ? tab.iconActive : tab.icon}
                size={22}
                color={isActive ? COLORS.primary : COLORS.textMuted}
              />
              <Text 
                style={[
                  styles.tabLabel, 
                  isActive ? styles.activeLabel : styles.inactiveLabel,
                  isRTL && styles.rtlText
                ]}
                numberOfLines={1}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    backgroundColor: '#1a0c2c', // Dark theme background
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(220, 160, 109, 0.2)', // Dark theme border
    width: '100%',
    // Removed absolute positioning so it acts as a true structural footer
  },
  container: {
    flexDirection: 'row',
    height: 60,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xs,
  },
  activeTabButton: {
    // Subtle glow overlay on active tab
    transform: [{ scale: 1.05 }],
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 3,
    fontFamily: 'Inter',
  },
  activeLabel: {
    color: COLORS.secondary, // Peach accent for active
    fontWeight: '600',
  },
  inactiveLabel: {
    color: COLORS.textMuted,
    fontWeight: '400',
  },
  rtlText: {
    fontFamily: 'NotoNastaliqUrdu',
    fontSize: 9,
  },
});
