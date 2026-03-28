import React, { useMemo, useState } from 'react';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from '../constants/theme';
import BottomTabBar from '../components/BottomTabBar';
import DeliveryLocationBar from '../components/DeliveryLocationBar';
import OmrCurrency from '../components/OmrCurrency';
import { useLanguage } from '../contexts/LanguageContext';

export type CartLine = {
  storeId: string;
  storeName: string;
  bagId: string;
  bagTitle: string;
  price: number; // OMR
  retailValue: number; // OMR
  pickupWindow: string;
  left: number;
  image: any;
  qty: number;
};

type CartScreenProps = {
  activeTab?: string;
  onTabPress?: (tabId: string) => void;
  cartCount: number;
  cartLines: CartLine[];
  onCartChange?: (lines: CartLine[]) => void;
  onPlaceOrder: () => void;
  onProfilePress?: () => void;
  onNotificationsPress?: () => void;
};

export default function CartScreen({
  activeTab = 'cart',
  onTabPress,
  cartCount,
  cartLines,
  onCartChange,
  onPlaceOrder,
  onProfilePress,
  onNotificationsPress,
}: CartScreenProps) {
  const { t } = useLanguage();

  const insets = useSafeAreaInsets();
  const SCREEN_HPAD = Theme.spacing.sm + Theme.spacing.xs;
  const gutter = SCREEN_HPAD;
  const headerTop = insets.top + Theme.spacing.sm;

  const [payment, setPayment] = useState<'card' | 'cash'>('card');
  const [deliveryMode, setDeliveryMode] = useState<'pickup' | 'delivery'>('pickup');
  const [useRewards, setUseRewards] = useState<boolean>(false);

  const subtotal = useMemo(
    () => cartLines.reduce((sum, l) => sum + l.price * l.qty, 0),
    [cartLines]
  );
  const deliveryFee = deliveryMode === 'delivery' ? 0.5 : 0;
  const rewardsDiscount = useRewards ? Math.min(2, subtotal * 0.15) : 0;
  const total = subtotal + deliveryFee - rewardsDiscount;

  const updateQty = (idx: number, qty: number) => {
    if (!onCartChange) return;
    onCartChange(
      cartLines.map((l, i) => (i === idx ? { ...l, qty } : l)).filter((l) => l.qty > 0)
    );
  };

  const removeLine = (idx: number) => {
    if (!onCartChange) return;
    onCartChange(cartLines.filter((_, i) => i !== idx));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollInner}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.header,
            {
              marginTop: headerTop,
              paddingHorizontal: gutter,
            },
          ]}
        >
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
                style={styles.iconBtn}
                onPress={onProfilePress}
                accessibilityRole="button"
                accessibilityLabel={t('home.profile')}
              >
                <Ionicons name="person-circle-outline" size={26} color={Theme.colors.primary} />
              </Pressable>
            </View>
          </View>
          <View style={styles.headerTitleCol}>
            <Text style={styles.title}>
              {t('cart.title', 'Cart')}
            </Text>
            <Text style={styles.subtitle}>
              {cartCount} {t('cart.items', 'items')}
            </Text>
          </View>
        </View>
        {cartLines.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="cart-outline" size={34} color={Theme.colors.text.muted} />
            <Text style={styles.emptyTitle}>{t('cart.emptyTitle', 'Your cart is empty')}</Text>
            <Text style={styles.emptySub}>
              {t('cart.emptySub', 'Add an item from any store.')}
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('cart.items', 'Items')}</Text>

              {cartLines.map((l, idx) => (
                <View key={`${l.storeId}-${l.bagId}`} style={styles.lineRow}>
                  <Image source={l.image} style={styles.thumb} contentFit="cover" />
                  <View style={styles.lineMid}>
                    <Text style={styles.lineStore}>{l.storeName}</Text>
                    <Text style={styles.lineTitle} numberOfLines={1}>
                      {l.bagTitle}
                    </Text>
                    <Text style={styles.lineMeta}>
                      <Ionicons name="time-outline" size={12} color={Theme.colors.primary} />{' '}
                      {l.pickupWindow}
                    </Text>
                    <View style={styles.savingsRow}>
                      <Text style={styles.beforeLabel}>{t('cart.before', 'Before')}</Text>
                      <Text style={styles.beforeValue}>
                        {(l.retailValue * l.qty).toFixed(2)} OMR
                      </Text>
                    </View>
                    <Text style={styles.savingText}>
                      {t('cart.youSave', 'You save')} {(Math.max(0, l.retailValue - l.price) * l.qty).toFixed(2)} OMR
                      {' · '}
                      {Math.max(
                        0,
                        Math.round(((Math.max(0, l.retailValue - l.price) / Math.max(l.retailValue, 0.0001)) * 100))
                      )}
                      %
                    </Text>
                    <View style={styles.qtyRow}>
                      <Pressable
                        onPress={() => updateQty(idx, Math.max(1, l.qty - 1))}
                        style={styles.stepBtn}
                      >
                        <Ionicons name="remove" size={16} color={Theme.colors.text.primary} />
                      </Pressable>
                      <Text style={styles.qtyText}>{l.qty}</Text>
                      <Pressable
                        onPress={() => updateQty(idx, Math.min(l.left, l.qty + 1))}
                        style={styles.stepBtn}
                      >
                        <Ionicons name="add" size={16} color={Theme.colors.text.primary} />
                      </Pressable>
                    </View>
                  </View>

                  <View style={styles.lineRight}>
                    <OmrCurrency
                      amount={l.price * l.qty}
                      variant="full"
                      iconSize={14}
                      iconTintColor={Theme.colors.primary}
                      textStyle={styles.linePrice}
                    />
                    <Pressable onPress={() => removeLine(idx)} style={styles.removeBtn}>
                      <Ionicons name="trash-outline" size={18} color={Theme.colors.text.muted} />
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('cart.checkout', 'Checkout')}</Text>

              <Text style={styles.subSectionHeading}>{t('cart.payment', 'Payment')}</Text>
              <View style={styles.choiceRow}>
                <Pressable
                  onPress={() => setPayment('card')}
                  style={[styles.choice, payment === 'card' && styles.choiceActive]}
                >
                  <Ionicons name="card-outline" size={18} color={Theme.colors.primary} />
                  <Text style={styles.choiceTxt}>{t('cart.payCard', 'Card')}</Text>
                </Pressable>
                <Pressable
                  onPress={() => setPayment('cash')}
                  style={[styles.choice, payment === 'cash' && styles.choiceActive]}
                >
                  <Ionicons name="cash-outline" size={18} color={Theme.colors.primary} />
                  <Text style={styles.choiceTxt}>{t('cart.payCash', 'Cash')}</Text>
                </Pressable>
              </View>

              <Text style={styles.subSectionHeading}>
                {t('cart.pickupOrDelivery', 'Pickup or delivery')}
              </Text>
              <View style={styles.choiceRow}>
                <Pressable
                  onPress={() => setDeliveryMode('pickup')}
                  style={[styles.choice, deliveryMode === 'pickup' && styles.choiceActive]}
                >
                  <Ionicons name="bag-handle-outline" size={18} color={Theme.colors.primary} />
                  <Text style={styles.choiceTxt}>{t('cart.pickup', 'Pickup')}</Text>
                </Pressable>
                <Pressable
                  onPress={() => setDeliveryMode('delivery')}
                  style={[styles.choice, deliveryMode === 'delivery' && styles.choiceActive]}
                >
                  <Ionicons name="bicycle-outline" size={18} color={Theme.colors.primary} />
                  <Text style={styles.choiceTxt}>
                    {t('cart.delivery', 'Delivery')}
                    {deliveryMode === 'delivery' ? ' +' : ''}
                  </Text>
                </Pressable>
              </View>

              <Pressable
                onPress={() => setUseRewards((v) => !v)}
                style={[styles.rewardRow, useRewards && styles.rewardRowActive]}
              >
                <Ionicons name="sparkles-outline" size={18} color={Theme.colors.primary} />
                <Text style={styles.rewardTxt}>
                  {t('cart.useRewards', 'Use rewards')}
                </Text>
              </Pressable>
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.sumRow}>
                <Text style={styles.sumLabel}>{t('cart.subtotal', 'Subtotal')}</Text>
                <OmrCurrency
                  amount={subtotal}
                  variant="short"
                  iconSize={14}
                  iconTintColor={Theme.colors.primaryDark}
                />
              </View>
              <View style={styles.sumRow}>
                <Text style={styles.sumLabel}>{t('cart.deliveryFee', 'Delivery fee')}</Text>
                <Text style={styles.sumValue}>
                  {deliveryFee === 0 ? '0' : deliveryFee.toFixed(2)}
                  {' OMR'}
                </Text>
              </View>
              {useRewards ? (
                <View style={styles.sumRow}>
                  <Text style={styles.sumLabel}>{t('cart.rewards', 'Rewards')}</Text>
                  <Text style={[styles.sumValue, { color: Theme.colors.primary }]}>
                    -{rewardsDiscount.toFixed(2)} OMR
                  </Text>
                </View>
              ) : null}
              <View style={styles.sumRowTotal}>
                <Text style={styles.sumTotalLabel}>{t('cart.total', 'Total')}</Text>
                <Text style={styles.sumTotalValue}>{total.toFixed(2)} OMR</Text>
              </View>

              <Pressable
                onPress={onPlaceOrder}
                style={styles.placeOrderBtn}
                accessibilityRole="button"
                accessibilityLabel={t('cart.placeOrder', 'Place order')}
              >
                <Text style={styles.placeOrderTxt}>{t('cart.placeOrder', 'Place order')}</Text>
                <Ionicons name="arrow-forward" size={18} color="#fff" />
              </Pressable>
            </View>
          </>
        )}
      </ScrollView>

      <BottomTabBar activeTab={activeTab} onTabPress={onTabPress || (() => {})} cartCount={cartCount} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  header: { marginBottom: Theme.spacing.sm },
  topHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
    marginBottom: 10,
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
  iconBtn: { padding: Theme.spacing.xs },
  headerTitleCol: { flexDirection: 'column', gap: 4 },
  title: { fontSize: 26, fontWeight: '800', color: Theme.colors.text.primary },
  subtitle: { fontSize: 13, color: Theme.colors.text.muted, fontWeight: '700' },
  scroll: { flex: 1 },
  scrollInner: { paddingTop: Theme.spacing.sm, paddingHorizontal: Theme.spacing.sm + Theme.spacing.xs, paddingBottom: 120 },
  empty: {
    paddingVertical: 60,
    alignItems: 'center',
    gap: 10,
  },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: Theme.colors.text.primary },
  emptySub: { fontSize: 13, color: Theme.colors.text.muted, textAlign: 'center' },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: Theme.colors.text.primary, marginBottom: 10 },
  lineRow: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  thumb: { width: 64, height: 64, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.04)' },
  lineMid: { flex: 1, minWidth: 0 },
  lineStore: { fontSize: 12, color: Theme.colors.primaryDark, fontWeight: '800', marginBottom: 4 },
  lineTitle: { fontSize: 14, fontWeight: '800', color: Theme.colors.text.primary, marginBottom: 4 },
  lineMeta: { fontSize: 12, color: Theme.colors.text.muted, fontWeight: '600' },
  savingsRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 5 },
  beforeLabel: { fontSize: 11, color: Theme.colors.text.muted, fontWeight: '700' },
  beforeValue: {
    fontSize: 11,
    color: Theme.colors.text.muted,
    fontWeight: '700',
    textDecorationLine: 'line-through',
  },
  savingText: {
    fontSize: 11,
    color: Theme.colors.primaryDark,
    fontWeight: '800',
    marginTop: 2,
  },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 },
  stepBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  qtyText: { fontSize: 14, fontWeight: '800', color: Theme.colors.text.primary, minWidth: 18, textAlign: 'center' },
  lineRight: { width: 88, alignItems: 'flex-end', justifyContent: 'space-between' },
  linePrice: { fontSize: 14, fontWeight: '800', color: Theme.colors.primaryDark },
  removeBtn: { padding: 6, marginTop: 2 },
  subSectionHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: Theme.colors.text.muted,
    marginBottom: 8,
  },
  choiceRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
    width: '100%',
  },
  choice: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(42,63,78,0.12)',
    backgroundColor: '#fff',
  },
  choiceActive: {
    borderColor: Theme.colors.primary,
    backgroundColor: 'rgba(249,115,22,0.08)',
  },
  choiceTxt: { fontSize: 13, fontWeight: '800', color: Theme.colors.text.primary },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(42,63,78,0.12)',
    backgroundColor: '#fff',
  },
  rewardRowActive: {
    borderColor: Theme.colors.primary,
    backgroundColor: 'rgba(249,115,22,0.08)',
  },
  rewardTxt: { fontSize: 13, fontWeight: '800', color: Theme.colors.text.primary },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    padding: 14,
    marginTop: 6,
  },
  sumRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 6 },
  sumRowTotal: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 10, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(0,0,0,0.08)' },
  sumLabel: { fontSize: 13, color: Theme.colors.text.muted, fontWeight: '700' },
  sumValue: { fontSize: 13, color: Theme.colors.text.primary, fontWeight: '800' },
  sumTotalLabel: { fontSize: 15, color: Theme.colors.text.primary, fontWeight: '900' },
  sumTotalValue: { fontSize: 16, color: Theme.colors.primaryDark, fontWeight: '900' },
  placeOrderBtn: {
    marginTop: 12,
    backgroundColor: Theme.colors.primary,
    borderRadius: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  placeOrderTxt: { color: '#fff', fontSize: 15, fontWeight: '900' },
});

