import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function GradientButton({ title, onPress, disabled, shouldPulse = false, style, textStyle }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let animation;
    if (shouldPulse && !disabled) {
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, { toValue: 1.02, duration: 1000, useNativeDriver: true }),
          Animated.timing(scaleAnim, { toValue: 1.0, duration: 1000, useNativeDriver: true }),
        ])
      );
      animation.start();
    } else {
      scaleAnim.setValue(1);
    }
    return () => {
      if (animation) {
        animation.stop();
      }
    };
  }, [shouldPulse, disabled]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.85}
        style={[
          styles.container,
          disabled ? styles.containerDisabled : styles.containerActive,
          style,
        ]}
      >
        {disabled ? (
          <View style={[styles.gradient, styles.disabledBg]}>
            <Text style={[styles.text, styles.disabledText, textStyle]}>{title}</Text>
          </View>
        ) : (
          <LinearGradient
            colors={['#6366F1', '#06B6D4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <Text style={[styles.text, textStyle]}>{title}</Text>
          </LinearGradient>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 52,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerActive: {
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.32,
    shadowRadius: 14,
    elevation: 6,
  },
  containerDisabled: {
    shadowColor: 'transparent',
    elevation: 0,
  },
  gradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  disabledBg: {
    backgroundColor: '#E2E8F0',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  disabledText: {
    color: '#94A3B8',
  },
});
