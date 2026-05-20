import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Text as SvgText, G } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function BarChart({ data }) {
  const chartHeight = 200;
  const chartWidth = SCREEN_WIDTH - 64;
  const padding = 30;
  const barWidth = 25;
  const gap = 40;

  // Find max value for scaling
  const maxValue = Math.max(...data.flatMap(d => [d.before, d.after]), 1);
  
  return (
    <View style={styles.container}>
      <Svg height={chartHeight + 40} width={chartWidth}>
        {data.map((item, index) => {
          const xBase = index * (barWidth * 2 + gap) + padding;
          const beforeHeight = (item.before / maxValue) * chartHeight;
          const afterHeight = (item.after / maxValue) * chartHeight;

          return (
            <G key={index}>
              {/* Before Bar */}
              <Rect
                x={xBase}
                y={chartHeight - beforeHeight}
                width={barWidth}
                height={beforeHeight}
                fill="#3B82F6"
                rx={4}
              />
              <SvgText
                x={xBase + barWidth / 2}
                y={chartHeight - beforeHeight - 5}
                fill="#94A3B8"
                fontSize="10"
                textAnchor="middle"
              >
                {item.before}
              </SvgText>

              {/* After Bar */}
              <Rect
                x={xBase + barWidth + 5}
                y={chartHeight - afterHeight}
                width={barWidth}
                height={afterHeight}
                fill="#10B981"
                rx={4}
              />
              <SvgText
                x={xBase + barWidth + 5 + barWidth / 2}
                y={chartHeight - afterHeight - 5}
                fill="#94A3B8"
                fontSize="10"
                textAnchor="middle"
              >
                {item.after}
              </SvgText>

              {/* X-Axis Label */}
              <SvgText
                x={xBase + barWidth}
                y={chartHeight + 20}
                fill="#FFFFFF"
                fontSize="10"
                textAnchor="middle"
              >
                {item.label}
              </SvgText>
            </G>
          );
        })}
      </Svg>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#3B82F6' }]} />
          <Text style={styles.legendText}>Before</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#10B981' }]} />
          <Text style={styles.legendText}>After</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: 15,
    borderRadius: 12,
  },
  legend: {
    flexDirection: 'row',
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginRight: 5,
  },
  legendText: {
    color: '#94A3B8',
    fontSize: 12,
  },
});
