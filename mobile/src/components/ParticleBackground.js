import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

export default function ParticleBackground() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    let animId;
    const update = () => {
      setPhase((p) => p + 0.02); // Speed of the waves
      animId = requestAnimationFrame(update);
    };
    animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Generate a smooth SVG path for a wave
  const generateWavePath = (yOffset, amplitude, frequency, phaseShift) => {
    let path = `M 0 ${height}`; // Start at bottom left
    path += ` L 0 ${yOffset + Math.sin(phaseShift) * amplitude}`;

    for (let x = 0; x <= width; x += 10) {
      const y = yOffset + Math.sin((x / width) * frequency + phaseShift) * amplitude;
      path += ` L ${x} ${y}`;
    }

    path += ` L ${width} ${height} Z`; // Close the path at the bottom right
    return path;
  };

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      <Svg style={StyleSheet.absoluteFillObject}>
        <Defs>
          <LinearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0" stopColor="#4f1c51" stopOpacity="0.4" />
            <Stop offset="1" stopColor="#210f37" stopOpacity="0.8" />
          </LinearGradient>
          <LinearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0" stopColor="#a55b4b" stopOpacity="0.3" />
            <Stop offset="1" stopColor="#4f1c51" stopOpacity="0.6" />
          </LinearGradient>
          <LinearGradient id="wave3" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0" stopColor="#dca06d" stopOpacity="0.2" />
            <Stop offset="1" stopColor="#a55b4b" stopOpacity="0.4" />
          </LinearGradient>
        </Defs>

        {/* 3 Overlapping Waves with different phases, amplitudes, and frequencies */}
        <Path d={generateWavePath(height * 0.65, 40, Math.PI * 1.5, phase * 0.8)} fill="url(#wave1)" />
        <Path d={generateWavePath(height * 0.75, 30, Math.PI * 2, phase * 1.2 + 2)} fill="url(#wave2)" />
        <Path d={generateWavePath(height * 0.85, 20, Math.PI * 2.5, phase * 1.5 + 4)} fill="url(#wave3)" />
      </Svg>
    </View>
  );
}
