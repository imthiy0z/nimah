import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../constants/theme';
import { useLanguage } from '../contexts/LanguageContext';

const { width } = Dimensions.get('window');
const cardWidth = (width - Theme.spacing.lg * 2 - Theme.spacing.md) / 2; // 2 cards per row
const SPLIT_STACK_HEIGHT = 120;
const SPLIT_GAP = Theme.spacing.sm;
/** Each Discover / Favorites tile height */
const splitCardHeight = (SPLIT_STACK_HEIGHT - SPLIT_GAP) / 2;

type QuickActionTilesProps = {
  onActionPress?: (action: string) => void;
};

export default function QuickActionTiles({ onActionPress }: QuickActionTilesProps) {
  const { t, isRtl } = useLanguage();
  const ta = isRtl ? 'right' : 'left';
  return (
    <View style={styles.container}>
      {/* First Row: 2 cards */}
      <View style={styles.row}>
        <Pressable
          style={styles.card}
          onPress={() => onActionPress?.('reserve-quick')}
          accessibilityRole="button"
          accessibilityLabel={t('quick.quickReserve')}
        >
          <BlurView intensity={30} tint="light" style={styles.cardBlur}>
            <LinearGradient
              colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
              pointerEvents="none"
            />
            <View style={styles.glassEffect} />
            <View style={styles.cardContent}>
              <View style={styles.textContainer}>
                <Text style={[styles.cardLabel, { textAlign: ta }]}>{t('quick.quickReserve')}</Text>
                <Text style={[styles.cardSubLabel, { textAlign: ta }]}>{t('quick.firstPick')}</Text>
              </View>
              <View style={styles.cardIcon}>
                <Ionicons name="flash-outline" size={32} color={Theme.colors.primary} />
              </View>
              <View style={styles.arrowContainer}>
                <Image
                  source={require('../assets/arrow.png')}
                  style={styles.arrowIcon}
                  contentFit="contain"
                />
              </View>
            </View>
          </BlurView>
        </Pressable>

        <Pressable
          style={styles.card}
          onPress={() => onActionPress?.('history')}
          accessibilityRole="button"
          accessibilityLabel={t('quick.history')}
        >
          <BlurView intensity={30} tint="light" style={styles.cardBlur}>
            <LinearGradient
              colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
              pointerEvents="none"
            />
            <View style={styles.glassEffect} />
            <View style={styles.cardContent}>
              <View style={styles.textContainer}>
                <Text style={[styles.cardLabel, { textAlign: ta }]}>{t('quick.history')}</Text>
                <Text style={[styles.cardSubLabel, { textAlign: ta }]}>{t('quick.pastRescues')}</Text>
              </View>
              <View style={styles.cardIcon}>
                <Ionicons name="receipt-outline" size={30} color={Theme.colors.primary} />
              </View>
              <View style={styles.arrowContainer}>
                <Image
                  source={require('../assets/arrow.png')}
                  style={styles.arrowIcon}
                  contentFit="contain"
                />
              </View>
            </View>
          </BlurView>
        </Pressable>
      </View>

      {/* Second Row: 3 cards - first same size, then split horizontally */}
      <View style={styles.row}>
        <Pressable
          style={styles.card}
          onPress={() => onActionPress?.('orders')}
          accessibilityRole="button"
          accessibilityLabel={t('quick.orders')}
        >
          <BlurView intensity={30} tint="light" style={styles.cardBlur}>
            <LinearGradient
              colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
              pointerEvents="none"
            />
            <View style={styles.glassEffect} />
            <View style={styles.cardContent}>
              <View style={styles.textContainer}>
                <Text style={[styles.cardLabel, { textAlign: ta }]}>{t('quick.orders')}</Text>
                <Text style={[styles.cardSubLabel, { textAlign: ta }]}>{t('quick.pickupsStatus')}</Text>
              </View>
              <View style={styles.cardIcon}>
                <Ionicons name="bag-handle-outline" size={32} color={Theme.colors.primary} />
              </View>
              <View style={styles.arrowContainer}>
                <Image
                  source={require('../assets/arrow.png')}
                  style={styles.arrowIcon}
                  contentFit="contain"
                />
              </View>
            </View>
          </BlurView>
        </Pressable>

        {/* 4th section split horizontally into 2 — same glass + type as other quick tiles */}
        <View style={styles.splitContainer}>
          <Pressable
            style={styles.splitCard}
            onPress={() => onActionPress?.('discover')}
            accessibilityRole="button"
            accessibilityLabel={t('quick.discover')}
          >
            <BlurView intensity={30} tint="light" style={styles.splitCardBlur}>
              <LinearGradient
                colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
                pointerEvents="none"
              />
              <View style={styles.glassEffect} />
              <View style={styles.splitCardContent}>
                <View style={styles.splitTextBlock}>
                  <Text style={[styles.cardLabel, { textAlign: ta }]}>{t('quick.discover')}</Text>
                  <Text style={[styles.cardSubLabel, { textAlign: ta }]} numberOfLines={1}>
                    {t('quick.browsePartners')}
                  </Text>
                </View>
                <View style={styles.splitRightColumn}>
                  <Ionicons name="compass-outline" size={26} color={Theme.colors.primary} />
                </View>
              </View>
            </BlurView>
          </Pressable>

          <Pressable
            style={styles.splitCard}
            onPress={() => onActionPress?.('favorites')}
            accessibilityRole="button"
            accessibilityLabel={t('quick.favorites')}
          >
            <BlurView intensity={30} tint="light" style={styles.splitCardBlur}>
              <LinearGradient
                colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
                pointerEvents="none"
              />
              <View style={styles.glassEffect} />
              <View style={styles.splitCardContent}>
                <View style={styles.splitTextBlock}>
                  <Text style={[styles.cardLabel, { textAlign: ta }]}>{t('quick.favorites')}</Text>
                  <Text style={[styles.cardSubLabel, { textAlign: ta }]} numberOfLines={1}>
                    {t('quick.savedPlaces')}
                  </Text>
                </View>
                <View style={styles.splitRightColumn}>
                  <Ionicons name="heart-outline" size={26} color={Theme.colors.primary} />
                </View>
              </View>
            </BlurView>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Theme.spacing.md,
    paddingBottom: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2A3F4E',
    marginBottom: Theme.spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  card: {
    width: cardWidth,
    height: 120,
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  cardBlur: {
    width: '100%',
    height: '100%',
    borderRadius: Theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    position: 'relative',
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  glassEffect: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: Theme.borderRadius.lg,
    pointerEvents: 'none',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: Theme.spacing.md,
    zIndex: 1,
    position: 'relative',
  },
  textContainer: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2A3F4E',
    textAlign: 'left',
    letterSpacing: 0.3,
  },
  cardSubLabel: {
    fontSize: 11,
    fontWeight: '400',
    color: '#2A3F4E',
    opacity: 0.7,
    marginTop: 2,
  },
  cardIcon: {
    alignSelf: 'flex-start',
    marginTop: 'auto',
  },
  customIcon: {
    width: 40,
    height: 40,
  },
  smallIcon: {
    width: 32,
    height: 32,
  },
  arrowContainer: {
    position: 'absolute',
    bottom: Theme.spacing.md,
    right: Theme.spacing.md,
    zIndex: 2,
  },
  arrowIcon: {
    width: 20,
    height: 20,
  },
  splitContainer: {
    width: cardWidth,
    height: SPLIT_STACK_HEIGHT,
    flexDirection: 'column',
    gap: SPLIT_GAP,
  },
  splitCard: {
    width: cardWidth,
    height: splitCardHeight,
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  splitCardBlur: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: Theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    position: 'relative',
    backgroundColor: 'rgba(255,255,255,0.95)',
    overflow: 'hidden',
  },
  splitCardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: Theme.spacing.md,
    paddingRight: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    zIndex: 1,
    position: 'relative',
    minHeight: 0,
  },
  splitTextBlock: {
    flex: 1,
    minWidth: 0,
    paddingRight: Theme.spacing.xs,
  },
  splitRightColumn: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    alignSelf: 'stretch',
    minWidth: 32,
  },
});
