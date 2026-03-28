import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  StatusBar,
  ScrollView,
  Pressable,
  useWindowDimensions,
  Modal,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from '../constants/theme';
import BottomTabBar from '../components/BottomTabBar';
import DeliveryLocationBar from '../components/DeliveryLocationBar';
import OmrCurrency from '../components/OmrCurrency';
import {
  MOCK_STORES,
  CATEGORY_FILTERS,
  getMinBagPrice,
  getPickupDayLabelKey,
  hasPickupAvailableNow,
  type PartnerStore,
} from '../constants/mockData';
import { DISCOVER_COLLECTIONS } from '../constants/discoverCollections';
import { useLanguage } from '../contexts/LanguageContext';

const DISCOVER_HEADER_CONTENT_HEIGHT = 48;
/** Match store page — less inset from screen edge */
const SCREEN_HPAD = Theme.spacing.sm + Theme.spacing.xs;

function totalBoxesLeft(store: PartnerStore): number {
  return store.bags.reduce((sum, b) => sum + b.left, 0);
}

/** Pickup line for card: prefer a bag matching the “now” vs “later” section. */
function primaryPickupWindowFor(store: PartnerStore, section: 'now' | 'later'): string {
  if (section === 'now') {
    const bag = store.bags.find(
      (b) => getPickupDayLabelKey(b.pickupWindow) === 'discover.pickupToday'
    );
    return bag?.pickupWindow ?? store.bags[0]?.pickupWindow ?? '';
  }
  const bag = store.bags.find(
    (b) => getPickupDayLabelKey(b.pickupWindow) !== 'discover.pickupToday'
  );
  return bag?.pickupWindow ?? store.bags[0]?.pickupWindow ?? '';
}

function formatReviewCount(n: number): string {
  return n.toLocaleString('en-US');
}

function isPickupTimeGreen(section: 'now' | 'later', window: string): boolean {
  if (section !== 'now') return false;
  const s = window.toLowerCase();
  return s.includes('now') || s.includes('tonight') || s.includes('today');
}

type TranslateFn = (
  path: string,
  fallback?: string,
  vars?: Record<string, string | number>
) => string;

/** Case-insensitive match on English mock fields + current-locale `t()` strings. */
function storeMatchesSearchQuery(
  store: PartnerStore,
  query: string,
  t: TranslateFn
): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const haystack: string[] = [
    store.name,
    store.tagline,
    store.address,
    ...store.categories,
    ...store.bags.flatMap((b) => [b.title, b.blurb, b.pickupWindow]),
    t(`stores.${store.id}.name`, store.name),
    t(`stores.${store.id}.tagline`, store.tagline),
    ...store.categories.map((c) => t(`categories.${c}`, c)),
    ...store.bags.flatMap((b) => [
      t(`bags.${b.id}.title`, b.title),
      t(`bags.${b.id}.blurb`, b.blurb),
      t(`bags.${b.id}.pickup`, b.pickupWindow),
    ]),
  ];

  return haystack.some((s) => typeof s === 'string' && s.toLowerCase().includes(q));
}

/** Shorter card: smaller hero; detail block carries more of the card */
const STORE_IMAGE_HEIGHT = 112;
const LOGO_SIZE = 46;
const COLLECTION_POSTER_HEIGHT = 102;

type DiscoverScreenProps = {
  activeTab?: string;
  onTabPress?: (tabId: string) => void;
  onStorePress?: (storeId: string) => void;
  onProfilePress?: () => void;
  onNotificationsPress?: () => void;
  cartCount?: number;
};

export default function DiscoverScreen({
  activeTab,
  onTabPress,
  onStorePress,
  onProfilePress,
  onNotificationsPress,
  cartCount = 0,
}: DiscoverScreenProps) {
  const { width } = useWindowDimensions();
  const { t, isRtl } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const insets = useSafeAreaInsets();
  const gutter = SCREEN_HPAD;
  const headerTop = insets.top + Theme.spacing.sm;
  const collectionGap = Theme.spacing.sm;
  const collectionInner = width - gutter * 2;
  /** ~3.5 cards visible: slightly wider tiles */
  const collectionCardW = (collectionInner - 3 * collectionGap) / 3.5;
  const [collectionId, setCollectionId] = useState(DISCOVER_COLLECTIONS[0]?.id ?? 'explore');
  const [favoriteIds, setFavoriteIds] = useState<Record<string, boolean>>({});
  const [filterCategory, setFilterCategory] =
    useState<(typeof CATEGORY_FILTERS)[number]>('All');
  const [sortMode, setSortMode] = useState<'distance' | 'price' | 'rating'>('distance');
  const [priceBand, setPriceBand] = useState<'any' | 'under5' | 'under10'>('any');
  const [storesFilterModalVisible, setStoresFilterModalVisible] = useState(false);

  const toggleFavorite = useCallback((storeId: string) => {
    setFavoriteIds((prev) => ({ ...prev, [storeId]: !prev[storeId] }));
  }, []);

  const filtered = useMemo(() => {
    const def = DISCOVER_COLLECTIONS.find((c) => c.id === collectionId);
    return def != null ? def.filter(MOCK_STORES) : MOCK_STORES;
  }, [collectionId]);

  const processedStores = useMemo(() => {
    let list =
      filterCategory === 'All'
        ? [...filtered]
        : filtered.filter((s) => s.categories.includes(filterCategory));
    if (priceBand === 'under5') {
      list = list.filter((s) => getMinBagPrice(s) < 5);
    } else if (priceBand === 'under10') {
      list = list.filter((s) => getMinBagPrice(s) < 10);
    }
    const q = searchQuery.trim();
    if (q) {
      list = list.filter((s) => storeMatchesSearchQuery(s, q, t));
    }
    list.sort((a, b) => {
      if (sortMode === 'distance') return a.distanceKm - b.distanceKm;
      if (sortMode === 'price') return getMinBagPrice(a) - getMinBagPrice(b);
      return b.rating - a.rating;
    });
    return list;
  }, [filtered, filterCategory, sortMode, priceBand, searchQuery, t]);

  const availableNow = useMemo(
    () => processedStores.filter(hasPickupAvailableNow),
    [processedStores]
  );
  const availableLater = useMemo(
    () => processedStores.filter((s) => !hasPickupAvailableNow(s)),
    [processedStores]
  );

  const renderOneStore = (store: PartnerStore, section: 'now' | 'later') => {
    const primaryWindow = primaryPickupWindowFor(store, section);
    const timeGreen = isPickupTimeGreen(section, primaryWindow);
    const minPrice = getMinBagPrice(store);
    const fav = favoriteIds[store.id] === true;
    const branchesLabel =
      store.branchCount === 1
        ? t('discover.branchesOne')
        : t('discover.branchesMany', undefined, {
            count: String(store.branchCount),
          });
    return (
      <Pressable
        key={store.id}
        style={({ pressed }) => [styles.storeCard, pressed && styles.storeCardPressed]}
        onPress={() => onStorePress?.(store.id)}
        accessibilityRole="button"
        accessibilityLabel={t(`stores.${store.id}.name`, store.name)}
      >
        <View style={styles.cardOuter}>
          <View style={styles.imageBlock}>
            <Image source={store.image} style={styles.imageFill} contentFit="cover" />
            <LinearGradient
              colors={['rgba(0,0,0,0.12)', 'transparent']}
              style={StyleSheet.absoluteFillObject}
              pointerEvents="none"
            />
            <View style={styles.imageTopBar}>
              <View
                style={styles.badge}
                accessibilityLabel={t('discover.itemsLeftA11y', undefined, {
                  n: String(totalBoxesLeft(store)),
                })}
              >
                <Text style={styles.badgeCount}>{totalBoxesLeft(store)}</Text>
                <Text style={styles.badgeUnit}>{t('discover.unitsLeft')}</Text>
              </View>
              <Pressable
                style={styles.favBtn}
                onPress={() => toggleFavorite(store.id)}
                accessibilityRole="button"
                accessibilityLabel={fav ? t('discover.favoriteOn') : t('discover.favoriteOff')}
                hitSlop={10}
              >
                <Ionicons
                  name={fav ? 'heart' : 'heart-outline'}
                  size={22}
                  color={fav ? '#e11d48' : '#fff'}
                  style={styles.favIconShadow}
                />
              </Pressable>
            </View>
          </View>

          <View style={styles.detailBlock}>
            <View style={styles.detailMainRow}>
              <View style={styles.logoWrap}>
                <Image source={store.logo || store.image} style={styles.logoImg} contentFit="cover" />
              </View>
              <View style={styles.detailMidCol}>
                <Text style={styles.storeName} numberOfLines={1}>
                  {t(`stores.${store.id}.name`, store.name)}
                </Text>
                <Text
                  style={[styles.storeTagline, { textAlign: isRtl ? 'right' : 'left' }]}
                  numberOfLines={1}
                >
                  {t(`stores.${store.id}.tagline`, store.tagline)}
                </Text>
              </View>
            </View>
            <View style={styles.detailTimePriceRow}>
              <View style={styles.detailTimeLeft}>
                <Ionicons name="time-outline" size={15} color={Theme.colors.text.muted} />
                <Text
                  style={[styles.detailTimeText, timeGreen && styles.timeTextGreen]}
                  numberOfLines={1}
                >
                  {primaryWindow}
                </Text>
              </View>
              <View style={styles.detailPriceInline}>
                <Text style={styles.startsAtInline}>{t('discover.startsAtLabel')}</Text>
                <OmrCurrency
                  amount={minPrice}
                  variant="short"
                  iconSize={15}
                  iconTintColor={Theme.colors.primary}
                  textStyle={styles.priceAmountInline}
                  containerStyle={styles.priceOmrInline}
                />
              </View>
            </View>
            <View style={styles.metaRowOneLine}>
              <Ionicons name="navigate-outline" size={13} color={Theme.colors.text.muted} />
              <Text style={styles.metaLineText} numberOfLines={1}>
                {t('discover.kmAway', undefined, {
                  km: store.distanceKm.toFixed(1),
                })}
              </Text>
              <Text style={styles.metaLineDot}>·</Text>
              <Ionicons name="star" size={12} color={Theme.colors.primary} />
              <Text style={styles.metaLineText} numberOfLines={1}>
                {store.rating.toFixed(1)} ({formatReviewCount(store.reviewCount)})
              </Text>
              <Text style={styles.metaLineDot}>·</Text>
              <Text
                style={[styles.metaLineText, styles.metaLineTextShrink]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {branchesLabel}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

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
              minHeight: DISCOVER_HEADER_CONTENT_HEIGHT,
              paddingHorizontal: insets.left + gutter,
            },
          ]}
        >
          <View style={styles.locationSlot}>
            <DeliveryLocationBar />
          </View>
          <View style={styles.topRightIcons}>
            <Pressable
              style={styles.iconBtn}
              onPress={onNotificationsPress}
              accessibilityRole="button"
              accessibilityLabel={t('home.notif')}
            >
              <Ionicons name="notifications-outline" size={24} color={Theme.colors.primary} />
            </Pressable>
            <Pressable
              style={styles.iconBtn}
              onPress={() => onTabPress?.('chat')}
              accessibilityRole="button"
              accessibilityLabel={t('home.chat')}
            >
              <Ionicons name="chatbubble-outline" size={24} color={Theme.colors.primary} />
            </Pressable>
            <Pressable
              style={styles.iconBtn}
              onPress={onProfilePress}
              accessibilityRole="button"
              accessibilityLabel={t('home.profile')}
            >
              <Ionicons name="person-circle-outline" size={26} color={Theme.colors.primary} />
            </Pressable>
          </View>
        </View>
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={Theme.colors.text.muted} />
            <TextInput
              style={[styles.searchInput, { textAlign: isRtl ? 'right' : 'left' }]}
              placeholder={t('discover.searchPh')}
              placeholderTextColor={Theme.colors.text.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
              autoCorrect={false}
              autoCapitalize="none"
              clearButtonMode="never"
              accessibilityLabel={t('discover.searchPh')}
            />
            {searchQuery.length > 0 ? (
              <Pressable
                onPress={() => setSearchQuery('')}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel={t('discover.clearSearch')}
              >
                <Ionicons name="close-circle" size={22} color={Theme.colors.text.muted} />
              </Pressable>
            ) : null}
          </View>
        </View>

        <View style={styles.collectionHeadingBlock}>
          <Text style={styles.collectionSectionHeading}>{t('discover.featuredCollections')}</Text>
          <View style={styles.collectionHeadingBar} />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.collectionsRow, { gap: collectionGap }]}
        >
          {DISCOVER_COLLECTIONS.map((col) => {
            const on = collectionId === col.id;
            return (
              <Pressable
                key={col.id}
                style={[
                  styles.collectionPosterOuter,
                  { width: collectionCardW },
                  on && styles.collectionPosterOuterSelected,
                ]}
                onPress={() => setCollectionId(col.id)}
                accessibilityRole="button"
                accessibilityState={{ selected: on }}
                accessibilityLabel={t(col.titleKey)}
              >
                <View style={[styles.collectionPoster, { height: COLLECTION_POSTER_HEIGHT }]}>
                  <Image source={col.image} style={styles.collectionPosterImage} contentFit="cover" />
                  <LinearGradient
                    colors={[
                      'rgba(249, 115, 22, 0.28)',
                      'rgba(0,0,0,0.02)',
                      'rgba(0,0,0,0.78)',
                    ]}
                    locations={[0, 0.35, 1]}
                    style={StyleSheet.absoluteFillObject}
                    pointerEvents="none"
                  />
                  {col.pillIcon != null ? (
                    <View
                      style={[
                        styles.collectionPill,
                        styles.collectionPillIconWrap,
                        isRtl ? styles.collectionPillStart : styles.collectionPillEnd,
                      ]}
                      accessible
                      accessibilityLabel={col.pillKey != null ? t(col.pillKey) : undefined}
                    >
                      <Ionicons
                        name={col.pillIcon as 'pricetag'}
                        size={17}
                        color="#fff"
                      />
                    </View>
                  ) : col.pillKey != null ? (
                    <View
                      style={[
                        styles.collectionPill,
                        styles.collectionPillTextMax,
                        isRtl ? styles.collectionPillStart : styles.collectionPillEnd,
                      ]}
                    >
                      <Text style={styles.collectionPillText}>{t(col.pillKey)}</Text>
                    </View>
                  ) : null}
                  <View style={styles.collectionPosterTitleWrap} pointerEvents="none">
                    {on ? <View style={styles.collectionPosterTitleAccent} /> : null}
                    <Text
                      style={[styles.collectionPosterTitle, on && styles.collectionPosterTitleOn]}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {t(col.titleKey)}
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.allStoresHeadingRow}>
          <Text style={styles.allStoresTitle} numberOfLines={1}>
            {t('discover.allStores')}
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.allStoresFilterIconBtn,
              pressed && styles.allStoresFilterIconBtnPressed,
            ]}
            onPress={() => setStoresFilterModalVisible(true)}
            accessibilityRole="button"
            accessibilityLabel={t('discover.filtersSheetTitle')}
          >
            <Ionicons name="options-outline" size={26} color={Theme.colors.primary} />
          </Pressable>
        </View>
        <Text style={styles.sub}>
          {t('discover.storesSubtitle', undefined, {
            count: String(processedStores.length),
          })}
        </Text>

        <View style={styles.storeList}>
          {processedStores.length === 0 ? (
            <Text style={styles.emptySub}>
              {searchQuery.trim()
                ? t('discover.noSearchResults', undefined, { q: searchQuery.trim() })
                : t('discover.emptyFiltered')}
            </Text>
          ) : (
            <>
              {availableNow.map((store) => renderOneStore(store, 'now'))}
              {availableLater.map((store) => renderOneStore(store, 'later'))}
            </>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={storesFilterModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setStoresFilterModalVisible(false)}
      >
        <View style={styles.filtersModalRoot}>
          <Pressable
            style={styles.filtersModalBackdrop}
            onPress={() => setStoresFilterModalVisible(false)}
            accessibilityRole="button"
            accessibilityLabel={t('common.cancel')}
          />
          <View style={styles.filtersModalSheetWrap} pointerEvents="box-none">
            <View
              style={[styles.filtersModalSheet, { paddingBottom: Math.max(insets.bottom, 20) }]}
            >
            <View style={styles.filtersModalGrabber} />
            <View style={styles.filtersModalHeader}>
              <Text style={styles.filtersModalTitle}>{t('discover.filtersSheetTitle')}</Text>
              <Pressable
                onPress={() => setStoresFilterModalVisible(false)}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel={t('common.cancel')}
              >
                <Ionicons name="close" size={26} color={Theme.colors.text.muted} />
              </Pressable>
            </View>
            <ScrollView
              style={styles.filtersModalScroll}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.filtersSectionLabel}>{t('discover.sortByTitle')}</Text>
              {(
                [
                  { mode: 'distance' as const, labelKey: 'discover.sortDistance' },
                  { mode: 'price' as const, labelKey: 'discover.sortPrice' },
                  { mode: 'rating' as const, labelKey: 'discover.sortRating' },
                ] as const
              ).map(({ mode, labelKey }) => {
                const sel = sortMode === mode;
                return (
                  <Pressable
                    key={mode}
                    style={styles.filtersOptionRow}
                    onPress={() => setSortMode(mode)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: sel }}
                  >
                    <Text
                      style={[styles.filtersOptionText, sel && styles.filtersOptionTextSelected]}
                    >
                      {t(labelKey)}
                    </Text>
                    {sel ? (
                      <Ionicons name="checkmark-circle" size={22} color={Theme.colors.primary} />
                    ) : (
                      <View style={styles.filtersOptionSpacer} />
                    )}
                  </Pressable>
                );
              })}

              <Text style={[styles.filtersSectionLabel, styles.filtersSectionLabelSpaced]}>
                {t('discover.cuisineTitle')}
              </Text>
              {CATEGORY_FILTERS.map((cat) => {
                const sel = filterCategory === cat;
                return (
                  <Pressable
                    key={cat}
                    style={styles.filtersOptionRow}
                    onPress={() => setFilterCategory(cat)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: sel }}
                  >
                    <Text
                      style={[styles.filtersOptionText, sel && styles.filtersOptionTextSelected]}
                    >
                      {t(`categories.${cat}`, cat)}
                    </Text>
                    {sel ? (
                      <Ionicons name="checkmark-circle" size={22} color={Theme.colors.primary} />
                    ) : (
                      <View style={styles.filtersOptionSpacer} />
                    )}
                  </Pressable>
                );
              })}

              <Text style={[styles.filtersSectionLabel, styles.filtersSectionLabelSpaced]}>
                {t('discover.priceTitle')}
              </Text>
              {(
                [
                  { band: 'any' as const, labelKey: 'discover.priceAny' },
                  { band: 'under5' as const, labelKey: 'discover.priceUnder5' },
                  { band: 'under10' as const, labelKey: 'discover.priceUnder10' },
                ] as const
              ).map(({ band, labelKey }) => {
                const sel = priceBand === band;
                return (
                  <Pressable
                    key={band}
                    style={styles.filtersOptionRow}
                    onPress={() => setPriceBand(band)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: sel }}
                  >
                    <Text
                      style={[styles.filtersOptionText, sel && styles.filtersOptionTextSelected]}
                    >
                      {t(labelKey)}
                    </Text>
                    {sel ? (
                      <Ionicons name="checkmark-circle" size={22} color={Theme.colors.primary} />
                    ) : (
                      <View style={styles.filtersOptionSpacer} />
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
            </View>
          </View>
        </View>
      </Modal>

      <BottomTabBar
        activeTab={activeTab || 'discover'}
        onTabPress={onTabPress || (() => {})}
        cartCount={cartCount}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
    marginBottom: Theme.spacing.sm,
  },
  locationSlot: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
  },
  topRightIcons: {
    flexDirection: 'row',
    gap: Theme.spacing.xs,
    alignItems: 'center',
    flexShrink: 0,
  },
  iconBtn: {
    padding: Theme.spacing.xs,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  searchContainer: {
    paddingHorizontal: SCREEN_HPAD,
    marginBottom: Theme.spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
    backgroundColor: Theme.colors.white,
    borderRadius: Theme.borderRadius.lg,
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 0,
    fontSize: 14,
    fontWeight: '500',
    color: Theme.colors.text.primary,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Theme.colors.text.primary,
    paddingHorizontal: SCREEN_HPAD,
    marginBottom: Theme.spacing.sm,
  },
  sub: {
    fontSize: 13,
    color: Theme.colors.text.muted,
    paddingHorizontal: SCREEN_HPAD,
    marginBottom: Theme.spacing.md,
  },
  allStoresHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Theme.spacing.md,
    paddingHorizontal: SCREEN_HPAD,
    marginBottom: Theme.spacing.xs,
  },
  allStoresTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: Theme.colors.text.primary,
    minWidth: 0,
  },
  allStoresFilterIconBtn: {
    padding: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.md,
  },
  allStoresFilterIconBtnPressed: {
    opacity: 0.72,
  },
  filtersModalRoot: {
    flex: 1,
  },
  filtersModalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  filtersModalSheetWrap: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  filtersModalSheet: {
    backgroundColor: Theme.colors.white,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingTop: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.lg,
    maxHeight: '72%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 16,
  },
  filtersModalGrabber: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.12)',
    marginBottom: Theme.spacing.md,
  },
  filtersModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.md,
  },
  filtersModalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Theme.colors.text.primary,
  },
  filtersModalScroll: {
    marginBottom: Theme.spacing.sm,
  },
  filtersSectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: Theme.colors.text.muted,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: Theme.spacing.sm,
  },
  filtersSectionLabelSpaced: {
    marginTop: Theme.spacing.lg,
  },
  filtersOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  filtersOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.colors.text.primary,
    flex: 1,
  },
  filtersOptionTextSelected: {
    color: Theme.colors.primaryDark,
    fontWeight: '700',
  },
  filtersOptionSpacer: {
    width: 22,
    height: 22,
  },
  emptySub: {
    fontSize: 13,
    color: Theme.colors.text.muted,
    lineHeight: 19,
    marginBottom: Theme.spacing.sm,
  },
  collectionHeadingBlock: {
    paddingHorizontal: SCREEN_HPAD,
    marginBottom: Theme.spacing.sm,
  },
  collectionSectionHeading: {
    fontSize: 20,
    fontWeight: '700',
    color: Theme.colors.text.primary,
    marginBottom: 8,
  },
  collectionHeadingBar: {
    width: 44,
    height: 3,
    borderRadius: 2,
    backgroundColor: Theme.colors.primary,
    opacity: 0.85,
  },
  collectionsRow: {
    paddingHorizontal: SCREEN_HPAD,
    paddingBottom: Theme.spacing.lg,
  },
  collectionPosterOuter: {
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: '#111',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  collectionPosterOuterSelected: {
    borderWidth: 2.5,
    borderColor: Theme.colors.primary,
    shadowColor: Theme.colors.primary,
    shadowOpacity: 0.28,
  },
  collectionPoster: {
    width: '100%',
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  collectionPosterImage: {
    ...StyleSheet.absoluteFillObject,
  },
  collectionPill: {
    position: 'absolute',
    top: 6,
    paddingVertical: 4,
    paddingHorizontal: 7,
    borderRadius: Theme.borderRadius.sm,
    backgroundColor: Theme.colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  collectionPillTextMax: {
    maxWidth: '78%',
  },
  collectionPillIconWrap: {
    paddingVertical: 7,
    paddingHorizontal: 7,
    borderRadius: Theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  collectionPillEnd: {
    right: 6,
    left: undefined,
  },
  collectionPillStart: {
    left: 6,
    right: undefined,
  },
  collectionPillText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.25,
  },
  collectionPosterTitleWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 8,
    paddingBottom: 8,
    paddingTop: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
  },
  collectionPosterTitleAccent: {
    width: 2,
    height: 22,
    borderRadius: 2,
    backgroundColor: Theme.colors.primary,
    marginBottom: 2,
  },
  collectionPosterTitle: {
    flex: 1,
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
    lineHeight: 14,
    textShadowColor: 'rgba(0,0,0,0.45)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  collectionPosterTitleOn: {
    fontWeight: '800',
    color: '#fff7ed',
  },
  storeList: {
    paddingHorizontal: SCREEN_HPAD,
    gap: Theme.spacing.md,
  },
  storeCard: {
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  storeCardPressed: {
    opacity: 0.96,
  },
  cardOuter: {
    borderRadius: Theme.borderRadius.md,
    overflow: 'hidden',
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.2)',
  },
  imageBlock: {
    height: STORE_IMAGE_HEIGHT,
    width: '100%',
    backgroundColor: '#eee',
    position: 'relative',
  },
  imageFill: {
    width: '100%',
    height: '100%',
  },
  imageTopBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 8,
    zIndex: 2,
  },
  badge: {
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(249, 115, 22, 0.95)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: Theme.borderRadius.sm,
  },
  badgeCount: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  badgeUnit: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: 8,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginTop: 1,
  },
  favBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.38)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favIconShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 2,
  },
  detailBlock: {
    paddingHorizontal: Theme.spacing.sm + 2,
    paddingTop: Theme.spacing.sm,
    paddingBottom: Theme.spacing.sm,
    backgroundColor: Theme.colors.white,
  },
  detailMainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Theme.spacing.sm,
    marginBottom: Theme.spacing.xs,
  },
  detailTimePriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: Theme.spacing.xs,
  },
  detailTimeLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minWidth: 0,
  },
  detailTimeText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: Theme.colors.text.primary,
  },
  detailPriceInline: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
    gap: 6,
    maxWidth: '48%',
  },
  startsAtInline: {
    fontSize: 11,
    fontWeight: '600',
    color: Theme.colors.text.muted,
  },
  priceAmountInline: {
    fontSize: 15,
    fontWeight: '800',
    color: Theme.colors.primary,
    fontVariant: ['tabular-nums'],
  },
  priceOmrInline: {
    flexShrink: 0,
  },
  detailMidCol: {
    flex: 1,
    minWidth: 0,
  },
  timeTextGreen: {
    color: '#16a34a',
    fontWeight: '700',
  },
  storeTagline: {
    fontSize: 11,
    fontWeight: '500',
    color: Theme.colors.text.muted,
    lineHeight: 14,
    marginTop: 1,
    marginBottom: 2,
    width: '100%',
  },
  storeName: {
    fontSize: 16,
    fontWeight: '800',
    color: Theme.colors.text.primary,
    marginBottom: 1,
  },
  logoWrap: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: 11,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    flexShrink: 0,
  },
  logoImg: {
    width: '100%',
    height: '100%',
  },
  metaRowOneLine: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
    gap: 5,
    paddingTop: 6,
    marginTop: 1,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  metaLineText: {
    fontSize: 11,
    fontWeight: '600',
    color: Theme.colors.text.primary,
  },
  metaLineTextShrink: {
    flexShrink: 1,
    minWidth: 0,
  },
  metaLineDot: {
    fontSize: 11,
    fontWeight: '700',
    color: Theme.colors.text.muted,
  },
});
