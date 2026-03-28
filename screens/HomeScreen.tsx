import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Pressable,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from '../constants/theme';
import BottomTabBar from '../components/BottomTabBar';
import DeliveryLocationBar from '../components/DeliveryLocationBar';
import FeaturedRescueCarousel from '../components/FeaturedRescueCarousel';
import QuickActionTiles from '../components/QuickActionTiles';
import NearbyStoresMap from '../components/NearbyStoresMap';
import ReserveBagModal from '../components/ReserveBagModal';
import {
  getFeaturedOffers,
  type PartnerStore,
  type RescueBag,
} from '../constants/mockData';
import { useLanguage } from '../contexts/LanguageContext';

const HOME_HEADER_CONTENT_HEIGHT = 48;
const SCREEN_HPAD = Theme.spacing.sm + Theme.spacing.xs;

type HomeScreenProps = {
  onProfilePress?: () => void;
  onNotificationsPress?: () => void;
  onReportsPress?: () => void;
  onOrdersPress?: () => void;
  onDiscoverPress?: () => void;
  /** Open partner (store) detail from map pin */
  onStoreFromMapPress?: (storeId: string) => void;
  activeTab?: string;
  onTabPress?: (tabId: string) => void;
  cartCount?: number;
  onAddToCart?: (store: PartnerStore, bag: RescueBag, qty: number) => void;
};

export default function HomeScreen({
  onProfilePress,
  onNotificationsPress,
  onReportsPress,
  onOrdersPress,
  onDiscoverPress,
  onStoreFromMapPress,
  activeTab = 'home',
  onTabPress,
  cartCount = 0,
  onAddToCart,
}: HomeScreenProps) {
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const gutter = SCREEN_HPAD;
  const headerTop = insets.top + Theme.spacing.sm;
  const [reserveVisible, setReserveVisible] = useState(false);
  const [quickPick, setQuickPick] = useState<{
    store: PartnerStore;
    bag: RescueBag;
  } | null>(null);

  const openQuickReserve = () => {
    const first = getFeaturedOffers()[0];
    if (first) {
      setQuickPick(first);
      setReserveVisible(true);
    }
  };

  const handleActionPress = (action: string) => {
    if (action === 'reserve-quick') {
      openQuickReserve();
    } else if (action === 'history') {
      onReportsPress?.();
    } else if (action === 'orders') {
      onOrdersPress?.();
    } else if (action === 'discover' || action === 'favorites') {
      onDiscoverPress?.();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.headerRow,
            {
              marginTop: headerTop,
              minHeight: HOME_HEADER_CONTENT_HEIGHT,
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
        <FeaturedRescueCarousel
          onSeeDiscover={onDiscoverPress}
          onAddToCart={onAddToCart}
        />
        <QuickActionTiles onActionPress={handleActionPress} />
        <NearbyStoresMap onPartnerPress={onStoreFromMapPress} />
      </ScrollView>
      <BottomTabBar
        activeTab={activeTab}
        onTabPress={onTabPress || (() => {})}
        cartCount={cartCount}
      />
      <ReserveBagModal
        visible={reserveVisible}
        onClose={() => {
          setReserveVisible(false);
          setQuickPick(null);
        }}
        storeName={quickPick?.store.name}
        bag={quickPick?.bag ?? null}
        mode="cart"
        onConfirmQty={(qty) => {
          if (quickPick) onAddToCart?.(quickPick.store, quickPick.bag, qty);
        }}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
});
