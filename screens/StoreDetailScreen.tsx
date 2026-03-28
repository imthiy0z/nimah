import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  ScrollView,
  Pressable,
  Dimensions,
  Linking,
} from 'react-native';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../constants/theme';
import {
  getStoreById,
  getStorePickupDayKey,
  getPickupDayLabelKey,
  type PartnerStore,
  type RescueBag,
} from '../constants/mockData';
import BottomTabBar from '../components/BottomTabBar';
import ReserveBagModal from '../components/ReserveBagModal';
import { useLanguage } from '../contexts/LanguageContext';
import OmrCurrency from '../components/OmrCurrency';

const { width } = Dimensions.get('window');
const HERO_HEIGHT = 200;
/** Tighter inset from screen edge (cards + store header align). */
const SCREEN_HPAD = Theme.spacing.sm + Theme.spacing.xs;

/** Readable body text on white (theme `text.secondary` is reserved for dark surfaces). */
const CARD = {
  ink: '#1E293B',
  body: '#64748B',
  muted: '#94A3B8',
  line: 'rgba(30, 41, 59, 0.08)',
  surface: '#FFFFFF',
  pageBg: '#F1F5F9',
  discountBg: '#0F766E',
} as const;

type StoreDetailScreenProps = {
  storeId: string;
  onBack?: () => void;
  onAddToCart?: (store: PartnerStore, bag: RescueBag, qty: number) => void;
  activeTab?: string;
  onTabPress?: (tabId: string) => void;
  cartCount?: number;
};

export default function StoreDetailScreen({
  storeId,
  onBack,
  onAddToCart,
  activeTab,
  onTabPress,
  cartCount = 0,
}: StoreDetailScreenProps) {
  const { t, rtlMirror, isRtl } = useLanguage();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBag, setSelectedBag] = useState<RescueBag | null>(null);

  const store = getStoreById(storeId);

  if (!store) {
    return (
      <View style={styles.miss}>
        <Text style={styles.missText}>{t('storeDetail.notFound')}</Text>
        <Pressable onPress={onBack} style={styles.backLink}>
          <Text style={styles.backLinkText}>{t('storeDetail.goBack')}</Text>
        </Pressable>
      </View>
    );
  }

  const getDiscountPercent = (price: number, retail: number) => {
    if (!retail || retail <= 0) return 0;
    return Math.round((1 - price / retail) * 100);
  };

  const pickupDayKey = getStorePickupDayKey(store);
  const bagsForPickupDay = store.bags.filter(
    (b) => getPickupDayLabelKey(b.pickupWindow) === pickupDayKey
  );
  const pickupSourceBags = bagsForPickupDay.length > 0 ? bagsForPickupDay : store.bags;
  const pickupWindowLabels = [
    ...new Set(pickupSourceBags.map((b) => t(`bags.${b.id}.pickup`, b.pickupWindow))),
  ];
  const pickupTimeDisplay = pickupWindowLabels.slice(0, 2).join(' · ');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{ paddingBottom: 130 }}
      >
        {/* Header Hero Image */}
        <View style={styles.heroWrap}>
          <Image source={store.image} style={styles.heroImg} contentFit="cover" />
          <LinearGradient
            colors={['rgba(0,0,0,0.6)', 'transparent']}
            style={styles.heroTopGrad}
            pointerEvents="none"
          />
          <Pressable
            style={styles.backBtn}
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <BlurView intensity={40} tint="dark" style={styles.backBlur}>
              <Ionicons name="arrow-back" size={22} color="#fff" style={rtlMirror} />
            </BlurView>
          </Pressable>
        </View>

        {/* Store Info Card (Overlapping Hero) */}
        <View style={styles.infoCard}>
          {/* Prominent Logo Overlapping Header */}
          <View style={styles.logoContainer}>
            <Image source={store.logo || store.image} style={styles.logoImg} contentFit="cover" />
          </View>

          <View style={styles.infoContent}>
            <Text style={styles.storeName}>{t(`stores.${store.id}.name`, store.name)}</Text>
            <Text style={styles.tagline}>{t(`stores.${store.id}.tagline`, store.tagline)}</Text>

            {/* Meta Stats Row */}
            <View style={styles.statsRow}>
              <View style={styles.statPill}>
                <Ionicons name="star" size={15} color="#FFB800" />
                <Text style={styles.statText}>
                  {t('storeDetail.ratingLine', undefined, {
                    rating: String(store.rating),
                    count: String(store.reviewCount),
                  })}
                </Text>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statPill}>
                <Ionicons name="location" size={15} color={Theme.colors.primary} />
                <Text style={styles.statText}>
                  {store.distanceKm ? `${store.distanceKm} km` : '1.2 km'}
                </Text>
              </View>

              {store.instagramUrl && (
                <>
                  <View style={styles.statDivider} />
                  <Pressable
                    style={styles.statPill}
                    onPress={() => Linking.openURL(store.instagramUrl!)}
                    accessibilityRole="link"
                    accessibilityLabel={t('storeDetail.openInstagram')}
                  >
                    <Ionicons name="logo-instagram" size={15} color="#E1306C" />
                    <Text style={styles.statText}>{t('storeDetail.openInstagram')}</Text>
                  </Pressable>
                </>
              )}
            </View>

            {/* Available time — plain text, no tinted box */}
            <View style={styles.availableTimeBlock}>
              <Ionicons name="time-outline" size={22} color={Theme.colors.primary} />
              <View style={styles.availableTimeTextCol}>
                <Text style={styles.availableTimeTitle}>{t('storeDetail.availableTime')}</Text>
                <Text style={styles.availableTimeValue}>{pickupTimeDisplay}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Rescue box cards */}
        <View style={styles.itemsSection}>
          <View style={styles.itemsList}>
            {store.bags.map((bag) => {
              const discount = getDiscountPercent(bag.price, bag.retailValue);
              return (
                <Pressable
                  key={bag.id}
                  style={({ pressed }) => [
                    styles.boxCard,
                    isRtl && styles.boxCardRtl,
                    pressed && styles.boxCardPressed,
                  ]}
                  onPress={() => {
                    setSelectedBag(bag);
                    setModalVisible(true);
                  }}
                >
                  <View style={styles.boxMainCol}>
                    <View>
                      <Text style={styles.boxTitle} numberOfLines={2}>
                        {t(`bags.${bag.id}.title`, bag.title)}
                      </Text>
                      <Text style={styles.boxBlurb} numberOfLines={2}>
                        {t(`bags.${bag.id}.blurb`, bag.blurb)}
                      </Text>
                    </View>
                    <View style={styles.boxPriceBlock}>
                      <OmrCurrency
                        amount={bag.price}
                        variant="full"
                        textStyle={styles.boxPriceNow}
                        iconSize={16}
                        iconTintColor={Theme.colors.primaryDark}
                      />
                      <View style={styles.boxWasRow}>
                        <Text style={styles.boxWasTilde}>~</Text>
                        <OmrCurrency
                          amount={bag.retailValue}
                          variant="short"
                          textStyle={styles.boxWasAmount}
                          iconSize={12}
                          iconTintColor={CARD.muted}
                        />
                      </View>
                    </View>
                  </View>

                  <View style={styles.boxRightCol}>
                    <View style={styles.boxImageWrap}>
                      <Image source={bag.image} style={styles.boxThumbImg} contentFit="cover" />
                      <LinearGradient
                        colors={['transparent', 'rgba(15, 23, 42, 0.4)']}
                        style={styles.boxThumbGrad}
                        pointerEvents="none"
                      />
                      {discount > 0 ? (
                        <View style={styles.boxDiscount}>
                          <Ionicons name="pricetag" size={10} color="#ECFDF5" />
                          <Text style={styles.boxDiscountText}>
                            {t('storeDetail.savePercent', undefined, { n: String(discount) })}
                          </Text>
                        </View>
                      ) : null}
                      <View style={styles.boxStockPill}>
                        <Ionicons name="cube-outline" size={11} color={CARD.ink} />
                        <Text style={styles.boxStockText}>
                          {t('storeDetail.leftCount', undefined, { n: String(bag.left) })}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.boxReserveBtn}>
                      <Text style={styles.boxReserveTxt}>Reserve</Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Store About / Extra Info */}
        <View style={styles.aboutSection}>
          <Text style={styles.aboutTitle}>About {t(`stores.${store.id}.name`, store.name)}</Text>
          <View style={styles.aboutCard}>
             <View style={styles.aboutRow}>
                <View style={styles.aboutIconWrap}>
                  <Ionicons name="location" size={20} color={CARD.body} />
                </View>
                <Text style={styles.aboutText}>{t(`stores.${store.id}.address`, store.address)}</Text>
             </View>
             <View style={styles.aboutDivider} />
             <View style={styles.aboutRow}>
                <View style={styles.aboutIconWrap}>
                  <Ionicons name="leaf" size={20} color={Theme.colors.whatsapp} />
                </View>
                <Text style={styles.aboutText}>Eco-friendly packaging. Bring your own bag to reduce waste!</Text>
             </View>
          </View>
        </View>

      </ScrollView>

      <BottomTabBar
        activeTab={activeTab || 'discover'}
        onTabPress={onTabPress || (() => {})}
        cartCount={cartCount}
      />

      <ReserveBagModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedBag(null);
        }}
        storeName={t(`stores.${store.id}.name`, store.name)}
        bag={selectedBag}
        mode="cart"
        onConfirmQty={(qty) => {
          if (selectedBag) {
            onAddToCart?.(store, selectedBag, qty);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CARD.pageBg,
  },
  miss: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.xl,
  },
  missText: {
    fontSize: 16,
    color: Theme.colors.text.muted,
    marginBottom: Theme.spacing.md,
  },
  backLink: {
    padding: Theme.spacing.md,
  },
  backLinkText: {
    color: Theme.colors.primary,
    fontWeight: '600',
  },
  heroWrap: {
    height: HERO_HEIGHT,
    width: width,
    position: 'relative',
    backgroundColor: '#E5E7EB',
  },
  heroImg: {
    ...StyleSheet.absoluteFillObject,
  },
  heroTopGrad: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  backBtn: {
    position: 'absolute',
    top: 52,
    left: SCREEN_HPAD,
    zIndex: 10,
  },
  backBlur: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  infoCard: {
    marginTop: -24,
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 0,
    paddingHorizontal: SCREEN_HPAD,
    paddingBottom: Theme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  logoContainer: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#fff',
    alignSelf: 'center',
    marginTop: -43,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 4,
    borderColor: '#fff',
    overflow: 'hidden',
  },
  logoImg: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F0F0F0',
  },
  infoContent: {
    alignItems: 'center',
  },
  storeName: {
    fontSize: 28,
    fontWeight: '800',
    color: Theme.colors.text.primary,
    marginBottom: 6,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 15,
    color: CARD.body,
    lineHeight: 22,
    marginBottom: Theme.spacing.md,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: Theme.spacing.lg,
    gap: 8,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    fontWeight: '600',
    color: Theme.colors.text.primary,
  },
  statDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 4,
  },
  availableTimeBlock: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    width: '100%',
    paddingTop: 4,
    paddingBottom: 2,
  },
  availableTimeTextCol: {
    flex: 1,
    minWidth: 0,
  },
  availableTimeTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: CARD.ink,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  availableTimeValue: {
    fontSize: 14,
    fontWeight: '600',
    color: CARD.body,
    lineHeight: 20,
  },
  itemsSection: {
    paddingHorizontal: SCREEN_HPAD,
    paddingTop: Theme.spacing.md,
    paddingBottom: 24,
  },
  itemsList: {
    gap: 10,
  },
  boxCard: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: CARD.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: CARD.line,
    overflow: 'hidden',
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  boxCardRtl: {
    flexDirection: 'row-reverse',
  },
  boxCardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.998 }],
  },
  boxMainCol: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'space-between',
    paddingVertical: 11,
    paddingLeft: 12,
    paddingRight: 8,
  },
  boxRightCol: {
    width: 104,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 10,
    paddingLeft: 4,
    gap: 8,
    alignItems: 'stretch',
  },
  boxImageWrap: {
    width: '100%',
    height: 88,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
    position: 'relative',
    overflow: 'hidden',
  },
  boxThumbImg: {
    ...StyleSheet.absoluteFillObject,
  },
  boxThumbGrad: {
    ...StyleSheet.absoluteFillObject,
  },
  boxDiscount: {
    position: 'absolute',
    top: 6,
    left: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: CARD.discountBg,
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 8,
  },
  boxDiscountText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: 0.2,
  },
  boxStockPill: {
    position: 'absolute',
    left: 4,
    right: 4,
    bottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    paddingVertical: 4,
    paddingHorizontal: 7,
    borderRadius: 8,
  },
  boxStockText: {
    fontSize: 10,
    fontWeight: '700',
    color: CARD.ink,
  },
  boxTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: CARD.ink,
    lineHeight: 20,
    marginBottom: 3,
    letterSpacing: -0.2,
  },
  boxBlurb: {
    fontSize: 12,
    color: CARD.body,
    lineHeight: 16,
    marginTop: 2,
  },
  boxPriceBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  boxPriceNow: {
    fontSize: 17,
    fontWeight: '800',
    color: Theme.colors.primaryDark,
    fontVariant: ['tabular-nums'],
  },
  boxWasRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  boxWasTilde: {
    fontSize: 11,
    fontWeight: '600',
    color: CARD.muted,
    textDecorationLine: 'line-through',
  },
  boxWasAmount: {
    fontSize: 11,
    fontWeight: '600',
    color: CARD.muted,
    textDecorationLine: 'line-through',
  },
  boxReserveBtn: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.primary,
    paddingVertical: 9,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  boxReserveTxt: {
    fontSize: 13,
    fontWeight: '800',
    color: '#fff',
  },
  aboutSection: {
    paddingHorizontal: SCREEN_HPAD,
    paddingBottom: 40,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: CARD.ink,
    marginBottom: 12,
  },
  aboutCard: {
    backgroundColor: CARD.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: CARD.line,
  },
  aboutRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  aboutIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aboutText: {
    flex: 1,
    fontSize: 14,
    color: CARD.body,
    lineHeight: 20,
    marginTop: 6,
  },
  aboutDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 12,
    marginLeft: 44,
  },
});
