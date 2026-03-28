import React from 'react';
import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

type NimahFrostSheetProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  blurIntensity?: number;
};

/**
 * Shared frosted bottom / card fill — matches “Picks near me” orange-cream blur theme.
 */
export default function NimahFrostSheet({
  children,
  style,
  contentStyle,
  blurIntensity = 45,
}: NimahFrostSheetProps) {
  return (
    <View style={[styles.clip, style]}>
      <BlurView intensity={blurIntensity} tint="light" style={styles.blur}>
        <LinearGradient
          colors={[
            'rgba(255, 255, 255, 0.97)',
            'rgba(255, 247, 237, 0.96)',
            'rgba(254, 236, 220, 0.94)',
          ]}
          locations={[0, 0.45, 1]}
          style={StyleSheet.absoluteFillObject}
          pointerEvents="none"
        />
        <LinearGradient
          colors={['rgba(249, 115, 22, 0.14)', 'rgba(249, 115, 22, 0.04)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
          pointerEvents="none"
        />
        <View style={[styles.inner, contentStyle]}>{children}</View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  clip: {
    overflow: 'hidden',
  },
  blur: {
    flex: 1,
    overflow: 'hidden',
  },
  inner: {
    flex: 1,
  },
});
