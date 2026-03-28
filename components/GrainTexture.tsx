import React from 'react';
import { View, StyleSheet } from 'react-native';

// Pre-generated grain pattern for mobile
const GrainTexture = () => {
  // Create grain using small dots pattern
  const grainDots = Array.from({ length: 200 }).map((_, i) => {
    const size = Math.random() * 1.5 + 0.5;
    const opacity = Math.random() * 0.3 + 0.1;
    return {
      key: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size,
      opacity,
    };
  });

  return (
    <View style={styles.container} pointerEvents="none">
      {grainDots.map((dot) => (
        <View
          key={dot.key}
          style={[
            styles.dot,
            {
              left: `${dot.left}%`,
              top: `${dot.top}%`,
              width: dot.size,
              height: dot.size,
              opacity: dot.opacity,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  dot: {
    position: 'absolute',
    backgroundColor: 'rgba(200, 220, 240, 0.6)',
    borderRadius: 0.5,
  },
});

export default GrainTexture;

