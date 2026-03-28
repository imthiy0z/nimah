import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  Text,
  Pressable,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../constants/theme';
import { useLanguage } from '../contexts/LanguageContext';
import OmrCurrency from './OmrCurrency';
import {
  getFeaturedOffers,
  type PartnerStore,
  type RescueBag,
} from '../constants/mockData';
import ReserveBagModal from './ReserveBagModal';

const { width } = Dimensions.get('window');
const OMR_ICON = require('../assets/omr-symbol.png');

/** Same horizontal inset as `QuickActionTiles` */
const QUICK_PAD = Theme.spacing.lg;
/** Same width as one Quick Reserve / History tile */
const QUICK_ROW_GAP = Theme.spacing.md;
const PICK_CARD_WIDTH = Math.floor((width - QUICK_PAD * 2 - QUICK_ROW_GAP) / 2);
const cardGap = Theme.spacing.sm;

const IMAGE_HEIGHT = 78;
const GREEN_TIME = '#16a34a';

function discountPercent(price: number, retail: number): number {
  if (!retail || retail <= 0) return 0;
  return Math.round((1 - price / retail) * 100);
}

function pickupReadsAsNow(window: string): boolean {
  const s = window.toLowerCase();
  return s.includes('now') || s.includes('tonight') || s.includes('today');
}

/** For “today” windows: one line `Now 8–10 PM` — no duplicate “Tonight” / “Now”. */
function formatPickupTimeLine(raw: string, translated: string, nowLabel: string): string {
  if (!pickupReadsAsNow(raw)) return translated;
  let rest = translated
    .replace(/^(الآن|الليلة|اليوم)\s*[·.．]?\s*/u, '')
    .replace(/^(now|tonight|today)\s*[·.．]?\s*/i, '')
    .trim();
  if (!rest) {
    rest = raw
      .replace(/^(now|tonight|today)\s*[·.．]?\s*/i, '')
      .trim();
  }
  return rest ? `${nowLabel} ${rest}` : translated;
}

type FeaturedRescueCarouselProps = {
  onSeeDiscover?: () => void;
  onAddToCart?: (store: PartnerStore, bag: RescueBag, qty: number) => void;
};

export default function FeaturedRescueCarousel({
  onSeeDiscover,
  onAddToCart,
}: FeaturedRescueCarouselProps) {
  const { t, rtlMirror, isRtl } = useLanguage();
  const [modalVisible, setModalVisible] = useState(false);
  const [selection, setSelection] = useState<{
    store: PartnerStore;
    bag: RescueBag;
  } | null>(null);

  const offers = getFeaturedOffers();

  const openReserve = (store: PartnerStore, bag: RescueBag) => {
    setSelection({ store, bag });
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headRow}>
        <Text style={styles.heading}>{t('carousel.picksNearMe')}</Text>
        {onSeeDiscover ? (
          <Pressable onPress={onSeeDiscover} hitSlop={8}>
            <Text style={styles.seeAll}>{t('carousel.seeAll')}</Text>
          </Pressable>
        ) : null}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scroll}
      >
        {offers.map(({ store, bag }) => {
          const disc = discountPercent(bag.price, bag.retailValue);
          const pickupRaw = bag.pickupWindow;
          const pickupTr = t(`bags.${bag.id}.pickup`, pickupRaw);
          const showNow = pickupReadsAsNow(pickupRaw);
          const timeLine = formatPickupTimeLine(pickupRaw, pickupTr, t('carousel.now'));
          const kmLabel = t('discover.kmAway', undefined, {
            km: String(store.distanceKm),
          });
          const kmShort = `${store.distanceKm} km`;

          return (
            <View key={`${store.id}-${bag.id}`} style={[styles.cardWrap, { width: PICK_CARD_WIDTH }]}>
              <Pressable
                onPress={() => openReserve(store, bag)}
                style={({ pressed }) => [
                  styles.cardOuter,
                  pressed && styles.cardOuterPressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel={t('carousel.reserve')}
              >
                <View style={styles.imageBlock}>
                  <Image source={store.image || bag.image} style={styles.imageFill} contentFit="cover" />
                  <LinearGradient
                    colors={['rgba(0,0,0,0.35)', 'transparent', 'rgba(0,0,0,0.5)']}
                    locations={[0, 0.4, 1]}
                    style={StyleSheet.absoluteFillObject}
                    pointerEvents="none"
                  />

                  {/* Top pill: left count */}
                  <View style={[styles.leftTopPill, isRtl ? { right: 6 } : { left: 6 }]}>
                    <Ionicons name="cube-outline" size={12} color="#fff" />
                    <Text style={styles.leftTopText} numberOfLines={1}>
                      {t('storeDetail.leftCount', undefined, { n: String(bag.left) })}
                    </Text>
                  </View>

                  {disc > 0 ? (
                    <View style={[styles.saveBadge, isRtl ? { left: 6 } : { right: 6 }]}>
                      <Text style={styles.saveBadgeText}>
                        {t('storeDetail.savePercent', undefined, { n: String(disc) })}
                      </Text>
                    </View>
                  ) : null}

                  <View style={styles.timeBar}>
                    <View style={styles.timeCluster}>
                      {showNow ? (
                        <Ionicons name="flash" size={12} color={GREEN_TIME} />
                      ) : (
                        <Ionicons name="time-outline" size={12} color={GREEN_TIME} />
                      )}
                      <Text style={styles.greenWindow} numberOfLines={1}>
                        {timeLine}
                      </Text>
                    </View>
                  </View>

                  {/* Bottom pill: distance */}
                  {/* distance moved to details row */}
                </View>

                <View style={styles.detailBlock}>
                  <View
                    style={[
                      styles.detailInner,
                      { alignItems: 'stretch' },
                    ]}
                  >
                    <Text style={styles.storeName} numberOfLines={1}>
                      {t(`stores.${store.id}.name`, store.name)}
                    </Text>
                    <Text style={styles.bagTitle} numberOfLines={1}>
                      {t(`bags.${bag.id}.title`, bag.title)}
                    </Text>
                    <View
                      style={styles.priceRow}
                    >
                      <View style={styles.pricePay}>
                        <Image
                          source={OMR_ICON}
                          style={styles.omrOnlyIcon}
                          contentFit="contain"
                        />
                        <Text style={styles.priceAmountText}>{bag.price.toFixed(2)}</Text>
                      </View>
                      <View style={styles.priceStrike}>
                        <Text style={styles.priceStrikeTilde}>~</Text>
                        <Text style={styles.priceStrikeAmount}>
                          {bag.retailValue.toFixed(2)}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.stockReserveRow}>
                      <View style={styles.detailsDistanceRow}>
                        <Ionicons name="navigate-outline" size={11} color={GREEN_TIME} />
                        <Text style={styles.detailsDistanceText} numberOfLines={1}>
                          {kmShort}
                        </Text>
                      </View>
                      <View style={styles.reserveInline} pointerEvents="none">
                        <Text style={styles.reserveInlineText}>{t('carousel.reserve')}</Text>
                        <Ionicons
                          name="chevron-forward"
                          size={11}
                          color={GREEN_TIME}
                          style={rtlMirror}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </Pressable>
            </View>
          );
        })}
      </ScrollView>
      <ReserveBagModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelection(null);
        }}
        storeName={
          selection
            ? t(`stores.${selection.store.id}.name`, selection.store.name)
            : undefined
        }
        bag={selection?.bag ?? null}
        mode="cart"
        onConfirmQty={(qty) => {
          if (!selection) return;
          onAddToCart?.(selection.store, selection.bag, qty);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Theme.spacing.md,
    paddingBottom: Theme.spacing.sm,
    paddingHorizontal: QUICK_PAD,
  },
  headRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  heading: {
    fontSize: 18,
    fontWeight: '800',
    color: Theme.colors.text.primary,
    letterSpacing: -0.3,
  },
  seeAll: {
    fontSize: 13,
    fontWeight: '700',
    color: Theme.colors.primary,
  },
  scroll: {
    overflow: 'visible',
  },
  scrollContent: {
    gap: cardGap,
    paddingBottom: 2,
    paddingRight: QUICK_PAD,
  },
  cardWrap: {},
  cardOuter: {
    borderRadius: Theme.borderRadius.md,
    overflow: 'hidden',
    backgroundColor: Theme.colors.white,
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  cardOuterPressed: {
    opacity: 0.94,
  },
  imageBlock: {
    height: IMAGE_HEIGHT,
    width: '100%',
    backgroundColor: '#E2E8F0',
    position: 'relative',
  },
  imageFill: {
    width: '100%',
    height: '100%',
  },
  distTopPill: {
    position: 'absolute',
    top: 6,
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    maxWidth: '55%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  distTopText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
    flexShrink: 1,
  },
  saveBadge: {
    position: 'absolute',
    top: 6,
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
    zIndex: 2,
  },
  saveBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '900',
  },
  timeBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 5,
    backgroundColor: 'rgba(255,255,255,0.88)',
  },
  timeCluster: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    minWidth: 0,
  },
  greenWindow: {
    flex: 1,
    fontSize: 10,
    fontWeight: '700',
    color: GREEN_TIME,
    minWidth: 0,
  },
  detailBlock: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: Theme.colors.white,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopWidth: 0,
    borderColor: 'rgba(249, 115, 22, 0.35)',
    borderBottomLeftRadius: Theme.borderRadius.md,
    borderBottomRightRadius: Theme.borderRadius.md,
  },
  detailInner: {
    paddingHorizontal: Theme.spacing.sm,
    paddingTop: 6,
    paddingBottom: 8,
    gap: 1,
    position: 'relative',
    zIndex: 1,
  },
  storeName: {
    fontSize: 9,
    fontWeight: '700',
    color: Theme.colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  bagTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: Theme.colors.text.primary,
    letterSpacing: -0.2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
  },
  omrOnlyIcon: {
    width: 12,
    height: 10,
    tintColor: Theme.colors.primaryDark,
  },
  pricePay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  priceStrike: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  priceStrikeTilde: {
    fontSize: 11,
    fontWeight: '900',
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  priceStrikeAmount: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  priceAmountText: {
    fontSize: 12,
    fontWeight: '900',
    color: Theme.colors.primaryDark,
    fontVariant: ['tabular-nums'],
  },
  priceNow: {
    fontSize: 13,
    fontWeight: '800',
    color: Theme.colors.primaryDark,
    fontVariant: ['tabular-nums'],
  },
  stockReserveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    gap: 8,
    width: '100%',
  },
  detailsDistanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 1,
  },
  detailsDistanceText: {
    fontSize: 9,
    fontWeight: '800',
    color: GREEN_TIME,
    flexShrink: 1,
  },
  leftTopPill: {
    position: 'absolute',
    top: 6,
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    maxWidth: '55%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  leftTopText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
    flexShrink: 1,
  },
  distBottomPill: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 28,
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    gap: 4,
  },
  distBottomText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
    flexShrink: 1,
  },
  reserveInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  reserveInlineText: {
    fontSize: 9,
    fontWeight: '700',
    color: GREEN_TIME,
  },
});
