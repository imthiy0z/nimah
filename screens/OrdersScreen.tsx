import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  ScrollView,
  Pressable,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from '../constants/theme';
import BottomTabBar from '../components/BottomTabBar';
import DeliveryLocationBar from '../components/DeliveryLocationBar';
import OrdersDeliveryMap from '../components/OrdersDeliveryMap';
import {
  DELIVERY,
  DELIVERY_TIMELINE_STEPS,
  MOCK_ORDERS,
  MOCK_STORES,
  getStoreById,
  getBagImage,
} from '../constants/mockData';
import { useLanguage } from '../contexts/LanguageContext';
import OmrCurrency from '../components/OmrCurrency';

const DRIVER_AVATAR = require('../assets/onboarding-image.png');
const PAD = Theme.spacing.lg;
const LINE = 'rgba(42, 63, 78, 0.1)';

type OrdersScreenProps = {
  activeTab?: string;
  onTabPress?: (tabId: string) => void;
  cartCount?: number;
  onProfilePress?: () => void;
  onNotificationsPress?: () => void;
};

function interpolateRoute(
  from: { latitude: number; longitude: number },
  to: { latitude: number; longitude: number },
  alpha: number
) {
  return {
    latitude: from.latitude + (to.latitude - from.latitude) * alpha,
    longitude: from.longitude + (to.longitude - from.longitude) * alpha,
  };
}

export default function OrdersScreen({
  activeTab,
  onTabPress,
  cartCount = 0,
  onProfilePress,
  onNotificationsPress,
}: OrdersScreenProps) {
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [locLoading, setLocLoading] = useState(true);

  const upcoming = MOCK_ORDERS.filter((o) => o.status === 'upcoming');
  const past = MOCK_ORDERS.filter((o) => o.status === 'completed');
  const active = upcoming[0];

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          return;
        }
        let pos: Location.LocationObject | null = null;
        try {
          pos = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
        } catch {
          pos = null;
        }
        if (!pos) {
          pos = await Location.getLastKnownPositionAsync();
        }
        if (pos) setLocation(pos);
      } finally {
        setLocLoading(false);
      }
    })();
  }, []);

  const fallbackLat = MOCK_STORES[0]?.latitude ?? 23.6;
  const fallbackLng = MOCK_STORES[0]?.longitude ?? 58.55;

  const { destination, store, courier, showUserLocation } = useMemo(() => {
    const destLat = location?.coords.latitude ?? fallbackLat;
    const destLng = location?.coords.longitude ?? fallbackLng;
    const destinationCoord = { latitude: destLat, longitude: destLng };
    const storeCoord = {
      latitude: destLat + 0.0084,
      longitude: destLng + 0.0048,
    };
    const courierCoord = interpolateRoute(
      storeCoord,
      destinationCoord,
      DELIVERY.routeProgress
    );
    return {
      destination: destinationCoord,
      store: storeCoord,
      courier: courierCoord,
      showUserLocation: !!location,
    };
  }, [location, fallbackLat, fallbackLng]);

  const activeStore = active ? getStoreById(active.storeId) : undefined;
  const bagImage =
    activeStore != null ? getBagImage(activeStore, active.bagId) : undefined;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollInner}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, { paddingTop: insets.top + Theme.spacing.sm }]}>
          <View style={styles.topHeaderRow}>
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
                style={styles.profileBtn}
                onPress={onProfilePress}
                accessibilityRole="button"
                accessibilityLabel={t('home.profile')}
              >
                <Ionicons name="person-circle-outline" size={26} color={Theme.colors.primary} />
              </Pressable>
            </View>
          </View>
          <Text style={styles.title}>{t('orders.title')}</Text>
          <Text style={styles.subtitle}>{t('orders.subtitle')}</Text>
        </View>

        {active && (
          <View style={styles.activeSection}>
            <View style={styles.activeHeaderRow}>
              <View style={styles.pill}>
                <View style={styles.pulseDot} />
                <Text style={styles.pillText}>{t('orders.inProgress')}</Text>
              </View>
              <Text style={styles.activeEta}>
                {t('orders.eta', undefined, { min: String(DELIVERY.etaMinutes) })}
              </Text>
            </View>

            <OrdersDeliveryMap
              store={store}
              destination={destination}
              courier={courier}
              showUserLocation={showUserLocation}
              loading={locLoading}
              etaMinutes={DELIVERY.etaMinutes}
              driverName={t(
                `delivery.driver.${DELIVERY.driverNameKey}`,
                DELIVERY.driverName
              )}
              driverAvatar={DRIVER_AVATAR}
            />

            <View style={styles.divider} />

            <Text style={styles.kicker}>{t('orders.thisOrder')}</Text>
            <View style={styles.orderSummaryRow}>
              {bagImage != null ? (
                <Image source={bagImage} style={styles.summaryThumb} contentFit="cover" />
              ) : (
                <View style={[styles.summaryThumb, styles.summaryThumbPh]}>
                  <Ionicons name="fast-food-outline" size={24} color={Theme.colors.text.muted} />
                </View>
              )}
              <View style={styles.summaryTextCol}>
                <Text style={styles.summaryTitle}>
                  {t(`bags.${active.bagId}.title`, active.bagTitle)}
                </Text>
                <Text style={styles.summaryStore}>
                  {t(`stores.${active.storeId}.name`, active.storeName)}
                </Text>
                <Text style={styles.summaryPickup}>
                  {t(`bags.${active.bagId}.pickup`, active.pickupWindow)}
                </Text>
                <OmrCurrency
                  amount={active.price}
                  variant="full"
                  textStyle={styles.summaryPrice}
                  iconSize={15}
                  iconTintColor={Theme.colors.primaryDark}
                />
              </View>
            </View>

            <View style={styles.divider} />

            <Text style={styles.timelineKicker}>{t('orders.deliveryProgress')}</Text>
            {DELIVERY_TIMELINE_STEPS.map((step, index) => (
              <View key={step.key}>
                <View style={styles.timelineRow}>
                  <View style={styles.timelineRail}>
                    <View
                      style={[
                        styles.timelineDot,
                        step.done && styles.timelineDotDone,
                        step.active && styles.timelineDotActive,
                      ]}
                    >
                      {step.done ? (
                        <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                      ) : (
                        <View style={styles.timelineDotInner} />
                      )}
                    </View>
                    {index < DELIVERY_TIMELINE_STEPS.length - 1 ? (
                      <View
                        style={[
                          styles.timelineLine,
                          step.done && styles.timelineLineDone,
                        ]}
                      />
                    ) : null}
                  </View>
                  <View style={styles.timelineTextCol}>
                    <Text
                      style={[
                        styles.timelineLabel,
                        step.done && styles.timelineLabelDone,
                        step.active && styles.timelineLabelActive,
                      ]}
                    >
                      {t(`orders.delivery.steps.${step.key}`)}
                    </Text>
                    {step.active ? (
                      <Text style={styles.timelineSub}>{t('orders.courierRoute')}</Text>
                    ) : null}
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        <Text
          style={[
            styles.pastHeading,
            { marginTop: active ? Theme.spacing.xl : Theme.spacing.sm },
          ]}
        >
          {t('orders.pastRescues')}
        </Text>
        {past.map((o, i) => (
          <OrderListLine key={o.id} order={o} isLast={i === past.length - 1} />
        ))}
      </ScrollView>

      <BottomTabBar
        activeTab={activeTab || 'orders'}
        onTabPress={onTabPress || (() => {})}
        cartCount={cartCount}
      />
    </View>
  );
}

function OrderListLine({
  order,
  isLast,
}: {
  order: (typeof MOCK_ORDERS)[0];
  isLast: boolean;
}) {
  const { t } = useLanguage();
  const done = order.status === 'completed';
  const windowText = done
    ? t('orders.pickedUp')
    : t(`bags.${order.bagId}.pickup`, order.pickupWindow);

  return (
    <View>
      <Pressable style={styles.pastRow} onPress={() => {}} accessibilityRole="button">
        <View style={styles.pastLeft}>
          <Text style={styles.pastStore}>{t(`stores.${order.storeId}.name`, order.storeName)}</Text>
          <Text style={styles.pastBag} numberOfLines={1}>
            {t(`bags.${order.bagId}.title`, order.bagTitle)}
          </Text>
          <Text style={styles.pastMeta}>
            {windowText}
            {' · '}
            {t(`orders.dateLabels.${order.id}`, order.dateLabel)}
          </Text>
        </View>
        <View style={styles.pastRight}>
          <OmrCurrency
            amount={order.price}
            variant="full"
            textStyle={styles.pastPrice}
            iconSize={14}
            iconTintColor={Theme.colors.primaryDark}
          />
          {done ? (
            <Ionicons
              name="checkmark-circle"
              size={18}
              color={Theme.colors.primary}
              style={styles.pastCheck}
            />
          ) : null}
        </View>
      </Pressable>
      {!isLast ? <View style={styles.pastDivider} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  header: {
    paddingBottom: Theme.spacing.md,
  },
  topHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
    marginBottom: Theme.spacing.sm,
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
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Theme.colors.text.primary,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 14,
    color: Theme.colors.text.muted,
    marginTop: 4,
    lineHeight: 20,
  },
  scroll: {
    flex: 1,
  },
  scrollInner: {
    paddingHorizontal: PAD,
    paddingBottom: 110,
  },
  activeSection: {
    marginBottom: Theme.spacing.sm,
  },
  activeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.md,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(249,115,22,0.12)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Theme.borderRadius.full,
  },
  pulseDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Theme.colors.primary,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '700',
    color: Theme.colors.primaryDark,
  },
  activeEta: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.colors.text.primary,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: LINE,
    marginVertical: Theme.spacing.md,
  },
  kicker: {
    fontSize: 11,
    fontWeight: '700',
    color: Theme.colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  orderSummaryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Theme.spacing.md,
  },
  summaryThumb: {
    width: 56,
    height: 56,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  summaryThumbPh: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryTextCol: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Theme.colors.text.primary,
    lineHeight: 21,
  },
  summaryStore: {
    fontSize: 14,
    fontWeight: '600',
    color: Theme.colors.text.muted,
  },
  summaryPickup: {
    fontSize: 13,
    fontWeight: '600',
    color: Theme.colors.primaryDark,
    marginTop: 2,
  },
  summaryPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: Theme.colors.primaryDark,
    marginTop: 4,
  },
  timelineKicker: {
    fontSize: 11,
    fontWeight: '700',
    color: Theme.colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  timelineRow: {
    flexDirection: 'row',
    minHeight: 48,
  },
  timelineRail: {
    width: 24,
    alignItems: 'center',
  },
  timelineDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: 'rgba(42,63,78,0.2)',
    backgroundColor: Theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineDotDone: {
    borderColor: Theme.colors.primary,
    backgroundColor: Theme.colors.primary,
  },
  timelineDotActive: {
    borderColor: Theme.colors.primaryDark,
  },
  timelineDotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(42,63,78,0.25)',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    minHeight: 14,
    marginVertical: 3,
    backgroundColor: 'rgba(42,63,78,0.1)',
    borderRadius: 1,
  },
  timelineLineDone: {
    backgroundColor: 'rgba(249,115,22,0.4)',
  },
  timelineTextCol: {
    flex: 1,
    paddingBottom: 10,
    paddingLeft: 8,
  },
  timelineLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Theme.colors.text.muted,
  },
  timelineLabelDone: {
    color: Theme.colors.text.primary,
  },
  timelineLabelActive: {
    fontWeight: '800',
    color: Theme.colors.primaryDark,
  },
  timelineSub: {
    fontSize: 12,
    color: Theme.colors.text.muted,
    marginTop: 3,
  },
  pastHeading: {
    fontSize: 11,
    fontWeight: '700',
    color: Theme.colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  pastRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 12,
    gap: 12,
  },
  pastLeft: {
    flex: 1,
    minWidth: 0,
  },
  pastStore: {
    fontSize: 15,
    fontWeight: '700',
    color: Theme.colors.text.primary,
  },
  pastBag: {
    fontSize: 13,
    color: Theme.colors.text.muted,
    marginTop: 2,
  },
  pastMeta: {
    fontSize: 12,
    color: Theme.colors.text.muted,
    marginTop: 6,
    lineHeight: 16,
  },
  pastRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  pastPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: Theme.colors.primaryDark,
  },
  pastCheck: {
    marginTop: 2,
  },
  pastDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: LINE,
  },
});
