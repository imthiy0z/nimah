import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
  Pressable,
  Text,
} from 'react-native';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '../constants/theme';
import { useLanguage } from '../contexts/LanguageContext';

const { width } = Dimensions.get('window');

type OnboardingScreenProps = {
  onBegin?: () => void;
};

export default function OnboardingScreen({ onBegin }: OnboardingScreenProps) {
  const { t } = useLanguage();
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Main Image */}
      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/onboarding-image.png')}
          style={styles.image}
          contentFit="cover"
        />
      </View>

      {/* Bottom overlay for contrast */}
      <LinearGradient
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.45)']}
        locations={[0, 1]}
        style={styles.bottomFade}
        pointerEvents="none"
      />

      {/* CTA */}
      <View style={styles.ctaContainer}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Get started with Nimah"
          onPress={onBegin}
          style={({ pressed }) => [
            styles.ctaPressable,
            pressed && styles.ctaPressablePressed,
          ]}
        >
          <BlurView intensity={22} tint="light" style={styles.ctaBlur}>
            <LinearGradient
              colors={['rgba(255,255,255,0.34)', 'rgba(255,255,255,0.10)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
              pointerEvents="none"
            />
            <View style={styles.ctaInner}>
              <Text style={styles.ctaText}>{t('onboarding.getStarted')}</Text>
              <Text style={styles.ctaArrow} accessibilityElementsHidden>
                →
              </Text>
            </View>
          </BlurView>
        </Pressable>

        <Text style={styles.tagline}>{t('onboarding.tagline')}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.primary,
  },
  imageContainer: {
    flex: 1,
    width: '100%',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  bottomFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 240,
  },
  ctaContainer: {
    position: 'absolute',
    left: Theme.spacing.lg,
    right: Theme.spacing.lg,
    bottom: Theme.spacing.xxl + Theme.spacing.lg,
  },
  ctaPressable: {
    borderRadius: Theme.borderRadius.xl,
  },
  ctaPressablePressed: {
    transform: [{ scale: 0.985 }],
  },
  ctaBlur: {
    borderRadius: Theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.26)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  ctaInner: {
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  ctaText: {
    color: Theme.colors.white,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  ctaArrow: {
    color: Theme.colors.white,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 1,
  },
  tagline: {
    marginTop: Theme.spacing.md,
    color: 'rgba(255,255,255,0.86)',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.1,
  },
});
