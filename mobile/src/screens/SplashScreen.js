import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import OmniTaskLogo from '../components/OmniTaskLogo';
import ParticleBackground from '../components/ParticleBackground';
import { COLORS } from '../config/theme';

const { width } = Dimensions.get('window');

export default function SplashScreen({ onFinish }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    // Parallel animation: fade in and scale up smoothly
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 20,
        useNativeDriver: true,
      }),
    ]).start();

    // Set a timeout to finish the splash screen after 3 seconds
    const timer = setTimeout(() => {
      // Fade out before unmounting
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        if (onFinish) onFinish();
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Moving Waves Background */}
      <ParticleBackground />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <OmniTaskLogo size={120} />
        <Text style={styles.appName}>OmniTask</Text>
        <Text style={styles.tagline}>Transform Content Into Action</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.pageBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  appName: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
    fontFamily: 'Inter',
    letterSpacing: 2,
    textShadowColor: 'rgba(168, 85, 247, 0.6)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  tagline: {
    fontSize: 14,
    color: COLORS.secondary,
    marginTop: 8,
    fontFamily: 'Inter',
    letterSpacing: 1,
    opacity: 0.9,
  },
});
