import React, { useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../../constants/theme';
import StoreOwnerTabBar from '../../components/StoreOwnerTabBar';
import StoreOwnerHeader from '../../components/StoreOwnerHeader';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  getStoreOwnerIncomingOrders,
  type StoreOwnerIncomingOrder,
  type StoreOwnerIncomingOrderStatus,
} from '../../constants/mockData';
import OmrCurrency from '../../components/OmrCurrency';

const SCREEN_HPAD = Theme.spacing.sm + Theme.spacing.xs;

type Props = {
  storeId: string;
  activeTab: string;
  onTabPress: (tabId: string) => void;
  onNotificationsPress?: () => void;
  onSupportChatPress?: () => void;
  messageUnreadCount?: number;
};

type Filter = 'all' | StoreOwnerIncomingOrderStatus;

const nextStatus = (s: StoreOwnerIncomingOrderStatus): StoreOwnerIncomingOrderStatus => {
  if (s === 'new') return 'preparing';
  if (s === 'preparing') return 'ready';
  return 'new';
};

export default function StoreOwnerOrdersScreen({
  storeId,
  activeTab,
  onTabPress,
  onNotificationsPress,
  onSupportChatPress,
  messageUnreadCount = 0,
}: Props) {
  const { t } = useLanguage();
  const seed = useMemo(() => getStoreOwnerIncomingOrders(storeId), [storeId]);
  const [orders, setOrders] = useState<StoreOwnerIncomingOrder[]>(seed);
  const [filter, setFilter] = useState<Filter>('all');

  const filtered =
    filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  const statusLabel = (s: StoreOwnerIncomingOrderStatus) => {
    if (s === 'new') return t('storeOwner.orderStatusNew');
    if (s === 'preparing') return t('storeOwner.orderStatusPreparing');
    return t('storeOwner.orderStatusReady');
  };

  const bump = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: nextStatus(o.status) } : o))
    );
  };

  const chip = (key: Filter, label: string) => {
    const on = filter === key;
    return (
      <Pressable
        key={key}
        onPress={() => setFilter(key)}
        style={[styles.chip, on && styles.chipOn]}
      >
        <Text style={[styles.chipTxt, on && styles.chipTxtOn]}>{label}</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollInner}
        showsVerticalScrollIndicator={false}
      >
        <StoreOwnerHeader
          title={t('storeOwner.ordersTitle')}
          subtitle={t('storeOwner.ordersSub')}
          onNotificationsPress={onNotificationsPress}
          onTabPress={onTabPress}
          onSupportChatPress={onSupportChatPress}
          activeTab={activeTab}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.chipRow, { paddingHorizontal: SCREEN_HPAD }]}
        >
          {chip('all', t('storeOwner.filterAll'))}
          {chip('new', t('storeOwner.filterNew'))}
          {chip('preparing', t('storeOwner.filterPreparing'))}
          {chip('ready', t('storeOwner.filterReady'))}
        </ScrollView>

        <View style={[styles.actionBar, { paddingHorizontal: SCREEN_HPAD }]}>
          <Pressable
            style={({ pressed }) => [styles.barBtn, pressed && styles.barBtnPressed]}
            onPress={() => onTabPress('owner-listings')}
          >
            <Ionicons name="restaurant-outline" size={18} color={Theme.colors.primary} />
            <Text style={styles.barBtnTxt}>{t('storeOwner.linkOpenListings')}</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.barBtnOutline, pressed && styles.barBtnPressed]}
            onPress={() => Alert.alert(t('storeOwner.comingSoonTitle'), t('storeOwner.comingSoonMaps'))}
          >
            <Ionicons name="print-outline" size={18} color={Theme.colors.primary} />
            <Text style={styles.barBtnOutlineTxt}>{t('storeOwner.toolExport')}</Text>
          </Pressable>
        </View>

        {filtered.map((o) => (
          <View key={o.id} style={[styles.card, { marginHorizontal: SCREEN_HPAD }]}>
            <View style={styles.cardTop}>
              <View style={styles.cardTopLeft}>
                <Text style={styles.customer}>{o.customerLabel}</Text>
                <Text style={styles.placed}>{o.placedAt}</Text>
              </View>
              <View
                style={[
                  styles.pill,
                  o.status === 'new' && styles.pillNew,
                  o.status === 'preparing' && styles.pillPrep,
                  o.status === 'ready' && styles.pillReady,
                ]}
              >
                <Text style={styles.pillText}>{statusLabel(o.status)}</Text>
              </View>
            </View>
            <Text style={styles.items}>{o.itemsSummary}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.meta}>
                {t('storeOwner.qty')}: {o.qty}
              </Text>
              <Text style={styles.meta}> · </Text>
              <View style={styles.pickupRow}>
                <Ionicons name="time-outline" size={14} color={Theme.colors.text.muted} />
                <Text style={styles.meta}> {o.pickupWindow}</Text>
              </View>
            </View>
            <View style={styles.payRow}>
              <Text style={styles.payLabel}>{t('storeOwner.total')}</Text>
              <OmrCurrency
                amount={o.totalOmr}
                variant="full"
                textStyle={styles.payAmount}
                iconSize={14}
                iconTintColor={Theme.colors.primaryDark}
              />
            </View>
            <View style={styles.cardActions}>
              <Pressable
                style={({ pressed }) => [styles.secondaryBtn, pressed && styles.btnPressed]}
                onPress={() => onSupportChatPress?.()}
              >
                <Ionicons name="chatbubble-outline" size={18} color={Theme.colors.primary} />
                <Text style={styles.secondaryTxt}>{t('storeOwner.newMessage')}</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.primaryBtn, pressed && styles.btnPressed]}
                onPress={() => bump(o.id)}
              >
                <Text style={styles.primaryTxt}>{t('storeOwner.advanceStatus')}</Text>
                <Ionicons name="chevron-forward" size={18} color={Theme.colors.white} />
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
      <StoreOwnerTabBar
        activeTab={activeTab}
        onTabPress={onTabPress}
        messageUnreadCount={messageUnreadCount}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  scroll: { flex: 1 },
  scrollInner: { paddingBottom: 120, gap: 10 },
  chipRow: { flexDirection: 'row', gap: 8, marginBottom: 10, paddingVertical: 4 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: 'rgba(42,63,78,0.12)',
  },
  chipOn: {
    backgroundColor: 'rgba(249, 115, 22, 0.15)',
    borderColor: Theme.colors.primary,
  },
  chipTxt: { fontSize: 13, fontWeight: '800', color: Theme.colors.text.muted },
  chipTxtOn: { color: Theme.colors.primaryDark },
  actionBar: { flexDirection: 'row', gap: 8, marginBottom: 6 },
  barBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Theme.colors.white,
    paddingVertical: 12,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.35)',
  },
  barBtnOutline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 2,
    borderColor: Theme.colors.primary,
    backgroundColor: Theme.colors.white,
  },
  barBtnTxt: { fontSize: 13, fontWeight: '900', color: Theme.colors.primaryDark },
  barBtnOutlineTxt: { fontSize: 13, fontWeight: '900', color: Theme.colors.primary },
  barBtnPressed: { opacity: 0.9 },
  card: {
    backgroundColor: Theme.colors.white,
    borderRadius: Theme.borderRadius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(42,63,78,0.08)',
    marginBottom: 4,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  cardTopLeft: { flex: 1, minWidth: 0 },
  customer: { fontSize: 16, fontWeight: '800', color: Theme.colors.text.primary },
  placed: { fontSize: 12, color: Theme.colors.text.muted, marginTop: 2 },
  pill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  pillNew: { backgroundColor: 'rgba(249, 115, 22, 0.15)' },
  pillPrep: { backgroundColor: 'rgba(59, 130, 246, 0.12)' },
  pillReady: { backgroundColor: 'rgba(34, 197, 94, 0.15)' },
  pillText: { fontSize: 11, fontWeight: '800', color: Theme.colors.text.primary },
  items: { fontSize: 14, fontWeight: '700', color: Theme.colors.text.primary, marginBottom: 6 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginBottom: 8 },
  pickupRow: { flexDirection: 'row', alignItems: 'center' },
  meta: { fontSize: 12, color: Theme.colors.text.muted, fontWeight: '600' },
  payRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  payLabel: { fontSize: 13, fontWeight: '700', color: Theme.colors.text.muted },
  payAmount: { fontSize: 16, fontWeight: '900', color: Theme.colors.primaryDark },
  cardActions: { flexDirection: 'row', gap: 8 },
  secondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: Theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.4)',
    backgroundColor: Theme.colors.white,
  },
  secondaryTxt: { fontSize: 14, fontWeight: '800', color: Theme.colors.primary },
  primaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: Theme.borderRadius.sm,
    backgroundColor: Theme.colors.primary,
  },
  primaryTxt: { fontSize: 14, fontWeight: '900', color: Theme.colors.white },
  btnPressed: { opacity: 0.9 },
});
