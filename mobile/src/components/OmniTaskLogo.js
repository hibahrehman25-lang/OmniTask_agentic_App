import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Circle, Rect, G } from 'react-native-svg';

export default function OmniTaskLogo({ size = 48 }) {
  // Second logo in the first row: Swooping ring with robot head and cyan eyes
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
          <LinearGradient id="ringGrad" x1="100%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#A855F7" />
            <Stop offset="50%" stopColor="#6366F1" />
            <Stop offset="100%" stopColor="#3B82F6" />
          </LinearGradient>
          
          <LinearGradient id="headGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#4C1D95" />
            <Stop offset="100%" stopColor="#1E3A8A" />
          </LinearGradient>

          <LinearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#8B5CF6" />
            <Stop offset="100%" stopColor="#2563EB" />
          </LinearGradient>
        </Defs>

        {/* Outer swooping ring (counter-clockwise from right to bottom) */}
        <Path 
          d="M 88 40 A 38 38 0 1 0 50 88" 
          fill="none" 
          stroke="url(#ringGrad)" 
          strokeWidth="6" 
          strokeLinecap="round" 
        />
        
        {/* Detached orbiting dot */}
        <Circle cx="88" cy="55" r="4.5" fill="#3B82F6" />

        {/* Robot Head shape (placed behind the bottom waves) */}
        <Rect
          x="28"
          y="30"
          width="44"
          height="40"
          rx="20"
          fill="url(#headGrad)"
        />

        {/* Wavy bottom overlapping base */}
        <Path 
          d="M 12 50 Q 25 75, 50 88 Q 75 70, 88 78 Q 80 92, 50 96 Q 15 85, 12 50 Z" 
          fill="url(#waveGrad)" 
          opacity="0.9"
        />
        <Path 
          d="M 16 65 Q 35 85, 55 80 Q 75 75, 88 85 Q 70 98, 50 90 Q 20 85, 16 65 Z" 
          fill="url(#ringGrad)" 
          opacity="0.6"
        />

        {/* Cyan Glowing Eyes */}
        <G>
          <Circle cx="40" cy="50" r="3.5" fill="#22D3EE" />
          <Circle cx="40" cy="50" r="7" fill="#22D3EE" opacity="0.4" />
          
          <Circle cx="60" cy="50" r="3.5" fill="#22D3EE" />
          <Circle cx="60" cy="50" r="7" fill="#22D3EE" opacity="0.4" />
        </G>
      </Svg>
    </View>
  );
}
