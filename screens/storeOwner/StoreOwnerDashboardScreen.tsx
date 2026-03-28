import React, { useMemo } from 'react';
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../../constants/theme';
import StoreOwnerTabBar from '../../components/StoreOwnerTabBar';
import StoreOwnerHeader from '../../components/StoreOwnerHeader';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  getStoreById,
  getStoreOwnerIncomingOrders,
  getStoreOwnerMessageThreads,
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

/** Mock partner KPIs (replace with API). */
const MOCK_TODAY_REVENUE = 18.6;
const MOCK_ORDERS_TODAY = 8;
const MOCK_PICKUP_SUMMARY = 'Today · 5:00–10:00 PM';

export default function StoreOwnerDashboardScreen({
  storeId,
  activeTab,
  onTabPress,
  onNotificationsPress,
  onSupportChatPress,
  messageUnreadCount = 0,
}: Props) {
  const { t } = useLanguage();
  const store = getStoreById(storeId);
  const orders = useMemo(() => getStoreOwnerIncomingOrders(storeId), [storeId]);
  const newCount = orders.filter((o) => o.status === 'new').length;
  const readyCount = orders.filter((o) => o.status === 'ready').length;
  const threads = getStoreOwnerMessageThreads(storeId);
  const unreadMessages = threads.filter((x) => x.unread).length;

  const listingsActive = store?.bags.reduce((n, b) => n + (b.left > 0 ? 1 : 0), 0) ?? 0;
  const displayName = store?.name ?? 'Partner';

  const comingSoon = () =>
    Alert.alert(t('storeOwner.comingSoonTitle'), t('storeOwner.comingSoonPayouts'));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollInner}
        showsVerticalScrollIndicator={false}
      >
        <StoreOwnerHeader
          title={t('storeOwner.tabs.dashboard')}
          subtitle={t('storeOwner.dashboardWelcome', undefined, { name: displayName })}
          onNotificationsPress={onNotificationsPress}
          onTabPress={onTabPress}
          onSupportChatPress={onSupportChatPress}
          activeTab={activeTab}
        />

        <View style={[styles.brandStrip, { paddingHorizontal: SCREEN_HPAD }]}>
          <Image source={store?.logo || store?.image} style={styles.brandLogo} contentFit="cover" />
          <View style={styles.brandMeta}>
            <Text style={styles.brandName} numberOfLines={1}>
              {displayName}
            </Text>
            <Text style={styles.brandTag} numberOfLines={2}>
              {store?.tagline}
            </Text>
          </View>
        </View>

        <LinearGradient
          colors={['rgba(249, 115, 22, 0.22)', 'rgba(249, 115, 22, 0.06)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.revenueCard, { marginHorizontal: SCREEN_HPAD }]}
        >
          <View style={styles.revenueTop}>
            <View>
              <Text style={styles.revenueLabel}>{t('storeOwner.dashboardRevenueLabel')}</Text>
              <View style={styles.revenueRow}>
                <OmrCurrency
                  amount={MOCK_TODAY_REVENUE}
                  variant="full"
                  textStyle={styles.revenueAmt}
                  iconSize={22}
                  iconTintColor={Theme.colors.primaryDark}
                />
              </View>
              <Text style={styles.revenueHint}>{t('storeOwner.dashboardRevenueHint')}</Text>
            </View>
            <View style={styles.revenueBadge}>
              <Ionicons name="trending-up" size={22} color={Theme.colors.primaryDark} />
            </View>
          </View>
          <View style={styles.revenueDivider} />
          <View style={styles.revenueBottom}>
            <View style={styles.revenueStat}>
              <Text style={styles.revenueStatVal}>{MOCK_ORDERS_TODAY}</Text>
              <Text style={styles.revenueStatLbl}>{t('storeOwner.dashboardOrdersToday')}</Text>
            </View>
            <View style={styles.revenueVline} />
            <View style={styles.revenueStatWide}>
              <Text style={styles.revenueStatLbl}>{t('storeOwner.dashboardPickupLabel')}</Text>
              <Text style={styles.pickupVal}>{MOCK_PICKUP_SUMMARY}</Text>
            </View>
          </View>
        </LinearGradient>

        <Text style={[styles.sectionLabel, { paddingHorizontal: SCREEN_HPAD }]}>
          {t('storeOwner.quickActions')} · {t('storeOwner.statTapHint')}
        </Text>
        <View style={[styles.statRow, { paddingHorizontal: SCREEN_HPAD }]}>
          <Pressable
            style={({ pressed }) => [styles.statCard, pressed && styles.statPressed]}
            onPress={() => onTabPress('owner-orders')}
          >
            <Text style={styles.statValue}>{newCount}</Text>
            <Text style={styles.statLabel}>{t('storeOwner.statNewOrders')}</Text>
            <Text style={styles.statCta}>{t('storeOwner.linkOpenOrders')}</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.statCard, pressed && styles.statPressed]}
            onPress={() => onTabPress('owner-orders')}
          >
            <Text style={styles.statValue}>{readyCount}</Text>
            <Text style={styles.statLabel}>{t('storeOwner.statReadyPickup')}</Text>
            <Text style={styles.statCta}>{t('storeOwner.linkOpenOrders')}</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.statCard, pressed && styles.statPressed]}
            onPress={() => onTabPress('owner-listings')}
          >
            <Text style={styles.statValue}>{listingsActive}</Text>
            <Text style={styles.statLabel}>{t('storeOwner.statLiveListings')}</Text>
            <Text style={styles.statCta}>{t('storeOwner.linkOpenListings')}</Text>
          </Pressable>
        </View>

        <Text style={[styles.sectionTitle, { paddingHorizontal: SCREEN_HPAD }]}>
          {t('storeOwner.dashboardToolsTitle')}
        </Text>
        <View style={[styles.toolsGrid, { paddingHorizontal: SCREEN_HPAD }]}>
          <Pressable
            style={({ pressed }) => [styles.toolTile, pressed && styles.toolPressed]}
            onPress={comingSoon}
          >
            <View style={styles.toolIcon}>
              <Ionicons name="bar-chart-outline" size={24} color={Theme.colors.primary} />
            </View>
            <Text style={styles.toolTitle}>{t('storeOwner.toolInsights')}</Text>
            <Text style={styles.toolSub}>{t('storeOwner.toolInsightsSub')}</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.toolTile, pressed && styles.toolPressed]}
            onPress={comingSoon}
          >
            <View style={styles.toolIcon}>
              <Ionicons name="pricetag-outline" size={24} color={Theme.colors.primary} />
            </View>
            <Text style={styles.toolTitle}>{t('storeOwner.toolPromo')}</Text>
            <Text style={styles.toolSub}>{t('storeOwner.toolPromoSub')}</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.toolTile, pressed && styles.toolPressed]}
            onPress={comingSoon}
          >
            <View style={styles.toolIcon}>
              <Ionicons name="download-outline" size={24} color={Theme.colors.primary} />
            </View>
            <Text style={styles.toolTitle}>{t('storeOwner.toolExport')}</Text>
            <Text style={styles.toolSub}>{t('storeOwner.toolExportSub')}</Text>
          </Pressable>
        </View>

        <Text style={[styles.sectionTitle, { paddingHorizontal: SCREEN_HPAD }]}>
          {t('storeOwner.manageTitle')}
        </Text>
        <View style={[styles.manageCol, { paddingHorizontal: SCREEN_HPAD }]}>
          <Pressable
            style={({ pressed }) => [styles.manageRow, pressed && styles.managePressed]}
            onPress={() => onTabPress('owner-listings')}
          >
            <Ionicons name="time-outline" size={22} color={Theme.colors.primary} />
            <View style={styles.manageMid}>
              <Text style={styles.manageTitle}>{t('storeOwner.managePickupWindows')}</Text>
              <Text style={styles.manageSub}>{t('storeOwner.managePickupWindowsSub')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Theme.colors.text.muted} />
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.manageRow, pressed && styles.managePressed]}
            onPress={comingSoon}
          >
            <Ionicons name="cube-outline" size={22} color={Theme.colors.primary} />
            <View style={styles.manageMid}>
              <Text style={styles.manageTitle}>{t('storeOwner.manageInventory')}</Text>
              <Text style={styles.manageSub}>{t('storeOwner.manageInventorySub')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Theme.colors.text.muted} />
          </Pressable>
        </View>

        <Text style={[styles.sectionTitle, { paddingHorizontal: SCREEN_HPAD }]}>
          {t('storeOwner.quickLinksTitle')}
        </Text>
        <View style={[styles.linkStack, { paddingHorizontal: SCREEN_HPAD }]}>
          <Pressable
            style={({ pressed }) => [styles.linkBtn, pressed && styles.linkPressed]}
            onPress={() => onTabPress('owner-messages')}
          >
            <Ionicons name="chatbubbles-outline" size={22} color={Theme.colors.white} />
            <Text style={styles.linkBtnTxt}>
              {unreadMessages
                ? t('storeOwner.actionMessagesUnread', undefined, { n: String(unreadMessages) })
                : t('storeOwner.actionMessages')}
            </Text>
            <Ionicons name="arrow-forward" size={18} color="rgba(255,255,255,0.9)" />
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.linkBtnOutline, pressed && styles.linkPressed]}
            onPress={() => onSupportChatPress?.()}
          >
            <Ionicons name="headset-outline" size={22} color={Theme.colors.primary} />
            <Text style={styles.linkBtnOutlineTxt}>{t('storeOwner.menuHelp')}</Text>
          </Pressable>
        </View>

        <View style={[styles.tipCard, { marginHorizontal: SCREEN_HPAD }]}>
          <Ionicons name="leaf-outline" size={20} color={Theme.colors.whatsapp} />
          <Text style={styles.tipText}>{t('storeOwner.tipSurplus')}</Text>
        </View>
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
  scrollInner: { paddingBottom: 120 },
  brandStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: Theme.spacing.md,
  },
  brandLogo: { width: 52, height: 52, borderRadius: 14, backgroundColor: '#E2E8F0' },
  brandMeta: { flex: 1, minWidth: 0 },
  brandName: { fontSize: 17, fontWeight: '900', color: Theme.colors.text.primary },
  brandTag: { marginTop: 2, fontSize: 13, fontWeight: '600', color: Theme.colors.text.muted },
  revenueCard: {
    borderRadius: Theme.borderRadius.lg,
    padding: 16,
    marginBottom: Theme.spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.35)',
  },
  revenueTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  revenueLabel: { fontSize: 12, fontWeight: '800', color: Theme.colors.text.muted, textTransform: 'uppercase', letterSpacing: 0.4 },
  revenueRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  revenueAmt: { fontSize: 32, fontWeight: '900', color: Theme.colors.primaryDark },
  revenueHint: { marginTop: 6, fontSize: 12, fontWeight: '600', color: Theme.colors.text.muted },
  revenueBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  revenueDivider: { height: 1, backgroundColor: 'rgba(42,63,78,0.1)', marginVertical: 14 },
  revenueBottom: { flexDirection: 'row', alignItems: 'center' },
  revenueStat: { flex: 1, alignItems: 'center' },
  revenueStatWide: { flex: 2, paddingLeft: 8 },
  revenueStatVal: { fontSize: 22, fontWeight: '900', color: Theme.colors.text.primary },
  revenueStatLbl: { fontSize: 11, fontWeight: '700', color: Theme.colors.text.muted, marginTop: 2 },
  pickupVal: { marginTop: 4, fontSize: 14, fontWeight: '800', color: Theme.colors.primaryDark },
  revenueVline: { width: 1, height: 36, backgroundColor: 'rgba(42,63,78,0.1)' },
  sectionLabel: { fontSize: 12, fontWeight: '800', color: Theme.colors.text.muted, marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '900', marginBottom: 10, marginTop: 4 },
  statRow: { flexDirection: 'row', gap: 8, marginBottom: Theme.spacing.lg },
  statCard: {
    flex: 1,
    backgroundColor: Theme.colors.white,
    borderRadius: Theme.borderRadius.md,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(42,63,78,0.08)',
    alignItems: 'center',
  },
  statPressed: { opacity: 0.92, transform: [{ scale: 0.98 }] },
  statValue: { fontSize: 22, fontWeight: '900', color: Theme.colors.primaryDark, textAlign: 'center' },
  statLabel: { marginTop: 4, fontSize: 11, fontWeight: '700', color: Theme.colors.text.muted, textAlign: 'center' },
  statCta: { marginTop: 6, fontSize: 10, fontWeight: '800', color: Theme.colors.primary, textAlign: 'center' },
  toolsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: Theme.spacing.lg },
  toolTile: {
    width: '31%',
    flexGrow: 1,
    minWidth: 100,
    backgroundColor: Theme.colors.white,
    borderRadius: Theme.borderRadius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(42,63,78,0.08)',
    gap: 6,
  },
  toolPressed: { opacity: 0.9 },
  toolIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(249, 115, 22, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolTitle: { fontSize: 13, fontWeight: '900', color: Theme.colors.text.primary },
  toolSub: { fontSize: 11, fontWeight: '600', color: Theme.colors.text.muted, lineHeight: 14 },
  manageCol: { gap: 8, marginBottom: Theme.spacing.md },
  manageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Theme.colors.white,
    borderRadius: Theme.borderRadius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(42,63,78,0.08)',
  },
  managePressed: { opacity: 0.92 },
  manageMid: { flex: 1, minWidth: 0 },
  manageTitle: { fontSize: 15, fontWeight: '800', color: Theme.colors.text.primary },
  manageSub: { marginTop: 2, fontSize: 12, fontWeight: '600', color: Theme.colors.text.muted },
  linkStack: { gap: 10, marginBottom: Theme.spacing.md },
  linkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Theme.colors.primary,
    paddingVertical: 14,
    borderRadius: Theme.borderRadius.md,
  },
  linkBtnTxt: { flex: 1, fontSize: 16, fontWeight: '900', color: Theme.colors.white },
  linkBtnOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 2,
    borderColor: Theme.colors.primary,
    paddingVertical: 14,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Theme.colors.white,
  },
  linkBtnOutlineTxt: { fontSize: 16, fontWeight: '900', color: Theme.colors.primary },
  linkPressed: { opacity: 0.92 },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: Theme.spacing.sm,
    padding: 14,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: 'rgba(34, 197, 94, 0.08)',
  },
  tipText: { flex: 1, fontSize: 13, fontWeight: '600', color: Theme.colors.text.primary, lineHeight: 18 },
});
