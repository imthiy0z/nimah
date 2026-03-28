import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  ScrollView,
  Pressable,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from '../constants/theme';
import BottomTabBar from '../components/BottomTabBar';
import DeliveryLocationBar from '../components/DeliveryLocationBar';
import {
  MOCK_REWARD_BALANCE,
  MOCK_WAYS_TO_EARN,
  MOCK_REDEEM_OPTIONS,
  MOCK_REWARD_ACTIVITY,
} from '../constants/mockData';
import { useLanguage } from '../contexts/LanguageContext';
import OmrCurrency from '../components/OmrCurrency';

const { width } = Dimensions.get('window');
const CARD_GAP = Theme.spacing.md;
const TILE_WIDTH = (width - Theme.spacing.lg * 2 - CARD_GAP) / 2;

type RewardsScreenProps = {
  activeTab?: string;
  onTabPress?: (tabId: string) => void;
  onProfilePress?: () => void;
  onNotificationsPress?: () => void;
  cartCount?: number;
};

export default function RewardsScreen({
  activeTab = 'rewards',
  onTabPress,
  onProfilePress,
  onNotificationsPress,
  cartCount = 0,
}: RewardsScreenProps) {
  const { t, rtlMirror } = useLanguage();
  const insets = useSafeAreaInsets();
  const SCREEN_HPAD = Theme.spacing.sm + Theme.spacing.xs;
  const gutter = SCREEN_HPAD;
  const headerTop = insets.top + Theme.spacing.sm;
  const b = MOCK_REWARD_BALANCE;
  const tierFloor = 800;
  const tierProgress = Math.min(
    1,
    Math.max(0, (b.points - tierFloor) / Math.max(1, b.nextTierAt - tierFloor))
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[Theme.colors.primaryDark, Theme.colors.primary, '#FB923C']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.headerRow,
            {
              marginTop: headerTop,
              paddingHorizontal: insets.left + gutter,
            },
          ]}
        >
          <View style={styles.locationSlot}>
            <DeliveryLocationBar variant="onGradient" />
          </View>
          <View style={styles.topRightIcons}>
            <Pressable
              style={styles.iconBtn}
              onPress={onNotificationsPress}
              accessibilityRole="button"
              accessibilityLabel={t('home.notif')}
            >
              <Ionicons name="notifications-outline" size={24} color="rgba(255,255,255,0.95)" />
            </Pressable>
            <Pressable
              style={styles.iconBtn}
              onPress={() => onTabPress?.('chat')}
              accessibilityRole="button"
              accessibilityLabel={t('home.chat')}
            >
              <Ionicons name="chatbubble-outline" size={24} color="rgba(255,255,255,0.95)" />
            </Pressable>
            <Pressable
              style={styles.profileBtn}
              onPress={onProfilePress}
              accessibilityRole="button"
              accessibilityLabel={t('rewards.openProfile')}
            >
              <Ionicons name="person-circle-outline" size={28} color="rgba(255,255,255,0.95)" />
            </Pressable>
          </View>
        </View>
        <Text style={styles.screenTitle}>{t('rewards.title')}</Text>
        <Text style={styles.screenSub}>{t('rewards.subtitle')}</Text>

        <View style={styles.heroCard}>
          <BlurView intensity={40} tint="light" style={styles.heroBlur}>
            <LinearGradient
              colors={['rgba(255,255,255,0.35)', 'rgba(255,255,255,0.08)']}
              style={StyleSheet.absoluteFill}
              pointerEvents="none"
            />
            <View style={styles.heroTop}>
              <View>
                <Text style={styles.heroLabel}>{t('rewards.yourBalance')}</Text>
                <Text style={styles.heroPoints}>{b.points.toLocaleString()}</Text>
                <Text style={styles.heroPtsUnit}>{t('rewards.points')}</Text>
              </View>
              <View style={styles.tierPill}>
                <Text style={styles.tierEmoji}>{b.tierEmoji}</Text>
                <Text style={styles.tierName}>{t(`rewards.tier.${b.tierKey}`, b.tier)}</Text>
              </View>
            </View>
            <View style={styles.progressBlock}>
              <View style={styles.progressLabels}>
                <Text style={styles.progressHint}>
                  {t('rewards.progressTo', undefined, {
                    tier: t(`rewards.tier.${b.nextTierKey}`, b.nextTierName),
                  })}
                </Text>
                <Text style={styles.progressHintStrong}>
                  {t('rewards.ptsToGo', undefined, { n: String(b.nextTierAt - b.points) })}
                </Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${tierProgress * 100}%` }]} />
              </View>
            </View>
            <Text style={styles.lifetime}>
              {t('rewards.lifetime', undefined, { n: b.lifetimeEarned.toLocaleString() })}
            </Text>
          </BlurView>
        </View>

        <Text style={styles.sectionTitle}>{t('rewards.earnMore')}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.earnScroll}
        >
          {MOCK_WAYS_TO_EARN.map((item) => (
            <Pressable
              key={item.id}
              style={styles.earnChip}
              onPress={() => console.log('earn', item.id)}
            >
              <View style={styles.earnIconWrap}>
                <Ionicons name={item.icon as any} size={22} color={Theme.colors.primary} />
              </View>
              <Text style={styles.earnTitle}>{t(item.titleKey as string)}</Text>
              <Text style={styles.earnPts}>{item.points}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>{t('rewards.redeemTitle')}</Text>
        <View style={styles.redeemGrid}>
          {MOCK_REDEEM_OPTIONS.map((opt) => (
            <Pressable
              key={opt.id}
              style={styles.redeemTile}
              onPress={() => console.log('redeem', opt.id)}
            >
              <BlurView intensity={28} tint="light" style={styles.redeemBlur}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.8)']}
                  style={StyleSheet.absoluteFill}
                  pointerEvents="none"
                />
                <Ionicons name={opt.icon as any} size={26} color={Theme.colors.primary} />
                {'omrDiscount' in opt && opt.omrDiscount != null ? (
                  <View style={styles.redeemTitleWrap}>
                    <Text style={styles.redeemTitlePart}>
                      {t('rewards.redeemOffers.offNextDiscountPrefix')}
                    </Text>
                    <OmrCurrency
                      amount={opt.omrDiscount}
                      variant="short"
                      textStyle={styles.redeemTitlePart}
                      iconSize={14}
                    />
                    <Text style={styles.redeemTitlePart}>
                      {t('rewards.redeemOffers.offNextDiscountSuffix')}
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.redeemTitle}>{t((opt as { titleKey: string }).titleKey)}</Text>
                )}
                <Text style={styles.redeemCost}>
                  {t('rewards.ptsCost', undefined, { n: String(opt.cost) })}
                </Text>
              </BlurView>
            </Pressable>
          ))}
        </View>

        <Text style={styles.sectionTitle}>{t('rewards.recent')}</Text>
        <View style={styles.activityCard}>
          {MOCK_REWARD_ACTIVITY.map((row, i) => (
            <View
              key={row.id}
              style={[styles.activityRow, i < MOCK_REWARD_ACTIVITY.length - 1 && styles.activityRowBorder]}
            >
              <View style={styles.activityDot} />
              <View style={styles.activityText}>
                <Text style={styles.activityLabel}>{t(row.labelKey)}</Text>
                <Text style={styles.activityDate}>{t(row.dateKey)}</Text>
              </View>
              <Text style={styles.activityPts}>+{row.points}</Text>
            </View>
          ))}
        </View>

        <Pressable style={styles.ctaWide} onPress={() => console.log('history')}>
          <Text style={styles.ctaWideText}>{t('orders.fullHistory')}</Text>
          <Ionicons name="chevron-forward" size={18} color={Theme.colors.primary} style={rtlMirror} />
        </Pressable>

        <View style={{ height: 100 }} />
      </ScrollView>

      <BottomTabBar
        activeTab={activeTab}
        onTabPress={onTabPress || (() => {})}
        cartCount={cartCount}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.primary,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
    marginBottom: Theme.spacing.md,
  },
  locationSlot: {
    flex: 1,
    minWidth: 0,
  },
  topRightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.xs,
    flexShrink: 0,
  },
  iconBtn: {
    padding: Theme.spacing.xs,
  },
  profileBtn: {
    padding: Theme.spacing.xs,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Theme.spacing.sm + Theme.spacing.xs,
  },
  screenTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.8,
  },
  screenSub: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.88)',
    marginTop: 6,
    marginBottom: Theme.spacing.lg,
  },
  heroCard: {
    borderRadius: Theme.borderRadius.xl,
    overflow: 'hidden',
    marginBottom: Theme.spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  heroBlur: {
    padding: Theme.spacing.lg,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  heroPoints: {
    fontSize: 44,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 4,
    letterSpacing: -1,
  },
  heroPtsUnit: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
  },
  tierPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Theme.borderRadius.full,
  },
  tierEmoji: {
    fontSize: 18,
  },
  tierName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  progressBlock: {
    marginTop: Theme.spacing.lg,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressHint: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
  progressHintStrong: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.2)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  lifetime: {
    marginTop: Theme.spacing.md,
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: Theme.spacing.md,
  },
  earnScroll: {
    gap: Theme.spacing.md,
    paddingBottom: Theme.spacing.lg,
  },
  earnChip: {
    width: 132,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  earnIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(249,115,22,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  earnTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Theme.colors.text.primary,
    lineHeight: 18,
  },
  earnPts: {
    fontSize: 15,
    fontWeight: '800',
    color: Theme.colors.primary,
    marginTop: 8,
  },
  redeemGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
    marginBottom: Theme.spacing.xl,
  },
  redeemTile: {
    width: TILE_WIDTH,
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
    minHeight: 118,
  },
  redeemBlur: {
    flex: 1,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    gap: Theme.spacing.sm,
  },
  redeemTitleWrap: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  redeemTitlePart: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.colors.text.primary,
  },
  redeemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.colors.text.primary,
    flex: 1,
  },
  redeemCost: {
    fontSize: 13,
    fontWeight: '800',
    color: Theme.colors.primary,
  },
  activityCard: {
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    marginBottom: Theme.spacing.md,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Theme.spacing.sm,
  },
  activityRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(42,63,78,0.12)',
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Theme.colors.primary,
    marginRight: Theme.spacing.md,
  },
  activityText: {
    flex: 1,
  },
  activityLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Theme.colors.text.primary,
  },
  activityDate: {
    fontSize: 12,
    color: Theme.colors.text.muted,
    marginTop: 2,
  },
  activityPts: {
    fontSize: 16,
    fontWeight: '800',
    color: Theme.colors.primary,
  },
  ctaWide: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: Theme.borderRadius.lg,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  ctaWideText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
