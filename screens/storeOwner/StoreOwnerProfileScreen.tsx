import React from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../../constants/theme';
import StoreOwnerTabBar from '../../components/StoreOwnerTabBar';
import StoreOwnerHeader from '../../components/StoreOwnerHeader';
import { useLanguage } from '../../contexts/LanguageContext';
import { getStoreById } from '../../constants/mockData';

const SCREEN_HPAD = Theme.spacing.sm + Theme.spacing.xs;

type Props = {
  storeId: string;
  activeTab: string;
  onTabPress: (tabId: string) => void;
  onNotificationsPress?: () => void;
  onSupportChatPress?: () => void;
  onSignOut: () => void;
  messageUnreadCount?: number;
};

export default function StoreOwnerProfileScreen({
  storeId,
  activeTab,
  onTabPress,
  onNotificationsPress,
  onSupportChatPress,
  onSignOut,
  messageUnreadCount = 0,
}: Props) {
  const { t } = useLanguage();
  const store = getStoreById(storeId);

  const row = (
    icon: React.ComponentProps<typeof Ionicons>['name'],
    label: string,
    sub?: string,
    onPress?: () => void
  ) => (
    <Pressable
      style={({ pressed }) => [styles.menuRow, pressed && styles.menuPressed]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.menuIcon}>
        <Ionicons name={icon} size={20} color={Theme.colors.primary} />
      </View>
      <View style={styles.menuText}>
        <Text style={styles.menuLabel}>{label}</Text>
        {sub ? <Text style={styles.menuSub}>{sub}</Text> : null}
      </View>
      {onPress ? <Ionicons name="chevron-forward" size={18} color={Theme.colors.text.muted} /> : null}
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollInner}
        showsVerticalScrollIndicator={false}
      >
        <StoreOwnerHeader
          title={t('storeOwner.profileTitle')}
          subtitle={store?.name}
          onNotificationsPress={onNotificationsPress}
          onTabPress={onTabPress}
          onSupportChatPress={onSupportChatPress}
          activeTab={activeTab}
        />

        <View style={[styles.quickRow, { paddingHorizontal: SCREEN_HPAD }]}>
          <Pressable
            style={({ pressed }) => [styles.quickBtn, pressed && styles.quickPressed]}
            onPress={() => onTabPress('owner-orders')}
          >
            <Ionicons name="bag-handle-outline" size={20} color={Theme.colors.primary} />
            <Text style={styles.quickTxt}>{t('storeOwner.linkOpenOrders')}</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.quickBtn, pressed && styles.quickPressed]}
            onPress={() => onTabPress('owner-listings')}
          >
            <Ionicons name="restaurant-outline" size={20} color={Theme.colors.primary} />
            <Text style={styles.quickTxt}>{t('storeOwner.linkOpenListings')}</Text>
          </Pressable>
        </View>

        <View style={[styles.hero, { marginHorizontal: SCREEN_HPAD }]}>
          <Image source={store?.logo || store?.image} style={styles.heroLogo} contentFit="cover" />
          <View style={styles.heroText}>
            <Text style={styles.heroName}>{store?.name}</Text>
            <Text style={styles.heroTag} numberOfLines={2}>
              {store?.tagline}
            </Text>
          </View>
        </View>

        <View style={[styles.card, { marginHorizontal: SCREEN_HPAD }]}>
          {row(
            'location-outline',
            t('storeOwner.menuAddress'),
            store?.address,
            () => Alert.alert(t('storeOwner.comingSoonTitle'), t('storeOwner.comingSoonMaps'))
          )}
          <View style={styles.divider} />
          {row(
            'time-outline',
            t('storeOwner.menuHours'),
            t('storeOwner.menuHoursSub'),
            () => Alert.alert(t('storeOwner.comingSoonTitle'), t('storeOwner.comingSoonHours'))
          )}
          <View style={styles.divider} />
          {row(
            'card-outline',
            t('storeOwner.menuPayouts'),
            t('storeOwner.menuPayoutsSub'),
            () => Alert.alert(t('storeOwner.comingSoonTitle'), t('storeOwner.comingSoonPayouts'))
          )}
          <View style={styles.divider} />
          {row(
            'shield-checkmark-outline',
            t('storeOwner.menuCompliance'),
            t('storeOwner.menuComplianceSub'),
            () => Alert.alert(t('storeOwner.comingSoonTitle'), t('storeOwner.comingSoonCompliance'))
          )}
        </View>

        <Pressable
          style={[styles.signOut, { marginHorizontal: SCREEN_HPAD }]}
          onPress={() => {
            Alert.alert(t('storeOwner.signOutTitle'), t('storeOwner.signOutConfirm'), [
              { text: t('common.cancel'), style: 'cancel' },
              { text: t('storeOwner.signOutCta'), style: 'destructive', onPress: onSignOut },
            ]);
          }}
        >
          <Ionicons name="log-out-outline" size={20} color="#B91C1C" />
          <Text style={styles.signOutTxt}>{t('storeOwner.signOutCta')}</Text>
        </Pressable>
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
  quickRow: { flexDirection: 'row', gap: 8, marginBottom: Theme.spacing.md },
  quickBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Theme.colors.white,
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.25)',
  },
  quickPressed: { opacity: 0.92 },
  quickTxt: { fontSize: 13, fontWeight: '900', color: Theme.colors.primaryDark },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: Theme.spacing.lg,
  },
  heroLogo: { width: 72, height: 72, borderRadius: 16, backgroundColor: '#E2E8F0' },
  heroText: { flex: 1, minWidth: 0 },
  heroName: { fontSize: 22, fontWeight: '900', color: Theme.colors.text.primary },
  heroTag: { marginTop: 4, fontSize: 14, color: Theme.colors.text.muted, fontWeight: '600' },
  card: {
    backgroundColor: Theme.colors.white,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(42,63,78,0.08)',
    overflow: 'hidden',
    marginBottom: Theme.spacing.lg,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  menuPressed: { backgroundColor: 'rgba(42,63,78,0.04)' },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: { flex: 1, minWidth: 0 },
  menuLabel: { fontSize: 15, fontWeight: '800', color: Theme.colors.text.primary },
  menuSub: { marginTop: 2, fontSize: 12, color: Theme.colors.text.muted, fontWeight: '600' },
  divider: { height: 1, backgroundColor: 'rgba(42,63,78,0.06)', marginLeft: 66 },
  signOut: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(185, 28, 28, 0.25)',
    backgroundColor: 'rgba(185, 28, 28, 0.06)',
  },
  signOutTxt: { fontSize: 16, fontWeight: '800', color: '#B91C1C' },
});
